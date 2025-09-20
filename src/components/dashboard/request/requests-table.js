"use client";

import * as React from "react";
import RouterLink from "next/link";
import {
	Link,
	Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import {
	ExclamationMark as ExclamationMarkIcon,
	XCircle as XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock as ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

export function RequestsTable({ rows }) {
	const columns = [
		{
			formatter: (row) => (
				<Link
					color="inherit"
					component={RouterLink}
					href={paths.dashboard.requests.details(row.id)}
					sx={{ whiteSpace: "nowrap" }}
					variant="subtitle2"
				>
					{row.client.name}
				</Link>
			),
			name: "Nombre completo",
			width: "180px",
		},
		{ formatter: (row) => <p>{row.client.document}</p>, name: "Identificación", width: "130px" },
		{
			formatter: (row) => (
				<Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
					<Typography color="inherit" variant="body2">
						{dayjs(row.createdAt).format("MMM D, YYYY")}
					</Typography>
					<Typography color="inherit" variant="body2">
						{dayjs(row.endDateAt).format("MMM D, YYYY")}
					</Typography>
				</Stack>
			),
			name: "Fecha Inicio - Fecha Fin",
			width: "120px",
		},
		{
			formatter(row) {
				return dayjs(row.updatedAt).format("MMM D, YYYY");
			},
			name: "Fecha Ult. Pago",
			width: "150px",
		},
		{
			formatter(row) {
				return row.agent.name;
			},
			name: "Agente",
			width: "150px",
		},
		{
			formatter(row) {
				return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.requestedAmount
				);
			},
			name: "Monto solicitado",
			width: "160px",
		},
		{
			formatter: (row) => {
				const mapping = {
					new: {
						label: "Nueva",
						icon: <ExclamationMarkIcon color="var(--mui-palette-info-main)" weight="fill" />,
					},
					under_review: {
						label: "En estudio",
						icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" />,
					},
					approved: {
						label: "Aprobada",
						icon: <CheckCircleIcon color="var(--mui-palette-info-main)" weight="fill" />,
					},
					funded: {
						label: "Desembolsado",
						icon: <CheckCircleIcon color="var(--mui-palette-warning-main)" weight="fill" />,
					},
					completed: {
						label: "Completada",
						icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
					},
					rejected: { label: "Rechazada", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
					canceled: { label: "Cancelada", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
				};
				const { label, icon } = mapping[row.status] ?? { label: "Unknown", icon: null };

				return <Chip icon={icon} label={label} size="small" variant="outlined" />;
			},
			name: "Estado",
			width: "100px",
		},
	];

	return (
		<React.Fragment>
			<DataTable columns={columns} rows={rows} />
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No se encontraron solicitudes.
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}


