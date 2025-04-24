"use client";

import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

import { useCustomersSelection } from "./customers-selection-context";

const columns = [
	{ field: "documentId", name: "Cedula", width: "100px" },
	{
		formatter: (row) => (
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<div>
					<Link
						color="inherit"
						component={RouterLink}
						href={paths.dashboard.customers.details("1")}
						sx={{ whiteSpace: "nowrap" }}
						variant="subtitle2"
					>
						{row.fullName}
					</Link>
					<Typography color="text.secondary" variant="body2">
						{row.email}
					</Typography>
				</div>
			</Stack>
		),
		name: "Nombre Completo",
		width: "200px",
	},
	{ field: "phoneNumber", name: "Celular", width: "130px" },
	{ field: "address", name: "Dirección", width: "150px" },
	{
		formatter(row) {
			return `$${row.amountTaken}`;
		},
		name: "Monto Prestado",
		width: "100px",
	},
	{
		formatter(row) {
			return dayjs(row.startDate).format("MMM D, YYYY");
		},
		name: "Fecha Inicio",
		width: "150px",
	},
	{
		formatter(row) {
			return dayjs(row.endDate).format("MMM D, YYYY");
		},
		name: "Fecha Fin",
		width: "150px",
	},
	{
		formatter: (row) => {
			const mapping = {
				true: { label: "Activo", icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
				false: { label: "Inactivo", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
			};
			const { label, icon } = mapping[row.state] ?? { label: "Unknown", icon: null };

			return <Chip icon={icon} label={label} size="small" variant="outlined" />;
		},
		name: "Estado",
		width: "100px",
	},
	{
		formatter: () => (
			<IconButton component={RouterLink} href={paths.dashboard.customers.details("1")}>
				<PencilSimpleIcon />
			</IconButton>
		),
		name: "Acciones",
		hideName: false,
		width: "100px",
		align: "right",
	},
];

export function CustomersTable({ rows }) {
	const { deselectAll, deselectOne, selectAll, selectOne, selected } = useCustomersSelection();

	return (
		<React.Fragment>
			<DataTable
				columns={columns}
				onDeselectAll={deselectAll}
				onDeselectOne={(_, row) => {
					deselectOne(row.id);
				}}
				onSelectAll={selectAll}
				onSelectOne={(_, row) => {
					selectOne(row.id);
				}}
				rows={rows}
				selectable
				selected={selected}
			/>
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No se encontraron clientes
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}
