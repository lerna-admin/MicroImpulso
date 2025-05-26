"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { paths } from "@/paths";
import { FilterPopover, useFilterContext } from "@/components/core/filter-button";

export function CustomersFilters({ filters = {}, sortDir = "desc", count }) {
	const [tabs, setTabs] = React.useState([
		{ label: "Todos", value: "", count: 0 },
		{ label: "Activos", value: "active", count: 0 },
		{ label: "Inactivos", value: "inactive", count: 0 },
		{ label: "Rechazados", value: "rejected", count: 0 },
	]);
	const { status } = filters;

	React.useEffect(() => {
		setTabs((tabs) => tabs.map((tab) => (tab.value === status ? { ...tab, count: count } : tab)));
	}, [count, status]);

	const router = useRouter();

	const updateSearchParams = React.useCallback(
		(newFilters, newSortDir) => {
			const searchParams = new URLSearchParams();

			if (newSortDir === "asc") {
				searchParams.set("sortDir", newSortDir);
			}

			if (newFilters.status) {
				searchParams.set("status", newFilters.status);
			}

			if (newFilters.page) {
				searchParams.set("page", newFilters.page);
			}

			if (newFilters.limit) {
				searchParams.set("limit", newFilters.limit);
			}

			router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
		},
		[router]
	);

	// const handleClearFilters = React.useCallback(() => {
	// 	updateSearchParams({}, sortDir);
	// }, [updateSearchParams, sortDir]);

	const handleStatusChange = React.useCallback(
		(_, value) => {
			updateSearchParams({ ...filters, status: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const hasFilters = status;

	return (
		<div>
			<Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ""} variant="scrollable">
				{tabs.map((tab) => (
					<Tab
						icon={tab.value === status && <Chip label={tab.count} size="small" variant="soft" />}
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
			{/* <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", px: 3, py: 2 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
					
					{hasFilters ? <Button onClick={handleClearFilters}>Borrar filtros</Button> : null}
				</Stack>
			</Stack> */}
		</div>
	);
}
