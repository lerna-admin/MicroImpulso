"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles";
import {
	Box,
	Card,
	CardContent,
	Divider,
	FormControl,
	InputLabel,
	Paper,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { NoSsr } from "@/components/core/no-ssr";
import { Option } from "@/components/core/option";

const bars = [
	{ name: "Atendidos", dataKey: "v1", color: "var(--mui-palette-primary-400)" },
	{ name: "Aprobados", dataKey: "v2", color: "var(--mui-palette-error-400)" },
	{ name: "Renovados", dataKey: "v3", color: "var(--mui-palette-info-400)" },
	{ name: "Pagos cobrados", dataKey: "v4", color: "var(--mui-palette-warning-400)" },
];

export function AgentActivity({ data, branches, filters, user }) {
	const { startDate, endDate } = filters;
	const { role, branchId } = user;

	const router = useRouter();
	const chartHeight = 300;

	const [selectedStartDate, setSelectedStartDate] = React.useState(dayjs(startDate));
	const [selectedEndDate, setSelectedEndDate] = React.useState(dayjs(endDate));
	const [selectedBranch, setSelectedBranch] = React.useState("");

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.startDate) {
				searchParams.set("startDate", newFilters.startDate);
			}
			if (newFilters.endDate) {
				searchParams.set("endDate", newFilters.endDate);
			}
			if (newFilters.branch) {
				searchParams.set("branch", newFilters.branch);
			}

			router.push(`${paths.dashboard.reports.agentActivity}?${searchParams.toString()}`);
		},
		[router]
	);

	React.useEffect(() => {
		if (branchId && role === ROLES.ADMIN) setSelectedBranch(branchId);
	}, [role, branchId]);

	const handleFilterStartDateChange = React.useCallback(
		(value) => {
			setSelectedStartDate(value);
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, startDate: dateFormatted });
		},
		[updateSearchParams, filters]
	);

	const handleFilterEndDateChange = React.useCallback(
		(value) => {
			setSelectedEndDate(value);
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, endDate: dateFormatted });
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
	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
				<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
					Actividad de los Agentes
				</Typography>

				<DatePicker
					label="Fecha inicio:"
					sx={{ flexGrow: 1, maxWidth: "170px" }}
					name="startDate"
					value={selectedStartDate}
					onChange={handleFilterStartDateChange}
				/>

				<DatePicker
					label="Fecha final:"
					sx={{ flexGrow: 1, maxWidth: "170px" }}
					name="endDate"
					value={selectedEndDate}
					onChange={handleFilterEndDateChange}
				/>

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
			</Stack>

			<Card>
				<CardContent>
					<Stack divider={<Divider />} spacing={2} sx={{ flex: "1 1 auto" }}>
						<NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
							<ResponsiveContainer height={chartHeight}>
								<BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
									<CartesianGrid strokeDasharray="2 4" vertical={false} />
									<XAxis axisLine={false} dataKey="name" type="category" />
									<YAxis axisLine={false} type="number" />
									{bars.map((bar) => (
										<Bar
											key={bar.name}
											animationDuration={300}
											barSize={32}
											dataKey={bar.dataKey}
											fill={bar.color}
											name={bar.name}
											stackId="total"
											radius={[0, 0, 0, 0]}
										/>
									))}
									<Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
								</BarChart>
							</ResponsiveContainer>
						</NoSsr>
						<Legend />
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}

function Legend() {
	return (
		<Stack direction="row" spacing={2}>
			{bars.map((bar) => (
				<Stack direction="row" key={bar.name} spacing={1} sx={{ alignItems: "center" }}>
					<Box sx={{ bgcolor: bar.color, borderRadius: "2px", height: "8px", width: "16px" }} />
					<Typography color="text.secondary" variant="caption">
						{bar.name}
					</Typography>
				</Stack>
			))}
		</Stack>
	);
}

function TooltipContent({ active, payload }) {
	if (!active) {
		return null;
	}

	return (
		<Paper sx={{ border: "1px solid var(--mui-palette-divider)", boxShadow: "var(--mui-shadows-16)", p: 1 }}>
			<Stack spacing={2}>
				{payload?.map((entry) => (
					<Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: "center" }}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: "1 1 auto" }}>
							<Box sx={{ bgcolor: entry.fill, borderRadius: "2px", height: "8px", width: "8px" }} />
							<Typography sx={{ whiteSpace: "nowrap" }}>{entry.name}</Typography>
						</Stack>
						<Typography color="text.secondary" variant="body2">
							{new Intl.NumberFormat("en-US").format(entry.value)}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Paper>
	);
}
