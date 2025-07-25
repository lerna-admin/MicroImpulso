import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { TransactionDetails } from "@/components/dashboard/reports/transaction-details/transaction-details";

export const metadata = { title: `Detalle de Transacciones  | Dashboard | ${appConfig.name}` };

export default async function Page() {
	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<TransactionDetails />
		</Box>
	);
}
