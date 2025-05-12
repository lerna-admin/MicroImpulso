import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { UsersFilters } from "@/components/dashboard/users/users-filters";
import { UsersPagination } from "@/components/dashboard/users/users-pagination";
import { UsersSelectionProvider } from "@/components/dashboard/users/users-selection-context";
import { UsersTable } from "@/components/dashboard/users/users-table";

import { getAllUsers } from "./hooks/use-users";

export const metadata = { title: `Agentes | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const users = await getAllUsers();

	const { name, document, sortDir, status } = await searchParams;

	const sortedUsers = applySort(users, sortDir);
	const filteredUsers = applyFilters(sortedUsers, { name, document, status });

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
				<UsersSelectionProvider users={filteredUsers}>
					<Card>
						<UsersFilters filters={{ name, document, status }} sortDir={sortDir} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<UsersTable rows={filteredUsers} />
						</Box>
						<Divider />
						<UsersPagination count={filteredUsers.length + 100} page={0} />
					</Card>
				</UsersSelectionProvider>
			</Stack>
		</Box>
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
