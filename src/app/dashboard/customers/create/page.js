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

export const metadata = { title: `Crear | Clientes | Dashboard | ${appConfig.name}` };

export default async function Page() {
  const {
    data: { user },
  } = await getUser();

  return (
    <>
      {/* 🔧 Hotfix de ruta: neutraliza cualquier Backdrop/Modal “perdido” que bloquee clics */}
      <style jsx global>{`
        /* Evita que un Backdrop global capture clics en esta ruta */
        .MuiBackdrop-root {
          pointer-events: none !important;
        }
        /* Asegura que Popper/Tooltip no coloquen una capa por encima del layout */
        .MuiPopover-root,
        .MuiPopper-root,
        .MuiTooltip-popper {
          z-index: 1200 !important; /* Debajo de AppBar/Drawer si los tuyos usan 1300+ */
        }
        /* Si algún Modal quedó abierto por error, no bloqueará interacciones */
        .MuiModal-root {
          pointer-events: none !important;
        }
      `}</style>

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
              >
                <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
                Clientes
              </Link>
            </div>
          </Stack>
          <CustomerCreateForm user={{ id: user.id, role: user.role, branchId: user.branch.id }} />
        </Stack>
      </Box>
    </>
  );
}
