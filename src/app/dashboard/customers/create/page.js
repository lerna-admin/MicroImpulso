// src/app/dashboard/customers/create/page.js
import * as React from "react";
import dynamic from "next/dynamic";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { getUser } from "@/lib/custom-auth/server";

// Meta
export const metadata = { title: `Crear | Clientes | Dashboard | ${appConfig.name}` };

// 👇 Carga dinámica SOLO en el cliente para aislar cualquier overlay/portal de MUI
const CustomerCreateForm = dynamic(
  () =>
    import("@/components/dashboard/customer/customer-create-form").then(
      (m) => m.CustomerCreateForm
    ),
  {
    ssr: false,
    // Loader liviano mientras hidrata el cliente
    loading: () => (
      <Box sx={{ py: 6, textAlign: "center", opacity: 0.7 }}>
        Cargando formulario…
      </Box>
    ),
  }
);

export default async function Page() {
  const {
    data: { user },
  } = await getUser();

  // Sanitiza props mínimas que requiere el form (evita undefined)
  const userProp = {
    id: user?.id ?? null,
    role: user?.role ?? null,
    branchId: user?.branch?.id ?? null,
  };

  return (
    <>
      {/* Estilos globales seguros (no styled-jsx) para evitar que un Backdrop/Modal huérfano capture clics */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Evita que un Backdrop de MUI quede colgado bloqueando navegación */
            .MuiBackdrop-root[aria-hidden="true"] { pointer-events: none !important; }
            /* Asegura z-index razonable de poppers/tooltips */
            .MuiPopover-root, .MuiPopper-root, .MuiTooltip-popper { z-index: 1200 !important; }
          `,
        }}
      />

      <Box
        sx={{
          maxWidth: "var(--Content-maxWidth)",
          m: "var(--Content-margin)",
          p: "var(--Content-padding)",
          width: "var(--Content-width)",
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={3}>
            <div>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.customers.list}
                sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
                variant="subtitle2"
                prefetch={false}
              >
                <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
                Clientes
              </Link>
            </div>
          </Stack>

          {/* Suspense no bloquea navegación; el form se hidrata aparte en cliente */}
          <React.Suspense
            fallback={
              <Box sx={{ py: 6, textAlign: "center", opacity: 0.7 }}>
                Preparando formulario…
              </Box>
            }
          >
            <CustomerCreateForm user={userProp} />
          </React.Suspense>
        </Stack>
      </Box>
    </>
  );
}
