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
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { paths } from "@/paths";

import { ReportHeader } from "../report-header";

const barsDetail = [
	{ name: "Activos", dataKey: "v1", color: "var(--mui-palette-success-400)" },
	{ name: "Inactivos", dataKey: "v2", color: "var(--mui-palette-error-400)" },
];

export function ActiveVsInactiveClients({ data, branches, agents, filters, user }) {
	const chartHeight = 300;

	const boxesNames = ["Activos", "Inactivos"];

	const boxes = Object.entries(data).map(([_, value], index) => {
		return {
			name: boxesNames[index],
			value: value,
		};
	});

	const barsData = [
		{
			name: "Clientes",
			v1: data.active,
			v2: data.inactive,
		},
	];

	const theme = useTheme();
	// Detecta breakpoint activo
	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));

	// Determina columnas activas
	const columnsBoxes = isLg ? 2 : isMd ? 2 : 1;

	return (
		<Stack spacing={4}>
			<ReportHeader
				title={"Clientes Activos vs Inactivos"}
				branches={branches}
				agents={agents}
				filters={filters}
				pathToUpdateSearchParams={paths.dashboard.reports.activeVsInactiveClients}
				user={{ role: user.role, branch: user.branchId }}
				disabledDate={true}
			/>
			<Card>
				<Box
					sx={{
						display: "grid",
						columnGap: 0,
						gap: 2,
						gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(2, 1fr)" },
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
								<Typography variant="h3">{item.value}</Typography>
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
								<BarChart
									barGap={10}
									data={barsData}
									layout="vertical"
									margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
								>
									<CartesianGrid horizontal={false} strokeDasharray="2 4" syncWithTicks />
									<XAxis axisLine={false} tickLine={false} type="number" />
									<YAxis axisLine={false} dataKey="name" tickLine={false} type="category" />
									{barsDetail.map((bar) => (
										<Bar
											animationDuration={300}
											barSize={12}
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
