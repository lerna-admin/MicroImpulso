import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { RequestModal } from "@/components/dashboard/request/request-modal";
import { RequestsFilters } from "@/components/dashboard/request/requests-filters";
import { RequestsPagination } from "@/components/dashboard/request/requests-pagination";
import { RequestsSelectionProvider } from "@/components/dashboard/request/requests-selection-context";
import { RequestsTable } from "@/components/dashboard/request/requests-table";

export const metadata = { title: `Lista | Solicitudes | Dashboard | ${appConfig.name}` };

const requests = [
	{
		id: "ORD-005",
		customer: { name: "Penjani Inyene", avatar: "/assets/avatar-4.png", email: "penjani.inyene@domain.com" },
		lineItems: 1,
		paymentMethod: { type: "visa", last4: "4011" },
		currency: "USD",
		totalAmount: 56.7,
		status: "pending",
		frequency:"Bimensual",
		createdAt: dayjs().subtract(3, "hour").toDate(),
	},
	{
		id: "ORD-004",
		customer: { name: "Jie Yan", avatar: "/assets/avatar-8.png", email: "jie.yan@domain.com" },
		lineItems: 1,
		paymentMethod: { type: "amex", last4: "5678" },
		currency: "USD",
		totalAmount: 49.12,
		status: "approved",
		frequency:"15 - 30",
		createdAt: dayjs().subtract(6, "hour").toDate(),
	},
	{
		id: "ORD-003",
		customer: { name: "Fran Perez", avatar: "/assets/avatar-5.png", email: "fran.perez@domain.com" },
		lineItems: 2,
		paymentMethod: { type: "applepay" },
		currency: "USD",
		totalAmount: 18.75,
		status: "rejected",
		frequency:"5 - 20",
		createdAt: dayjs().subtract(7, "hour").toDate(),
	},
	{
		id: "ORD-002",
		customer: { name: "Carson Darrin", avatar: "/assets/avatar-3.png", email: "carson.darrin@domain.com" },
		lineItems: 1,
		paymentMethod: { type: "googlepay" },
		currency: "USD",
		totalAmount: 49.99,
		status: "rejected",
		frequency:"10 - 25",
		createdAt: dayjs().subtract(1, "hour").subtract(1, "day").toDate(),
	}, 
	{
		id: "ORD-001",
		customer: { name: "Miron Vitold", avatar: "/assets/avatar-1.png", email: "miron.vitold@domain.com" },
		lineItems: 2,
		paymentMethod: { type: "mastercard", last4: "4242" },
		currency: "USD",
		totalAmount: 94.01,
		status: "approved",
		frequency:"Bimensual",
		createdAt: dayjs().subtract(3, "hour").subtract(1, "day").toDate(),
	},
];

export default async function Page({ searchParams }) {
	const { customer, id, previewId, sortDir, status } = await searchParams;

	const sortedRequests = applySort(requests, sortDir);
	const filteredRequests = applyFilters(sortedRequests, { customer, id, status });

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
							<RequestsFilters filters={{ customer, id, status }} sortDir={sortDir} />
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
			return a.createdAt.getTime() - b.createdAt.getTime();
		}

		return b.createdAt.getTime() - a.createdAt.getTime();
	});
}

function applyFilters(row, { customer, id, status }) {
	return row.filter((item) => {
		if (customer && !item.customer?.name?.toLowerCase().includes(customer.toLowerCase())) {
			return false;
		}

		if (id && !item.id?.toLowerCase().includes(id.toLowerCase())) {
			return false;
		}

		if (status && item.status !== status) {
			return false;
		}

		return true;
	});
}
