"use client";

import * as React from "react";
import { Box, Card, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

import { DataTable } from "@/components/core/data-table";

export function OverdueLoans({ rows, boxes }) {
	const columns = [
		{ field: "id", name: "ID", width: "50px" },
		{
			formatter: (row) => (
				<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
					{row.clientName}
				</Typography>
			),
			name: "Nombre cliente",
			width: "150px",
		},
		{
			formatter: (row) => {
				return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.pendingAmount
				);
			},
			name: "Monto pendiente",
			width: "100px",
		},
		{
			field: "daysMora",
			name: "Dias en mora",
			width: "100px",
		},
		{ field: "agentName", name: "Agente asignado", width: "100px" },
		{ field: "dueDate", name: "Fecha de vencimiento ", width: "100px" },
	];

	const boxesNames = ["Total solicitudes vencidas", "Monto total pendiente"];

	const boxes2 = Object.entries(boxes).map(([_, value], index) => {
		return {
			name: boxesNames[index],
			value: value,
		};
	});
	const theme = useTheme();
	// Detecta breakpoint activo
	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));

	// Determina columnas activas
	const columnsBoxes = isLg ? 2 : isMd ? 2 : 1;

	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Préstamos Vencidos</Typography>
				</Box>
			</Stack>
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
					{boxes2.map((item, index) => {
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
									{item.name === boxesNames[0]
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
				<Box sx={{ overflowX: "auto" }}>
					<DataTable columns={columns} rows={rows} />
				</Box>
			</Card>
		</Stack>
	);
}
