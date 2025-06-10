"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

const columns = [
	{ field: "id", name: "ID", width: "150px" },
	{
		formatter: (row) => {
			const mapping = {
				COBRO_CLIENTE: { label: "Cobro", color: "success" },
				PRESTAMO: { label: "Prestamos", color: "error" },
				ENTRADA_GERENCIA: { label: "Entra caja", color: "success" },
				GASTO_PROVEEDOR: { label: "Gastos", color: "error" },
			};
			const { label, color } = mapping[row.category] ?? { label: "Unknown", color: "secondary" };

			return <Chip color={color} label={label} size="small" variant="soft" />;
		},
		name: "Categoria",
		width: "150px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.amount
			);
		},
		name: "Monto",
		width: "150px",
	},
	{
		formatter: (row) => {
			return dayjs(row.createdDate).format("MMM D, YYYY");
		},
		name: "Fecha de creación",
		width: "150px",
	},
	{
		formatter: (row) => (
			<div>
				<Typography color="text.secondary" variant="body2">
					{row.description}
				</Typography>
			</div>
		),
		name: "Description",
		width: "250px",
	},
];

export function MovementsTable({ movementsData }) {
	return (
		<>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", p: 3 }}>
				<OutlinedInput
					placeholder="Buscar movimientos"
					startAdornment={
						<InputAdornment position="start">
							<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
						</InputAdornment>
					}
					sx={{ flex: "1 1 auto" }}
				/>
			</Stack>
			<Divider />
			<Box sx={{ overflowX: "auto" }}>
				<DataTable columns={columns} rows={movementsData} />
			</Box>
		</>
	);
}
