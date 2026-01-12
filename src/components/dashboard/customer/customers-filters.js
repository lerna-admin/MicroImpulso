"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/app/dashboard/users/hooks/use-users";
import { ROLES } from "@/constants/roles";
import { Button, Divider, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { debounce } from "@mui/material/utils";

import { paths } from "@/paths";

const tabs = [
	{ label: "Todos", value: "all" },
	{ label: "Leads", value: "lead" },
	{ label: "Activos", value: "active" },
	{ label: "En estudio", value: "under_review" },
	{ label: "Aprobados", value: "approved" },
	{ label: "Inactivos", value: "inactive" },
	{ label: "Rechazados", value: "rejected" },
];

export function CustomersFilters({ filters = {}, user, allBranches, allAgents }) {
	const router = useRouter();
	const { status, branch, agent, type, paymentDay, name } = filters;

	const [agents, setAgents] = React.useState(allAgents);
	const [agentSelected, setAgentSelected] = React.useState("");
	const [branchSelected, setBranchSelected] = React.useState(user.role === ROLES.GERENTE ? "" : user.branchId);
	const [searchValue, setSearchValue] = React.useState(name ?? "");
	const hasFilters = branch || agent || type || paymentDay || name || filters.mora;

	React.useEffect(() => {
		setSearchValue(name ?? "");
	}, [name]);
	
	React.useEffect(() => {
		if (user.branchId) {
			updateSearchParams({ ...filters, branch: user.role === ROLES.GERENTE ? "" : user.branchId, page: 1 });
		}
	}, []);

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.status && newFilters.status !== "all") {
				searchParams.set("status", newFilters.status);
			}
			if (newFilters.page) {
				searchParams.set("page", newFilters.page);
			}
			if (newFilters.limit) {
				searchParams.set("limit", newFilters.limit);
			}
			if (newFilters.type) {
				searchParams.set("type", newFilters.type);
			}
			if (newFilters.paymentDay) {
				searchParams.set("paymentDay", newFilters.paymentDay);
			}
			if (newFilters.name) {
				searchParams.set("name", newFilters.name);
			}
			if (newFilters.agent) {
				searchParams.set("agent", newFilters.agent);
			}
			if (newFilters.branch) {
				searchParams.set("branch", newFilters.branch);
			}

			router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const debouncedSearch = React.useMemo(
		() =>
			debounce((value) => {
				const normalizedName = value ? value : undefined;
				updateSearchParams({ ...filters, name: normalizedName, page: 1 });
			}, 500),
		[filters, updateSearchParams]
	);

	React.useEffect(() => {
		return () => {
			debouncedSearch.clear?.();
		};
	}, [debouncedSearch]);

	const handleStatusChange = React.useCallback(
		(_, value) => {
			const normalized = value === "all" ? undefined : value;
			updateSearchParams({ ...filters, status: normalized, page: 1 });
		},
		[updateSearchParams, filters]
	);

	const handleAgentChange = ({ target }) => {
		const { value } = target;
		setAgentSelected(value);
		updateSearchParams({ ...filters, agent: value, page: 1 });
	};

	const handleBranchChange = async ({ target }) => {
		const { value } = target;
		setBranchSelected(value);
		filterAgentsByBranch(value);
		updateSearchParams({ ...filters, branch: value, page: 1 });
	};

	const filterAgentsByBranch = async (branch) => {
		const { data } = await getAllUsers({ branchId: branch, role: "AGENT" });
		setAgents(data);
	};

	const handleClearFilters = () => {
		setSearchValue("");
		if (user.role === ROLES.GERENTE) {
			setAgentSelected("");
			setBranchSelected("");
			updateSearchParams({ name: undefined, page: 1 });
		} else if (user.role === ROLES.ADMIN) {
			setAgentSelected("");
			updateSearchParams({ branch: user.branchId, page: 1, name: undefined });
		} else {
			updateSearchParams({ ...filters, name: undefined, page: 1 });
		}
	};

	const handleNameChange = (event) => {
		const value = event.target.value;
		setSearchValue(value);
		debouncedSearch(value.trim() === "" ? undefined : value);
	};

	return (
		<div>
			<Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status && status !== "" ? status : "all"} variant="scrollable">
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
				sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", px: 3, py: 2, gap: 2 }}
			>
				<TextField
					label="Buscar cliente"
					placeholder="Nombre o documento"
					size="small"
					value={searchValue}
					onChange={handleNameChange}
					sx={{ minWidth: { xs: "100%", sm: 240 } }}
				/>

				{user.role === ROLES.AGENTE ? null : (
					<>
						{hasFilters ? <Button onClick={handleClearFilters}>Borrar filtros</Button> : null}

						<InputLabel id="agent-label" disabled={!branchSelected}>
							Agente:{" "}
						</InputLabel>
						<Select
							disabled={!branchSelected}
							labelId="agent-label"
							name="agentSelected"
							onChange={handleAgentChange}
							sx={{ marginTop: "0 !important" }}
							value={agentSelected}
						>
							{agents.map((agent) => (
								<MenuItem key={agent.id} value={agent.id}>
									{agent.name}
								</MenuItem>
							))}
						</Select>

						<InputLabel id="branch-label">Sede: </InputLabel>
						<Select
							disabled={user.role === ROLES.ADMIN}
							labelId="branch-label"
							name="branchSelected"
							onChange={handleBranchChange}
							sx={{ marginTop: "0 !important" }}
							value={branchSelected}
						>
							{allBranches.map((sede) => (
								<MenuItem key={sede.id} value={sede.id}>
									{sede.name}
								</MenuItem>
							))}
						</Select>
					</>
				)}
			</Stack>
		</div>
	);
}
