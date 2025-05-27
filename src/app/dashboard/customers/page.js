import * as React from "react";
import { ROLES } from "@/constants/roles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { CustomerStatistics } from "@/components/dashboard/customer/customer-statistics";
import { CustomersFilters } from "@/components/dashboard/customer/customers-filters";
import { CustomersPagination } from "@/components/dashboard/customer/customers-pagination";
import { CustomersSelectionProvider } from "@/components/dashboard/customer/customers-selection-context";
import { CustomersTable } from "@/components/dashboard/customer/customers-table";

import { getAllCustomers, getCustomersByAgent } from "./hooks/use-customers";

export const metadata = { title: `Clientes | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const {
		data: { user },
	} = await getUser();

	const { data } = user.role === ROLES.AGENTE ? await getCustomersByAgent(user.id) : await getAllCustomers();

	const customers = data;

	const { email, phone, sortDir, status, document } = await searchParams;

	// const sortedCustomers = applySort(customers, sortDir);
	const filteredCustomers = applyFilters(customers, { status });

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Clientes</Typography>
					</Box>
					<CustomerStatistics customers={customers} />
				</Stack>
				<CustomersSelectionProvider customers={filteredCustomers}>
					<Card>
						<CustomersFilters filters={{ status }} sortDir={sortDir} count={filteredCustomers.length} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<CustomersTable rows={filteredCustomers} />
						</Box>
						<Divider />
						<CustomersPagination totalItems={filteredCustomers.length} />
					</Card>
				</CustomersSelectionProvider>
			</Stack>
		</Box>
	);
}

// Sorting and filtering has to be done on the server.

// function applySort(row, sortDir) {
// 	return row.sort((a, b) => {
// 		if (sortDir === "asc") {
// 			return dayjs.utc(a.createdAt) - dayjs.utc(b.createdAt);
// 		}

// 		return dayjs.utc(b.createdAt) - dayjs.utc(a.createdAt);
// 	});
// }

function applyFilters(row, { status }) {
	return row.filter((item) => {
		if (status && item.status !== status) {
			return false;
		}

		return true;
	});
}
