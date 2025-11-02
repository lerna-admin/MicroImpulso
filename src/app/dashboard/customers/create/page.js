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
  );
}
