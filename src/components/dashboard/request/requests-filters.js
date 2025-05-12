"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { paths } from "@/paths";
import { FilterButton, FilterPopover, useFilterContext } from "@/components/core/filter-button";
import { Option } from "@/components/core/option";

export function RequestsFilters({ filters = {}, sortDir = "desc", count }) {
	const [tabs, setTabs] = React.useState([
		{ label: "Todos", value: "", count: 0 },
		{ label: "Nueva", value: "new", count: 0 },
		{ label: "En estudio", value: "under_review", count: 0 },
		{ label: "Aprobada", value: "approved", count: 0 },
		{ label: "Rechazada", value: "rejected", count: 0 },
	]);

	const { name, document, status } = filters;

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

			if (newFilters.document) {
				searchParams.set("document", newFilters.document);
			}

			if (newFilters.name) {
				searchParams.set("name", newFilters.name);
			}

			router.push(`${paths.dashboard.requests.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleClearFilters = React.useCallback(() => {
		updateSearchParams({}, sortDir);
	}, [updateSearchParams, sortDir]);

	const handleStatusChange = React.useCallback(
		(_, value) => {
			updateSearchParams({ ...filters, status: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleNameChange = React.useCallback(
		(value) => {
			updateSearchParams({ ...filters, name: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleIdChange = React.useCallback(
		(value) => {
			updateSearchParams({ ...filters, document: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleSortChange = React.useCallback(
		(event) => {
			updateSearchParams(filters, event.target.value);
		},
		[updateSearchParams, filters]
	);

	const hasFilters = status || document || name;

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
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", p: 2 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
					<FilterButton
						displayValue={name}
						label="Nombres"
						onFilterApply={(value) => {
							handleNameChange(value);
						}}
						onFilterDelete={() => {
							handleNameChange();
						}}
						popover={<NameFilterPopover />}
						value={name}
					/>
					<FilterButton
						displayValue={document}
						label="Identificación"
						onFilterApply={(value) => {
							handleIdChange(value);
						}}
						onFilterDelete={() => {
							handleIdChange();
						}}
						popover={<DocumentFilterPopover />}
						value={document}
					/>
					{hasFilters ? <Button onClick={handleClearFilters}>Borrar filtros</Button> : null}
				</Stack>

				<Select name="sort" onChange={handleSortChange} sx={{ maxWidth: "100%", width: "170px" }} value={sortDir}>
					<Option value="desc">Más reciente</Option>
					<Option value="asc">Menos reciente</Option>
				</Select>
			</Stack>
		</div>
	);
}

function NameFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		setValue(initialValue ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filtrar por nombres">
			<FormControl>
				<OutlinedInput
					onChange={(event) => {
						setValue(event.target.value);
					}}
					onKeyUp={(event) => {
						if (event.key === "Enter") {
							onApply(value);
						}
					}}
					value={value}
				/>
			</FormControl>
			<Button
				onClick={() => {
					onApply(value);
				}}
				variant="contained"
			>
				Aplicar
			</Button>
		</FilterPopover>
	);
}

function DocumentFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		setValue(initialValue ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filtrar por identificación">
			<FormControl>
				<OutlinedInput
					onChange={(event) => {
						setValue(event.target.value);
					}}
					onKeyUp={(event) => {
						if (event.key === "Enter") {
							onApply(value);
						}
					}}
					value={value}
				/>
			</FormControl>
			<Button
				onClick={() => {
					onApply(value);
				}}
				variant="contained"
			>
				Aplicar
			</Button>
		</FilterPopover>
	);
}
