import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { TotalCollectionReceived } from "@/components/dashboard/reports/total-collection-received/total-collection-received";

import { getAllBranches } from "../../configuration/branch-managment/hooks/use-branches";
import { getTotalCollectionReceived } from "../services/reports";

export const metadata = { title: `Recaudo Total (Pagos Recibidos) | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate, branch } = await searchParams;
	const {
		data: { user },
	} = await getUser();

	const { totals, blocks } = await getTotalCollectionReceived({
		userId: user.id,
		startDate,
		endDate,
		branchId: branch,
	});
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
			<TotalCollectionReceived
				data={{ totals, blocks }}
				filters={{ startDate, endDate, branch }}
				branches={branchesFormatted}
			/>
		</Box>
	);
}
