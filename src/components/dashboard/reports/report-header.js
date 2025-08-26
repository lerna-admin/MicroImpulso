import * as React from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles";
import { FormControl, InputLabel, Select, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { dayjs } from "@/lib/dayjs";
import { Option } from "@/components/core/option";

export function ReportHeader({
	title,
	branches = [],
	agents = [],
	filters,
	pathToUpdateSearchParams,
	user,
	disabledDate = false,
	disabledAgent = false,
}) {
	const { date } = filters;
	const { role, branch } = user;

	const router = useRouter();
	const [selectedDate, setSelectedDate] = React.useState(dayjs(date));
	const [selectedBranch, setSelectedBranch] = React.useState("");
	const [selectedAgent, setSelectedAgent] = React.useState("");

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.date) {
				searchParams.set("date", newFilters.date);
			}

			if (newFilters.branch) {
				searchParams.set("branch", newFilters.branch);
			}

			if (newFilters.agent) {
				searchParams.set("agent", newFilters.agent);
			}

			router.push(`${pathToUpdateSearchParams}?${searchParams.toString()}`);
		},
		[pathToUpdateSearchParams, router]
	);

	React.useEffect(() => {
		if (branch && role === ROLES.ADMIN) {
			if (disabledAgent === false) updateSearchParams({ ...filters, branch: branch });
			setSelectedBranch(branch);
		}

		if (filters.branch && role === ROLES.GERENTE) {
			setSelectedBranch(filters.branch);
			setSelectedAgent("");
		}
	}, [filters.branch, role, branch]);

	const handleFilterDateChange = React.useCallback(
		(value) => {
			setSelectedDate(value);
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, date: dateFormatted });
		},
		[updateSearchParams, filters]
	);

	const handleFilterBranchChange = React.useCallback(
		(e) => {
			const value = e.target.value;
			setSelectedBranch(value);
			updateSearchParams({ ...filters, branch: value });
		},
		[updateSearchParams, filters]
	);

	const handleFilterAgentChange = React.useCallback(
		(e) => {
			const value = e.target.value;
			setSelectedAgent(value);
			updateSearchParams({ ...filters, agent: value });
		},
		[updateSearchParams, filters]
	);

	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={{ xs: 2, sm: 3 }}
			sx={{ flexWrap: "wrap", alignItems: "center" }}
			useFlexGap
		>
			<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
				{title}
			</Typography>

			{disabledDate ? null : (
				<DatePicker
					label="Fecha:"
					sx={{ flexGrow: 1, maxWidth: "170px" }}
					name="date"
					value={selectedDate}
					onChange={handleFilterDateChange}
				/>
			)}

			{branches.length === 0 ? null : (
				<FormControl sx={{ maxWidth: "170px", width: "100%" }} disabled={role === ROLES.ADMIN}>
					<InputLabel id="selectedBranch">Sede:</InputLabel>
					<Select labelId="selectedBranch" defaultValue="" value={selectedBranch} onChange={handleFilterBranchChange}>
						{branches.length === 0 ? null : <Option value="">Todas las sedes</Option>}
						{branches.length === 0
							? null
							: branches.map(({ id, name }) => (
									<Option key={id} value={id}>
										{name}
									</Option>
								))}
					</Select>
				</FormControl>
			)}

			{disabledAgent && agents.length === 0 ? null : (
				<FormControl sx={{ maxWidth: "190px", width: "100%" }}>
					<InputLabel id="selectedAgent">Agentes:</InputLabel>
					<Select labelId="selectedAgent" defaultValue="" value={selectedAgent} onChange={handleFilterAgentChange}>
						{agents.length === 0 ? null : <Option value="">Todos los agentes</Option>}
						{agents.length === 0
							? null
							: agents.map(({ id, name }) => (
									<Option key={id} value={id}>
										{name}
									</Option>
								))}
					</Select>
				</FormControl>
			)}
		</Stack>
	);
}
