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
	const { status, page, limit } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const {
		data: customers,
		page: customersPage,
		limit: customerLimit,
		totalItems: customerTotalItems,
		totalActiveAmountBorrowed,
		totalActiveRepayment,
		activeClientsCount,
		mora15,
		critical20,
		noPayment30,
	} = user.role === ROLES.AGENTE ? await getCustomersByAgent(user.id) : await getAllCustomers({ page, limit, status });

	const statistics = {
		totalActiveAmountBorrowed,
		totalActiveRepayment,
		activeClientsCount,
		mora15,
		critical20,
		noPayment30,
	};

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
					<CustomerStatistics statistics={statistics} />
				</Stack>
				<CustomersSelectionProvider customers={customers}>
					<Card>
						<CustomersFilters filters={{ status, page, limit }} count={customers.length} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<CustomersTable rows={customers} />
						</Box>
						<Divider />
						<CustomersPagination
							filters={{ status }}
							customerTotalItems={customerTotalItems}
							customersPage={customersPage}
							customerLimit={customerLimit}
						/>
					</Card>
				</CustomersSelectionProvider>
			</Stack>
		</Box>
	);
}
