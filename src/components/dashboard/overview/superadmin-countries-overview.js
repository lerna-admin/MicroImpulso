"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChartBar as ChartBarIcon } from "@phosphor-icons/react/dist/ssr/ChartBar";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { NoSsr } from "@/components/core/no-ssr";

const bars = [
	{ name: "Cartera activa", dataKey: "active", color: "var(--mui-palette-primary-main)" },
	{ name: "Mora (monto)", dataKey: "delinquent", color: "var(--mui-palette-error-main)" },
];

export function SuperadminCountriesOverview({ data }) {
	const chartHeight = 320;

	const chartData = data.map((c) => ({
		name: c.countryName ?? "Sin país",
		active: c.activeLoanAmount,
		delinquent: c.delinquentAmount,
	}));

	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar>
						<ChartBarIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				title="Cartera vs Mora por país"
			/>
			<CardContent>
				<Stack divider={<Divider />} spacing={3}>
					<NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
						<ResponsiveContainer height={chartHeight}>
							<BarChart
								barGap={10}
								data={chartData}
								layout="vertical"
								margin={{ top: 0, right: 0, bottom: 0, left: 120 }}
							>
								<CartesianGrid horizontal={false} strokeDasharray="2 4" syncWithTicks />
								<XAxis axisLine={false} tickLine={false} type="number" />
								<YAxis axisLine={false} dataKey="name" tick={<Tick />} tickLine={false} type="category" />
								{bars.map((bar) => (
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
	);
}

function Tick({ height, payload, width, x, y }) {
	return (
		<foreignObject height={width} width={height} x={(x ?? 0) - 160} y={(y ?? 0) - 16}>
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<Typography noWrap variant="body2">
					{payload.value}
				</Typography>
			</Stack>
		</foreignObject>
	);
}

function Legend() {
	return (
		<Stack direction="row" spacing={2}>
			{bars.map((bar) => (
				<Stack direction="row" key={bar.name} spacing={1} sx={{ alignItems: "center" }}>
					<Box sx={{ bgcolor: bar.color, borderRadius: "2px", height: "4px", width: "16px" }} />
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
		<Box
			component="div"
			sx={{ border: "1px solid var(--mui-palette-divider)", boxShadow: "var(--mui-shadows-16)", p: 1, bgcolor: "background.paper" }}
		>
			<Stack spacing={2}>
				{payload?.map((entry) => (
					<Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: "center" }}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: "1 1 auto" }}>
							<Box sx={{ bgcolor: entry.fill, borderRadius: "2px", height: "8px", width: "8px" }} />
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
		</Box>
	);
}

