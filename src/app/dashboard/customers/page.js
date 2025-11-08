import * as React from "react";
import { getAllUsers } from "@/app/dashboard/users/hooks/use-users";
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

import { getAllBranches } from "../configuration/branch-managment/hooks/use-branches";
import { getAllCustomers } from "./hooks/use-customers";

export const metadata = { title: `Clientes | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { status, page, limit, type, paymentDay, branch, agent } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { permissions } = user;

	const getCustomers = (role) => {
		if (role === ROLES.AGENTE) return getAllCustomers({ page, limit, status, type, paymentDay, agent: user.id });
		if (role === ROLES.GERENTE) return getAllCustomers({ page, limit, status, type, paymentDay, branch, agent });
		if (role === ROLES.ADMIN)
			return getAllCustomers({ page, limit, status, type, paymentDay, branch: user.branchId, agent });
	};

	const {
		data: customers,
		page: customersPage,
		limit: customerLimit,
		totalItems: customerTotalItems,
		remainingTotal,
		totalActiveRepayment,
		activeClientsCount,
		mora15,
		critical20,
		noPayment30,
	} = await getCustomers(user.role);

	const { data } = await getAllUsers({ branchId: user.branchId, role: "AGENT" });

	const statistics = {
		remainingTotal,
		totalActiveRepayment,
		activeClientsCount,
		mora15,
		critical20,
		noPayment30,
	};

	const branches = await getAllBranches();

	console.log(customers);
	

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
					<CustomerStatistics statistics={statistics} filters={{ status, page, limit, type, paymentDay }} />
				</Stack>
				<CustomersSelectionProvider customers={customers}>
					<Card>
						<CustomersFilters
							filters={{ status, page, limit, type, paymentDay, branch, agent }}
							allBranches={branches}
							user={user}
							allAgents={data}
						/>
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<CustomersTable rows={customers} permissions={permissions} user={user} role={user.role} branch={user.branch.id} />
						</Box>
						<Divider />
						<CustomersPagination
							filters={{ status, page, limit, type, paymentDay }}
							customerTotalItems={customerTotalItems}
							customersPage={customersPage - 1}
							customerLimit={customerLimit}
						/>
					</Card>
				</CustomersSelectionProvider>
			</Stack>
		</Box>
	);
}
