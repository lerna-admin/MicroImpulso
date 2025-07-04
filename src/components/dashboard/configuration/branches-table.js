"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

dayjs.locale("es");

export function BranchesTable({ rows }) {
	const columns = [
		{
			formatter: (row) => (
				<Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
					<Typography color="text.secondary" variant="body2">
						{row.id}
					</Typography>
				</Stack>
			),
			name: "#",
			align: "center",
			width: "50px",
		},
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Typography color="text.secondary" variant="body2">
							{row.name}
						</Typography>
					</div>
				</Stack>
			),
			name: "Nombre Completo",
			width: "150px",
		},
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Typography color="text.secondary" variant="body2">
							{row.administrator?.name}
						</Typography>
					</div>
				</Stack>
			),
			name: "Administrador",
			width: "150px",
		},
		{
			formatter: (row) => (
				<Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
					<Typography color="inherit" variant="body2">
						{dayjs(row.createdAt).format("MMM D, YYYY").toUpperCase()}
					</Typography>
				</Stack>
			),
			name: "Fecha creación",
			align: "center",
			width: "120px",
		},
	];

	return (
		<React.Fragment>
			<DataTable columns={columns} rows={rows} />
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No se encontraron sedes
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}
