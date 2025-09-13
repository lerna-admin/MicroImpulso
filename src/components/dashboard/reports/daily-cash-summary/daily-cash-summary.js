"use client";

import * as React from "react";
import { Box, CardContent, Divider, NoSsr, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Card from "@mui/material/Card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { paths } from "@/paths";

import { ReportHeader } from "../report-header";

const barsDetail = [
	{ name: "Desembolsado", dataKey: "v1", color: "var(--mui-palette-primary-main)" },
	{ name: "Pago", dataKey: "v2", color: "var(--mui-palette-primary-300)" },
	{ name: "Renovado", dataKey: "v3", color: "var(--mui-palette-primary-100)" },
];

export function DailyCashSummary({ data, filters, user }) {
	const boxesNames = ["Total recaudado", "Total desembolsado", "Dinero en caja", "Numero de transacciones"];

	const theme = useTheme();

	const chartHeight = 300;

	// Detecta breakpoint activo
	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));

	// Determina columnas activas
	const columns = isLg ? 4 : isMd ? 2 : 1;

	const barsData = data.blocks.map(({ label, breakdown }) => {
		return {
			name: label,
			v1: breakdown[0]?.amount,
			v2: breakdown[1]?.amount,
			v3: 2 in breakdown ? breakdown[2]?.amount : 0,
		};
	});

	const boxes = Object.entries(data.totals).map(([_, value], index) => {
		return {
			name: boxesNames[index],
			value: value,
		};
	});

	const currencyFormatter = new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	});

	const detailRowsToExport = data.blocks.map((agent) => ({
		Agente: agent.label,
		Pago: currencyFormatter.format(agent.kpi.totalCollected),
		Desembolsado: currencyFormatter.format(agent.kpi.cashPaidOut),
		"Balance Neto": currencyFormatter.format(agent.kpi.netBalance),
		"Cantidad transacciones": agent.kpi.transactionCount,
	}));

	const totalsRowToExport = {
		"Total recaudado": currencyFormatter.format(data.totals.totalCollected),
		"Total desembolsado": currencyFormatter.format(data.totals.cashPaidOut),
		"Total Dinero en caja": currencyFormatter.format(data.totals.netBalance),
		"Total Numero de transacciones": data.totals.transactionCount,
	};

	return (
		<Stack spacing={7}>
			<ReportHeader
				title={"Resumen Diario de Caja"}
				filters={filters}
				pathToUpdateSearchParams={paths.dashboard.reports.dailyCashSummary}
				user={{ role: user.role, branch: user.branchId }}
				disabledAgent={true}
				reports={{ reportName: "Resumen Diario de Caja", detailRowsToExport, totalsRowToExport }}
			/>
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
									{item.name === boxesNames.at(-1)
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
								<BarChart barGap={12} data={barsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
									<CartesianGrid strokeDasharray="2 4" vertical={false} />
									<XAxis axisLine={false} dataKey="name" tickLine={false} type="category" />
									<YAxis axisLine={false} hide type="number" />
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
							{new Intl.NumberFormat("en-US").format(entry.value)}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Paper>
	);
}
