import * as React from "react";
import { getAllBranches } from "@/app/dashboard/requests/hooks/use-branches";
import { ROLES } from "@/constants/roles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { RequestModal } from "@/components/dashboard/request/request-modal";
import { RequestsFilters } from "@/components/dashboard/request/requests-filters";
import { RequestsPagination } from "@/components/dashboard/request/requests-pagination";
import { RequestsSelectionProvider } from "@/components/dashboard/request/requests-selection-context";
import { RequestsTable } from "@/components/dashboard/request/requests-table";

import { getAllUsers } from "../users/hooks/use-users";
import { getAllRequests, getRequestsByAgent } from "./hooks/use-requests";

export const metadata = { title: `Solicitudes | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { previewId, status, page, limit, branch, agent } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { permissions } = user;

	const {
		data: requests,
		page: requestsPage,
		limit: requestLimit,
		totalItems: requestTotalItems,
	} = user.role === ROLES.AGENTE
		? await getRequestsByAgent(user.id, { page, limit, status })
		: await getAllRequests({ page, limit, status, branchId: branch ?? user.branch.id, agentId: agent });

	const branches = await getAllBranches();
	const { data } = await getAllUsers({ branchId: user.branchId, role: "AGENT" });

	return (
		<React.Fragment>
			<Box
				sx={{
					maxWidth: "var(--Content-maxWidth)",
					m: "var(--Content-margin)",
					p: "var(--Content-padding)",
					width: "var(--Content-width)",
				}}
			>
				<Stack spacing={4}>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
						<Box sx={{ flex: "1 1 auto" }}>
							<Typography variant="h4">Solicitudes</Typography>
						</Box>
					</Stack>
					<RequestsSelectionProvider requests={requests}>
						<Card>
							<RequestsFilters
								filters={{ status, page, limit, branch, agent }}
								allBranches={branches}
								allAgents={data}
								user={user}
							/>
							<Divider />
							<Box sx={{ overflowX: "auto" }}>
								<RequestsTable rows={requests} permissions={permissions} role={user.role} />
							</Box>
							<Divider />
							<RequestsPagination
								filters={{ status, page, limit, branch }}
								requestTotalItems={requestTotalItems}
								requestsPage={requestsPage - 1}
								requestLimit={requestLimit}
							/>
						</Card>
					</RequestsSelectionProvider>
				</Stack>
			</Box>
			<RequestModal open={Boolean(previewId)} />
		</React.Fragment>
	);
}
