import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { GeneralCashFlow } from "@/components/dashboard/reports/general-cash-flow/general-cash-flow";

import { getGeneralCashFlow } from "../services/reports";

export const metadata = { title: `Flujo de Caja General | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { summary, dailyBreakdown } = await getGeneralCashFlow({ userId: user.id, startDate, endDate });

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<GeneralCashFlow data={{ summary, dailyBreakdown }} filters={{ startDate, endDate }} />
		</Box>
	);
}
