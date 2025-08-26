import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { AgentActivity } from "@/components/dashboard/reports/agent-activity/agent-activity";

import { getAllBranches } from "../../configuration/branch-managment/hooks/use-branches";
import { getAgentActivity } from "../services/reports";

export const metadata = { title: `Actividad de los Agentes | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate, branch } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { blocks, totals } = await getAgentActivity({ userId: user.id, startDate, endDate, branchId: branch });

	delete totals.disbursementCount;
	delete totals.clientOnboardCount;
	delete totals.documentUploadCount;
	delete totals.branches;
	delete totals.agents;

	const blocksFormatted = blocks.flatMap((block) =>
		(block.agents || []).map((agent) => ({
			name: agent.agentName,
			v1: agent.metrics.loanRequestsCount,
			v2: agent.metrics.fundedCount,
			v3: agent.metrics.repaymentCount,
			v4: agent.metrics.penaltyCount,
		}))
	);

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
			<AgentActivity
				data={blocksFormatted}
				totals={totals}
				branches={branchesFormatted}
				filters={{ startDate, endDate, branch }}
				user={user}
			/>
		</Box>
	);
}
