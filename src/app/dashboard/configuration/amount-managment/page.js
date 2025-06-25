import * as React from "react";
import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { getAllConfigParams } from "@/hooks/use-config";
import { AmountManagment } from "@/components/dashboard/configuration/amount-managment";

export const metadata = { title: `Gestión de montos | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const fundedLimit = await getAllConfigParams("fundedLimit");
	const invoiceLimit = await getAllConfigParams("invoiceLimit");

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
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Gestión de montos</Typography>
					</Box>
				</Stack>
				<Stack>
					<Card>
						<AmountManagment params={{ fundedLimit, invoiceLimit }} />
					</Card>
				</Stack>
			</Stack>
		</Box>
	);
}
