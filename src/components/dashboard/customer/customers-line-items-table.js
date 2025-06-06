"use client";

import * as React from "react";
import { Chip, Typography } from "@mui/material";
import { CheckCircle, Clock, ExclamationMark, XCircle } from "@phosphor-icons/react/dist/ssr";

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
			return <Typography variant="body2">{row.agent.name}</Typography>;
		},
		name: "Agente",
		width: "200px",
		align: "center",
	},
	{
		formatter: (row) => {
			const mapping = {
				new: {
					label: "Nueva",
					icon: <ExclamationMark color="var(--mui-palette-info-main)" weight="fill" />,
				},
				under_review: {
					label: "En estudio",
					icon: <Clock color="var(--mui-palette-warning-main)" weight="fill" />,
				},
				approved: {
					label: "Aprobada",
					icon: <CheckCircle color="var(--mui-palette-info-main)" weight="fill" />,
				},
				funded: {
					label: "Desembolsado",
					icon: <CheckCircle color="var(--mui-palette-warning-main)" weight="fill" />,
				},
				completed: {
					label: "Completada",
					icon: <CheckCircle color="var(--mui-palette-success-main)" weight="fill" />,
				},
				rejected: { label: "Rechazada", icon: <XCircle color="var(--mui-palette-error-main)" weight="fill" /> },
				canceled: { label: "Cancelada", icon: <XCircle color="var(--mui-palette-error-main)" weight="fill" /> },
			};
			const { label, icon } = mapping[row.status] ?? { label: "Unknown", icon: null };

			return <Chip icon={icon} label={label} size="small" variant="outlined" />;
		},
		name: "Estado",
		width: "100px",
		align: "center",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.requestedAmount
			);
		},
		name: "Cantidad solicitada",
		width: "100px",
		align: "center",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.amount
			);
		},
		name: "Total a pagar",
		width: "100px",
		align: "right",
	},
];

export function CustomersLineItemsTable({ rows }) {
	return <DataTable columns={columns} rows={rows} />;
}
