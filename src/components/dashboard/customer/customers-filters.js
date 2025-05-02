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
import { FilterButton, FilterPopover, useFilterContext } from "@/components/core/filter-button";

export function CustomersFilters({ filters = {}, sortDir = "desc", count }) {
	const [tabs, setTabs] = React.useState([
		{ label: "Todos", value: "", count: 0 },
		{ label: "Activos", value: "active", count: 0 },
		{ label: "Inactivos", value: "inactive", count: 0 },
		{ label: "Suspendidos", value: "suspended", count: 0 },
	]);
	const { email, phoneNumber, status, documentId } = filters;

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

			if (newFilters.email) {
				searchParams.set("email", newFilters.email);
			}

			if (newFilters.documentId) {
				searchParams.set("documentId", newFilters.documentId);
			}

			if (newFilters.phoneNumber) {
				searchParams.set("phoneNumber", newFilters.phoneNumber);
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

	const handleClearFilters = React.useCallback(() => {
		updateSearchParams({}, sortDir);
	}, [updateSearchParams, sortDir]);

	const handleStatusChange = React.useCallback(
		(_, value) => {
			updateSearchParams({ ...filters, status: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleCedulaChange = React.useCallback(
		(value) => {
			updateSearchParams({ ...filters, documentId: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handleEmailChange = React.useCallback(
		(value) => {
			updateSearchParams({ ...filters, email: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const handlePhoneChange = React.useCallback(
		(value) => {
			updateSearchParams({ ...filters, phoneNumber: value }, sortDir);
		},
		[updateSearchParams, filters, sortDir]
	);

	const hasFilters = status || email || phoneNumber || documentId;

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
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", px: 3, py: 2 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
					<FilterButton
						displayValue={documentId}
						label="Identificación"
						onFilterApply={(value) => {
							handleCedulaChange(value);
						}}
						onFilterDelete={() => {
							handleCedulaChange();
						}}
						popover={<CedulaFilterPopover />}
						value={documentId}
					/>
					<FilterButton
						displayValue={email}
						label="Correo"
						onFilterApply={(value) => {
							handleEmailChange(value);
						}}
						onFilterDelete={() => {
							handleEmailChange();
						}}
						popover={<EmailFilterPopover />}
						value={email}
					/>
					<FilterButton
						displayValue={phoneNumber}
						label="Celular"
						onFilterApply={(value) => {
							handlePhoneChange(value);
						}}
						onFilterDelete={() => {
							handlePhoneChange();
						}}
						popover={<PhoneFilterPopover />}
						value={phoneNumber}
					/>
					{hasFilters ? <Button onClick={handleClearFilters}>Borrar filtros</Button> : null}
				</Stack>
			</Stack>
		</div>
	);
}

function CedulaFilterPopover() {
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

function EmailFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		setValue(initialValue ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filtrar por correo">
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

function PhoneFilterPopover() {
	const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		setValue(initialValue ?? "");
	}, [initialValue]);

	return (
		<FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filtrar por celular">
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
