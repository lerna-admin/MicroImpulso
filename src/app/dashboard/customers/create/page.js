// src/app/dashboard/customers/create/page.js
import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { getUser } from "@/lib/custom-auth/server";
import { CustomerCreateForm } from "@/components/dashboard/customer/customer-create-form";

// Meta
export const metadata = { title: `Crear | Clientes | Dashboard | ${appConfig.name}` };

export default async function Page() {
  const {
    data: { user },
  } = await getUser();

  // Sanitiza props mínimas que requiere el form
  const userProp = {
    id: user?.id ?? null,
    role: user?.role ?? null,
    branchId: user?.branch?.id ?? null,
    countryId: user?.branch?.countryId ?? null
  };

  return (
    <>
      {/* Estilos globales seguros */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .MuiBackdrop-root[aria-hidden="true"] { pointer-events: none !important; }
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

          {/* CustomerCreateForm es un Client Component y ya tiene "use client" en su archivo */}
          <CustomerCreateForm user={userProp} />
        </Stack>
      </Box>
    </>
  );
}
