"use client";

import * as React from "react";
import {
	Box,
	Card,
	CardContent,
	Divider,
	NoSsr,
	Paper,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { paths } from "@/paths";

import { ReportHeader } from "../report-header";

export function ActiveLoansByStatus({ data, branches, filters, user }) {
	const { statuses, totals } = data;
	const totalLoans = totals.count;

	const theme = useTheme();
	// Detecta breakpoint activo
	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));

	// Determina columnas activas
	const columnsBoxes = isLg ? 4 : isMd ? 2 : 1;

	const boxesNames = ["Total nuevos", "Total aprobados", "Total en desembolsados"];

	const boxes = [
		{
			name: "Total",
			value: totals.outstanding,
		},
		...Object.entries(data.statuses).map(([_, value], index) => {
			return {
				name: boxesNames[index],
				value: value.outstanding,
			};
		}),
	];

	const [dataPie, setDataPie] = React.useState([
		{ id: "new", name: "Nuevos", value: 0, color: "var(--mui-palette-info-main)" },
		{ id: "under_review", name: "En estudio", value: 0, color: "var(--mui-palette-warning-main)" },
		{ id: "approved", name: "Aprobados", value: 0, color: "var(--mui-palette-success-main)" },
		{ id: "funded", name: "Desembolsados", value: 0, color: "var(--mui-palette-primary-main)" },
	]);

	const chartSize = 200;
	const chartTickness = 30;

	React.useEffect(() => {
		if (statuses) {
			const updatedData = dataPie.map((item) => {
				const match = statuses.find((status) => status.status === item.id);

				return match ? { ...item, value: (match.count / totalLoans) * 100 } : { ...item, value: 0 };
			});

			setDataPie(updatedData);
		}
	}, [statuses]);

	return (
		<Stack spacing={7}>
			<ReportHeader
				title={"Préstamos Activos por Estado"}
				disabledDate={true}
				disabledAgent={true}
				branches={branches}
				filters={filters}
				pathToUpdateSearchParams={paths.dashboard.reports.activeLoansByStatus}
				user={{ role: user.role, branch: user.branchId }}
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
						const isLastInRow = (index + 1) % columnsBoxes === 0;

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
									{new Intl.NumberFormat("es-CO", {
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
						<Box sx={{ display: "flex", justifyContent: "center" }}>
							<NoSsr fallback={<Box sx={{ height: `${chartSize}px`, width: `${chartSize}px` }} />}>
								<PieChart height={chartSize} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} width={chartSize}>
									<Pie
										animationDuration={300}
										cx={chartSize / 2}
										cy={chartSize / 2}
										data={dataPie}
										dataKey="value"
										innerRadius={chartSize / 2 - chartTickness}
										nameKey="name"
										outerRadius={chartSize / 2}
										strokeWidth={0}
									>
										{dataPie.map((entry) => (
											<Cell fill={entry.color} key={entry.name} />
										))}
									</Pie>
									<Tooltip animationDuration={50} content={<TooltipContent />} />
								</PieChart>
							</NoSsr>
						</Box>
						<Legend payload={dataPie} totalLoans={totalLoans} />
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}

function Legend({ payload, totalLoans }) {
	return (
		<Box sx={{ display: "grid", gap: 3, gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
			<div>
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<Typography variant="body2">Total</Typography>
				</Stack>
				<Typography variant="h5">{totalLoans}</Typography>
			</div>
			{payload?.map((entry) => (
				<div key={entry.name}>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						<Box sx={{ bgcolor: entry.color, borderRadius: "2px", height: "4px", width: "16px" }} />
						<Typography variant="body2">{entry.name}</Typography>
					</Stack>
					<Typography variant="h5">{Math.round((entry.value / 100) * totalLoans)}</Typography>
				</div>
			))}
		</Box>
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
							<Box sx={{ bgcolor: entry.payload.fill, borderRadius: "2px", height: "8px", width: "8px" }} />
							<Typography sx={{ whiteSpace: "nowrap" }}>{entry.name}</Typography>
						</Stack>
						<Typography color="text.secondary" variant="body2">
							{new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 2 }).format(entry.value / 100)}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Paper>
	);
}
