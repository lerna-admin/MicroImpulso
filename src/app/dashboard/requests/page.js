import * as React from "react";
import { ROLES } from "@/constants/roles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { RequestModal } from "@/components/dashboard/request/request-modal";
import { RequestsFilters } from "@/components/dashboard/request/requests-filters";
import { RequestsPagination } from "@/components/dashboard/request/requests-pagination";
import { RequestsSelectionProvider } from "@/components/dashboard/request/requests-selection-context";
import { RequestsTable } from "@/components/dashboard/request/requests-table";

import { getAllRequests, getRequestsByAgent } from "./hooks/use-requests";

export const metadata = { title: `Solicitudes | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const {
		data: { user },
	} = await getUser();

	const requests = user.role === ROLES.AGENTE ? await getRequestsByAgent(user.id) : await getAllRequests();

	const { name, document, previewId, sortDir, status } = await searchParams;

	const sortedRequests = applySort(requests, sortDir);
	const filteredRequests = applyFilters(sortedRequests, { name, document, status });

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
					<RequestsSelectionProvider requests={filteredRequests}>
						<Card>
							<RequestsFilters
								filters={{ name, document, status }}
								sortDir={sortDir}
								count={filteredRequests.length}
							/>
							<Divider />
							<Box sx={{ overflowX: "auto" }}>
								<RequestsTable rows={filteredRequests} />
							</Box>
							<Divider />
							<RequestsPagination count={filteredRequests.length} page={0} />
						</Card>
					</RequestsSelectionProvider>
				</Stack>
			</Box>
			<RequestModal open={Boolean(previewId)} />
		</React.Fragment>
	);
}

// Sorting and filtering has to be done on the server.

function applySort(row, sortDir) {
	return row.sort((a, b) => {
		if (sortDir === "asc") {
			return dayjs.utc(a.createdAt) - dayjs.utc(b.createdAt);
		}

		return dayjs.utc(b.createdAt) - dayjs.utc(a.createdAt);
	});
}

function applyFilters(row, { name, document, status }) {
	return row.filter((item) => {
		if (name && !item.name?.toLowerCase().includes(name.toLowerCase())) {
			return false;
		}

		if (document && !item.document?.toLowerCase().includes(document.toLowerCase())) {
			return false;
		}

		if (status && item.status !== status) {
			return false;
		}

		return true;
	});
}
