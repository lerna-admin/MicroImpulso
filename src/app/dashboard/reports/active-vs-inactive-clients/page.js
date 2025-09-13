import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { ActiveVsInactiveClients } from "@/components/dashboard/reports/active-vs-inactive-clients/active-vs-inactive-clients";

import { getAllBranches } from "../../configuration/branch-managment/hooks/use-branches";
import { getAllUsers } from "../../users/hooks/use-users";
import { getActiveVsInactiveClients } from "../services/reports";

export const metadata = { title: `Clientes Activos vs Inactivos | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { branch, agent } = await searchParams;

	const {
		data: { user },
	} = await getUser();
	const { totals } = await getActiveVsInactiveClients({ userId: user.id, branchId: branch, agentId: agent });

	const branches = await getAllBranches();
	const branchesFormatted = branches.map(({ id, name }) => ({ id, name }));

	const { data } = await getAllUsers({ role: "AGENT", branchId: branch });
	const agentsFormatted = data.map(({ id, name }) => ({ id, name }));

	const agentSelected = data.find((item) => Number(agent) === item.id);

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<ActiveVsInactiveClients
				data={totals}
				branches={branchesFormatted}
				agents={agentsFormatted}
				filters={{ branch }}
				user={user}
				agentSelected={agentSelected}
			/>
		</Box>
	);
}
