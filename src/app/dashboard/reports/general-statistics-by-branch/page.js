import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { GeneralStatisticsByBranch } from "@/components/dashboard/reports/general-statistics-by-branch/general-statistics-by-branch";

import { getGeneralStatisticsByBranch } from "../services/reports";

export const metadata = { title: `Estadísticas Generales por Sede | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { totals, branches } = await getGeneralStatisticsByBranch({
		userId: user.id,
		startDate: startDate === undefined ? dayjs().format("YYYY-MM-DD") : startDate,
		endDate: endDate === undefined ? dayjs().format("YYYY-MM-DD") : endDate,
	});

	const branchesFormatted = branches.map((br) => ({
		name: br.branchName,
		v1: br.totalLoaned,
		v2: br.totalDisbursed,
		v3: br.totalCollected,
		v4: br.repayments,
		v5: br.penalties,
		v6: br.activeClients,
		v7: br.overdueAmount,
		v8: br.overdueLoans,
		v9: br.netFlow,
	}));

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<GeneralStatisticsByBranch data={{ totals, branchesFormatted }} filters={{ startDate, endDate }} />
		</Box>
	);
}
