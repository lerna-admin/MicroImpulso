import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { DailyCashSummary } from "@/components/dashboard/reports/daily-cash-summary/daily-cash-summary";

import { getDailyCashSummary } from "../services/reports";

export const metadata = { title: `Resumen Diario de Caja | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { date, branch } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { blocks, totals } = await getDailyCashSummary({ date: date, userId: user.id });

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<DailyCashSummary data={{ blocks, totals }} filters={{ date, branch }} user={user} />
		</Box>
	);
}
