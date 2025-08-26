"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	FormControl,
	InputLabel,
	Paper,
	Select,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { NoSsr } from "@/components/core/no-ssr";
import { Option } from "@/components/core/option";

const barsDetail = [{ name: "Total recaudado por agente", dataKey: "v1", color: "var(--mui-palette-primary-main)" }];

export function TotalCollectionReceived({ filters, data, branches = [] }) {
	const { startDate, endDate, branch } = filters;
	const chartHeight = 300;
	const router = useRouter();
	const [selectedStartDate, setSelectedStartDate] = React.useState(dayjs(startDate));
	const [selectedEndDate, setSelectedEndDate] = React.useState(dayjs(endDate));
	const [selectedBranch, setSelectedBranch] = React.useState(branch === undefined ? "" : branch);

	const boxesNames = ["Total recaudado"];

	const theme = useTheme();

	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));

	const columns = isLg ? 1 : isMd ? 2 : 1;

	const boxes = Object.entries(data.totals).map(([_, value], index) => {
		return {
			name: boxesNames[index],
			value: value,
		};
	});

	const barsData = data.blocks.flatMap((block) =>
		(block.agents || []).map((agent) => ({
			name: agent.agentName,
			v1: agent.totalCollected,
		}))
	);

	React.useEffect(() => {
		updateSearchParams({
			...filters,
			startDate: dayjs(selectedStartDate).format("YYYY-MM-DD"),
			endDate: dayjs(selectedEndDate).format("YYYY-MM-DD"),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

			router.push(`${paths.dashboard.reports.totalCollectionReceived}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleFilterBranchChange = React.useCallback(
		(e) => {
			const value = e.target.value;
			setSelectedBranch(value);
			updateSearchParams({ ...filters, branch: value });
		},
		[updateSearchParams, filters]
	);

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

	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
				<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
					Recaudo Total (Pagos Recibidos)
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
					<FormControl sx={{ maxWidth: "170px", width: "100%" }}>
						<InputLabel id="selectedBranch">Sede:</InputLabel>
						<Select labelId="selectedBranch" value={selectedBranch} onChange={handleFilterBranchChange}>
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
				<Box
					sx={{
						display: "grid",
						columnGap: 0,
						gap: 2,
						gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(1, 1fr)" },
						p: 3,
					}}
				>
					{boxes.map((item, index) => {
						const isLastInRow = (index + 1) % columns === 0;

						return (
							<Stack
								key={item.name}
								spacing={1}
								sx={{
									borderRight: isLastInRow ? "none" : "1px solid var(--mui-palette-divider)",
									borderBottom: { xs: "1px solid var(--mui-palette-divider)", md: "none" },
									pb: { xs: 2, md: 0 },
								}}
							>
								<Typography color="text.secondary">{item.name}</Typography>
								<Typography variant="h3">
									{item.name === boxesNames.at(1)
										? item.value
										: new Intl.NumberFormat("es-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(item.value)}
								</Typography>
							</Stack>
						);
					})}
				</Box>
			</Card>
			<Card>
				<CardHeader title={data.blocks[0]?.branchName} />
				<CardContent>
					<Stack divider={<Divider />} spacing={3}>
						<NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
							<ResponsiveContainer height={chartHeight}>
								<BarChart
									width={500}
									height={300}
									data={barsData}
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis dataKey="name" axisLine={false} />
									<YAxis
										axisLine={false}
										tickFormatter={(value) =>
											new Intl.NumberFormat("es-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(value)
										}
									/>
									<Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
									{barsDetail.map((bar) => (
										<Bar
											animationDuration={300}
											barSize={24}
											dataKey={bar.dataKey}
											fill={bar.color}
											key={bar.name}
											name={bar.name}
											radius={[5, 5, 0, 0]}
										/>
									))}
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
			{barsDetail.map((bar) => (
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
							{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
								entry.value
							)}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Paper>
	);
}
