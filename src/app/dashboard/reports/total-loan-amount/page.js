import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { TotalLoanAmount } from "@/components/dashboard/reports/total-loan-amount/total-loan-amount";

import { getAllBranches } from "../../configuration/branch-managment/hooks/use-branches";
import { getTotalLoanAmount } from "../services/reports";

export const metadata = { title: `Monto Prestado Total (Acumulado) | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate, branch } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { totals, blocks } = await getTotalLoanAmount({ userId: user.id, startDate, endDate, branchId: branch });
	const branches = await getAllBranches();
	const branchesFormatted = branches.map(({ id, name }) => ({ id, name }));

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<TotalLoanAmount
				data={{ totals, blocks }}
				filters={{ startDate, endDate, branch }}
				branches={branchesFormatted}
				user={user}
			/>
		</Box>
	);
}
