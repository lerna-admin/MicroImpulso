import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { ActiveLoansByStatus } from "@/components/dashboard/reports/active-loans-by-status/active-loans-by-status";

import { getAllBranches } from "../../configuration/branch-managment/hooks/use-branches";
import { getActiveLoansByStatus } from "../services/reports";

export const metadata = { title: `Préstamos Activos por Estado | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { branch } = await searchParams;
	const {
		data: { user },
	} = await getUser();

	const activeLoansByStatus = await getActiveLoansByStatus({ branchId: branch, userId: user.id });
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
			<ActiveLoansByStatus data={activeLoansByStatus} branches={branchesFormatted} filters={{ branch }} user={user} />
		</Box>
	);
}
