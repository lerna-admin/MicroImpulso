"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Divider, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { paths } from "@/paths";

const tabs = [
	{ label: "Todos", value: "" },
	{ label: "Nuevas", value: "new" },
	{ label: "En estudio", value: "under_review" },
	{ label: "Aprobadas", value: "approved" },
	{ label: "Rechazadas", value: "rejected" },
	{ label: "Completadas", value: "completed" },
	{ label: "Desembolsadas", value: "funded" },
];

export function RequestsFilters({ filters = {}, allBranches, userBranch }) {
	const router = useRouter();
	const { status, limit } = filters;

	const [branchSelected, setBranchSelected] = React.useState(userBranch);

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.status) {
				searchParams.set("status", newFilters.status);
			}
			if (newFilters.page) {
				searchParams.set("page", newFilters.page);
			}
			if (newFilters.limit) {
				searchParams.set("limit", newFilters.limit);
			}
			if (newFilters.branch) {
				searchParams.set("branch", newFilters.branch);
			}

			router.push(`${paths.dashboard.requests.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleStatusChange = React.useCallback(
		(_, value) => {
			updateSearchParams({ ...filters, status: value, page: 1, limit: limit });
		},
		[updateSearchParams, filters]
	);

	const handleBranchChange = React.useCallback(
		({ target }) => {
			const { value } = target;
			setBranchSelected(value);
			updateSearchParams({ ...filters, branch: value, page: 1, limit: limit });
		},
		[updateSearchParams, filters]
	);

	return (
		<div>
			<Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ""} variant="scrollable">
				{tabs.map((tab) => (
					<Tab
						iconPosition="end"
						key={tab.value}
						label={tab.label}
						sx={{ minHeight: "auto" }}
						tabIndex={0}
						value={tab.value}
					/>
				))}
			</Tabs>
			<Divider />
			<Stack
				direction="row"
				spacing={2}
				sx={{ alignItems: "center", justifyContent: "end", flexWrap: "wrap", px: 3, py: 2 }}
			>
				<InputLabel id="branch-label">Sede: </InputLabel>
				<Select
					labelId="branch-label"
					name="branchSelected"
					onChange={handleBranchChange}
					sx={{ maxWidth: "100%", width: "120px", marginTop: "0 !important" }}
					value={branchSelected}
				>
					{allBranches.map((sede) => (
						<MenuItem key={sede.id} value={sede.id}>
							{sede.name}
						</MenuItem>
					))}
				</Select>
			</Stack>
		</div>
	);
}
