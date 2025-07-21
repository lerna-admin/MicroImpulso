import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { LoanHistoryByClient } from "@/components/dashboard/reports/loan-history-by-client/loan-history-by-client";

export const metadata = { title: `Histórico de Préstamos por Cliente | Dashboard | ${appConfig.name}` };

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
			<LoanHistoryByClient user={user} />
		</Box>
	);
}
