import * as React from "react";
import { getAllUsers } from "@/app/dashboard/users/hooks/use-users";
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
	const { status, page, limit, type, paymentDay, branch, agent, mora } = await searchParams;
	const normalizedStatus = status ?? "all";
	const statusFilter = status && status !== "all" ? status : "";

	const {
		data: { user },
	} = await getUser();

	const { permissions } = user;

	const statsResponse = await getAllCustomers({
		page: 1,
		limit: 1,
		status: "active",
		branch,
		agent,
		u_id: user.id,
		distinct: true,
	});

	const {
		remainingTotal,
		totalActiveRepayment,
		activeClientsCount,
		mora15,
		critical20,
		noPayment30,
		delinquentClients,
	} = statsResponse;

	const {
		data: customers,
		page: customersPage,
		limit: customerLimit,
		totalItems: customerTotalItems,
	} = await getAllCustomers({
		page,
		limit,
		status: statusFilter,
		mora,
		type,
		paymentDay,
		branch,
		agent,
		u_id: user.id,
	});

	const { data } = await getAllUsers({ branchId: user.branchId, role: "AGENT" });

	const statistics = {
		remainingTotal,
		totalActiveRepayment,
		activeClientsCount,
		mora15,
		critical20,
		noPayment30,
		// Si hay filtro de mora activo, usa el total filtrado
		delinquentClients: mora ? customerTotalItems : delinquentClients,
	};

	const branches = await getAllBranches(user.country?.id);

	const filters = { status: normalizedStatus, page, limit, type, paymentDay, branch, agent, mora };

	const filteredCustomers = customers;

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
				pt: 0,
			}}
		>
			<Stack spacing={4}>
				<Stack spacing={1}>
					<Typography variant="h4">Clientes</Typography>
					<CustomerStatistics
						statistics={statistics}
						filters={{ status: normalizedStatus, page, limit, type, paymentDay, branch, agent, mora }}
					/>
				</Stack>
				<CustomersSelectionProvider customers={customers}>
					<Card>
						<CustomersFilters filters={filters} allBranches={branches} user={user} allAgents={data} />
						<Divider />
						<Stack spacing={2} sx={{ px: 3, py: 2 }}>
							<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
								<CustomersPagination
									filters={{ status: normalizedStatus, page, limit, type, paymentDay, branch, agent, mora }}
									customerTotalItems={customerTotalItems}
									customersPage={customersPage - 1}
									customerLimit={customerLimit}
								/>
							</Box>
							<Box sx={{ overflowX: "auto" }}>
								<CustomersTable
									rows={filteredCustomers}
									permissions={permissions}
									user={user}
									role={user.role}
									branch={user.branch.id}
								/>
							</Box>
						</Stack>
					</Card>
				</CustomersSelectionProvider>
			</Stack>
		</Box>
	);
}
