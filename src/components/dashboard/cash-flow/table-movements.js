"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

const invoices = [
	{
		id: "INV-004",
		description: "Anim excepteur dolor excepteur id voluptate amet adipisicing exercitation non eu.",
		amount: 550_000,
		category: "cobro",
		createdDate: dayjs().subtract(1, "hour").toDate(),
	},
	{
		id: "INV-003",
		description: "Sint qui incididunt ea occaecat incididunt ad cillum sunt tempor.",
		amount: 190_000,
		category: "prestamos",
		createdDate: dayjs().subtract(2, "hour").subtract(2, "day").toDate(),
	},
	{
		id: "INV-002",
		description: "Ullamco est ex ullamco magna esse qui consequat laborum minim deserunt ut velit eu.",
		amount: 781_000,
		category: "gastos",
		createdDate: dayjs().subtract(4, "hour").subtract(6, "day").toDate(),
	},
];

const columns = [
	{ field: "id", name: "ID", width: "150px" },

	{
		formatter: (row) => {
			const mapping = {
				cobro: { label: "Cobro", color: "success" },
				prestamos: { label: "Prestamos", color: "error" },
				gastos: { label: "Gastos", color: "success" },
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

export function TableMovements() {
	return (
		<Card>
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
				<DataTable columns={columns} rows={invoices} />
			</Box>
		</Card>
	);
}
