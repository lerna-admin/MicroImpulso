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

	const { blocks } = await getAgentActivity({ userId: user.id, startDate, endDate, branchId: branch });

	const blocksFormatted = blocks.flatMap((block) =>
		(block.agents || []).map((agent) => ({
			name: agent.agentName,
			v1: agent.metrics.loanRequestsCount,
			v2: agent.metrics.disbursementCount,
			v3: agent.metrics.penaltyCount,
			v4: agent.metrics.repaymentCount,
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
				branches={branchesFormatted}
				filters={{ startDate, endDate, branch }}
				user={user}
			/>
		</Box>
	);
}
