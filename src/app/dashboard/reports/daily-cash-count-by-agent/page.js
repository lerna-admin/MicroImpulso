import * as React from "react";
import { getAllUsers } from "@/app/dashboard/users/hooks/use-users";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { DailyCashCountPerAgent } from "@/components/dashboard/reports/cash-count-per-agent/cash-count-per-agent";

import { getAllBranches } from "../../configuration/branch-managment/hooks/use-branches";
import { getDailyCashCountPerAgent } from "../services/reports";

export const metadata = { title: `Arqueo Diario por Agente | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { date, branch, agent } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { totals, blocks } = await getDailyCashCountPerAgent({
		date,
		userId: user.id,
		branchId: branch,
		agentId: agent,
	});
	delete totals.outstanding;

	const branches = await getAllBranches();
	const branchesFormatted = branches.map(({ id, name }) => ({ id, name }));

	const { data } = await getAllUsers({ role: "AGENT", branchId: branch});
	const agentsFormatted = data.map(({ id, name }) => ({ id, name }));
	
	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<DailyCashCountPerAgent
				data={{ blocks, totals }}
				branches={branchesFormatted}
				agents={agentsFormatted}
				filters={{ date, branch }}
				user={user}
			/>
		</Box>
	);
}
