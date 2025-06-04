import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { UsersFilters } from "@/components/dashboard/users/users-filters";
import { UsersPagination } from "@/components/dashboard/users/users-pagination";
import { UsersSelectionProvider } from "@/components/dashboard/users/users-selection-context";
import { UsersTable } from "@/components/dashboard/users/users-table";

import { getAllUsers } from "./hooks/use-users";

export const metadata = { title: `Agentes | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { name, document, page, limit } = await searchParams;

	const {
		data: users,
		total: userTotalItems,
		page: usersPage,
		limit: userLimit,
	} = await getAllUsers({ page, limit, name, document });

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
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Agentes</Typography>
					</Box>
				</Stack>
				<UsersSelectionProvider users={users}>
					<Card>
						<UsersFilters filters={{ name, document, page, limit }} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<UsersTable rows={users} />
						</Box>
						<Divider />
						<UsersPagination
							filters={{ page, limit }}
							userTotalItems={userTotalItems}
							usersPage={usersPage - 1}
							userLimit={userLimit}
						/>
					</Card>
				</UsersSelectionProvider>
			</Stack>
		</Box>
	);
}
