"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, Card, CardContent, Divider, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { NoSsr } from "@/components/core/no-ssr";

import { ExportComponent } from "../../export/export-component";

const bars = [
	{ name: "Total prestado", dataKey: "v1" },
	{ name: "Total desembolsado", dataKey: "v2" },
	{ name: "Total recaudado", dataKey: "v3" },
	{ name: "Total pagado", dataKey: "v4" },
	{ name: "Total renovado", dataKey: "v5" },
	{ name: "Clientes activos", dataKey: "v6" },
	{ name: "Monto vencido", dataKey: "v7" },
	{ name: "Prestamos vencidos", dataKey: "v8" },
	{ name: "Valor neto", dataKey: "v9" },
];

export function GeneralStatisticsByBranch({ data, filters }) {
	const { startDate, endDate } = filters;
	const boxesNames = [
		"Total prestado",
		"Total desembolsado",
		"Total recaudado",
		"Total pagado",
		"Total renovado",
		"Clientes activos",
		"Monto vencido",
		"Prestamos vencidos",
		"Valor neto",
	];

	const theme = useTheme();

	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));

	const columns = isLg ? 4 : isMd ? 2 : 1;

	const chartHeight = 300;
	const palette = pastelPalette(bars.length);

	const barsWithColors = bars.map((bar, i) => ({
		...bar,
		color: palette[i],
	}));

	const boxes = Object.entries(data.totals).map(([_, value], index) => {
		return {
			name: boxesNames[index],
			value: value,
		};
	});

	const router = useRouter();
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

			router.push(`${paths.dashboard.reports.generalStatisticsByBranch}?${searchParams.toString()}`);
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

	const currencyFormatter = new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	});

	const detailRowsToExport = data.branchesFormatted.map((block) => ({
		Sede: block.name,
		Prestado: currencyFormatter.format(block.v1),
		Desembolsado: currencyFormatter.format(block.v2),
		Recaudado: currencyFormatter.format(block.v3),
		Pagado: currencyFormatter.format(block.v4),
		Renovado: currencyFormatter.format(block.v5),
		"Clientes Activos": block.v6,
		"Monto Vencido": currencyFormatter.format(block.v7),
		"Prestamos Vencidos": block.v8,
		"Valor Neto": currencyFormatter.format(block.v9),
	}));

	const totalsRowToExport = {
		"Total Prestado": currencyFormatter.format(data.totals.totalLoaned),
		"Total Desembolsado": currencyFormatter.format(data.totals.totalDisbursed),
		"Total Recaudado": currencyFormatter.format(data.totals.totalCollected),
		"Total Pagado": currencyFormatter.format(data.totals.repayments),
		"Total Renovado": currencyFormatter.format(data.totals.penalties),
		"Clientes Activos": data.totals.activeClients,
		"Total Monto Vencido": currencyFormatter.format(data.totals.overdueAmount),
		"Prestamos Vencidos": data.totals.overdueLoans,
		"Valor Neto": currencyFormatter.format(data.totals.netFlow),
	};

	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "end" }}>
				<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
					Estadísticas Generales por Sede
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

				<ExportComponent
					reports={{
						reportName: `Estadísticas Generales por Sede`,
						detailRowsToExport,
						totalsRowToExport,
					}}
				/>
			</Stack>

			<Card>
				<Box
					sx={{
						display: "grid",
						columnGap: 0,
						gap: 2,
						gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
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
									{index === 5 || index === 7
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
				<CardContent>
					<Stack divider={<Divider />} spacing={3}>
						<NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
							<ResponsiveContainer height={chartHeight}>
								<BarChart data={data.branchesFormatted} margin={{ top: 0, right: 20, bottom: 0, left: 40 }}>
									<CartesianGrid strokeDasharray="2 4" vertical={false} />
									<XAxis axisLine={false} tickMargin={15} dataKey="name" tickLine={false} type="category" />
									<YAxis
										axisLine={false}
										tickMargin={15}
										type="number"
										tickFormatter={(value) =>
											new Intl.NumberFormat("es-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(value)
										}
									/>
									{barsWithColors.map((bar) => (
										<Bar
											animationDuration={300}
											barSize={24}
											dataKey={bar.dataKey}
											fill={bar.color}
											key={bar.name}
											name={bar.name}
											radius={[5, 5, 5, 5]}
										/>
									))}
									<Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
								</BarChart>
							</ResponsiveContainer>
						</NoSsr>
						<Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
							{barsWithColors.map((bar) => (
								<Stack direction="row" key={bar.name} spacing={1} sx={{ alignItems: "center" }}>
									<Box sx={{ bgcolor: bar.color, borderRadius: "2px", height: "8px", width: "16px" }} />
									<Typography variant="body2">{bar.name}</Typography>
								</Stack>
							))}
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}

function TooltipContent({ active, payload, label }) {
	if (!active) {
		return null;
	}

	return (
		<Paper sx={{ border: "1px solid var(--mui-palette-divider)", boxShadow: "var(--mui-shadows-16)", p: 1 }}>
			<Stack spacing={2}>
				<Typography variant="subtitle1">{label}</Typography>
				{payload?.map((entry) => (
					<Stack direction="row" key={entry.name} spacing={2} sx={{ alignItems: "center" }}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: "1 1 auto" }}>
							<Box sx={{ bgcolor: entry.fill, borderRadius: "2px", height: "8px", width: "8px" }} />
							<Typography sx={{ whiteSpace: "nowrap" }}>{entry.name}</Typography>
						</Stack>
						<Typography color="text.secondary" variant="body2">
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
								maximumFractionDigits: 0,
							}).format(entry.value)}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Paper>
	);
}

function pastelPalette(n, alpha = 1, s = 60, l = 80) {
	return Array.from({ length: n }, (_, i) => {
		const h = Math.round((360 / n) * i);
		return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
	});
}
