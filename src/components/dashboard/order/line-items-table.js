"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import { DataTable } from "@/components/core/data-table";

const columns = [
	{
		formatter: (row) => row.id,
		name: "ID",
		width: "120px",
		align: "center",
	},

	{
		formatter: (row) => {
			return (
				<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
					
					<Link color="text.primary" variant="subtitle2">
						{row.product}
					</Link>
				</Stack>
			);
		},
		name: "Agente",
		width: "200px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: row.currency }).format(row.unitAmount);
		},
		name: "Cantidad solicitada",
		width: "100px",
		align: "center",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: row.currency }).format(row.totalAmount);
		},
		name: "Total a pagar",
		width: "100px",
		align: "center",
	},
];

export function LineItemsTable({ rows }) {
	return <DataTable columns={columns} rows={rows} />;
}
