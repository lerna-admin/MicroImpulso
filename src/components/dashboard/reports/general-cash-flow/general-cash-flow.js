"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { NoSsr, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { DatePicker } from "@mui/x-date-pickers";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";

const lines = [
	{ name: "Desembolsados", dataKey: "v1", color: "var(--mui-palette-primary-main)" },
	{ name: "Pagados", dataKey: "v2", color: "var(--mui-palette-success-main)" },
	{ name: "Renovados", dataKey: "v3", color: "var(--mui-palette-warning-main)" },
	{ name: "Valor neto", dataKey: "v4", color: "var(--mui-palette-error-main)" },
];

export function GeneralCashFlow({ data, filters }) {
	const { summary, dailyBreakdown } = data;
	const { startDate, endDate } = filters;

	const router = useRouter();
	const chartHeight = 320;

	const dailyBreakdownFormatted = dailyBreakdown.map((item) => ({
		name: item.date,
		v1: item.disbursed,
		v2: item.repayments,
		v3: item.penalties,
		v4: item.netFlow,
	}));

	const [selectedStartDate, setSelectedStartDate] = React.useState(dayjs(startDate));
	const [selectedEndDate, setSelectedEndDate] = React.useState(dayjs(endDate));

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.startDate) {
				searchParams.set("startDate", newFilters.startDate);
			}
			if (newFilters.endDate) {
				searchParams.set("endDate", newFilters.endDate);
			}

			router.push(`${paths.dashboard.reports.generalCashFlow}?${searchParams.toString()}`);
		},
		[router]
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
					Flujo de Caja General
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
			</Stack>
			<Card>
				<CardContent>
					<Stack divider={<Divider />} spacing={3}>
						<Stack
							direction={{ xs: "column", md: "row" }}
							divider={<Divider flexItem orientation="vertical" sx={{ borderBottomWidth: { xs: "1px", md: 0 } }} />}
							spacing={3}
							sx={{ justifyContent: "space-between" }}
						>
							<Summary title="Desembolsados" value={summary.disbursed} />
							<Summary title="Pagados" value={summary.repayments} />
							<Summary title="Renovados" value={summary.penalties} />
							<Summary title="Valor neto" value={summary.netFlow} />
						</Stack>
						<NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
							<ResponsiveContainer height={chartHeight} width="100%">
								<LineChart data={dailyBreakdownFormatted} margin={{ top: 0, right: 20, bottom: 0, left: 40 }}>
									<CartesianGrid strokeDasharray="2 4" vertical={false} />
									<XAxis
										axisLine={false}
										tickMargin={15}
										dataKey="name"
										tickFormatter={(value) => dayjs(value).format("MMM D")}
										interval="preserveStartEnd"
										tickLine={false}
										type="category"
									/>
									<YAxis
										axisLine={false}
										tickMargin={15}
										tickFormatter={(value) =>
											new Intl.NumberFormat("es-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(value)
										}
										type="number"
										yAxisId={0}
									/>
									{lines.map((line) => (
										<Line
											animationDuration={300}
											dataKey={line.dataKey}
											dot={<Dot />}
											key={line.name}
											name={line.name}
											stroke={line.color}
											strokeDasharray={"0"}
											strokeWidth={2}
											type="bump"
											yAxisId={0}
										/>
									))}
									<Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
								</LineChart>
							</ResponsiveContainer>
						</NoSsr>
						<Legend />
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}

function Summary({ title, value }) {
	return (
		<Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
			<div>
				<Typography color="text.secondary" variant="overline">
					{title}
				</Typography>
				<Typography variant="h5">
					{new Intl.NumberFormat("es-CO", {
						style: "currency",
						currency: "COP",
						minimumFractionDigits: 0,
					}).format(value)}
				</Typography>
			</div>
		</Stack>
	);
}

function Dot({ active, cx, cy, payload, stroke }) {
	if (active && payload?.name === active) {
		return <circle cx={cx} cy={cy} fill={stroke} r={6} />;
	}

	return null;
}

function Legend() {
	return (
		<Stack direction="row" spacing={2}>
			{lines.map((line) => (
				<Stack direction="row" key={line.name} spacing={1} sx={{ alignItems: "center" }}>
					<Box sx={{ bgcolor: line.color, borderRadius: "2px", height: "4px", width: "16px" }} />
					<Typography color="text.secondary" variant="caption">
						{line.name}
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
							<Box sx={{ bgcolor: entry.stroke, borderRadius: "2px", height: "8px", width: "8px" }} />
							<Typography sx={{ whiteSpace: "nowrap" }}>{entry.name}</Typography>
						</Stack>
						<Typography color="text.secondary" variant="body2">
							{new Intl.NumberFormat("es-CO", {
								style: "currency",
								currency: "COP",
								minimumFractionDigits: 0,
							}).format(entry.value)}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Paper>
	);
}
