import * as React from "react";
import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { PermissionTransferList } from "@/components/dashboard/configuration/permissions-transfer-list";

import { getPermissions } from "../../requests/hooks/use-permissions";

export const metadata = { title: `Reportes | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const permissions = await getPermissions();
	const permissionsFormatted = permissions.map((permission) => ({ id: permission.id, label: permission.label }));
	
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
				<Stack spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Permisos</Typography>
					</Box>
				</Stack>
				<Stack>
					<Card>
						<PermissionTransferList permissions={permissionsFormatted} />
					</Card>
				</Stack>
			</Stack>
		</Box>
	);
}
