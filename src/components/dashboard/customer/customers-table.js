"use client";

import * as React from "react";
import RouterLink from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
// import { Clock as ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
// import { Minus as MinusIcon } from "@phosphor-icons/react/dist/ssr/Minus";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

import { useCustomersSelection } from "./customers-selection-context";

const columns = [
	{ field: "id", name: "Identificación", width: "150px" },
	{
		formatter: (row) => (
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<Avatar src={row.avatar} />{" "}
				<div>
					<Link
						color="inherit"
						component={RouterLink}
						href={paths.dashboard.customers.details("1")}
						sx={{ whiteSpace: "nowrap" }}
						variant="subtitle2"
					>
						{row.name}
					</Link>
					<Typography color="text.secondary" variant="body2">
						{row.email}
					</Typography>
				</div>
			</Stack>
		),
		name: "Nombre Completo",
		width: "250px",
	},
	{ field: "phone", name: "Celular", width: "150px" },
	{ field: "address", name: "Dirección", width: "150px" },
	{ field: "amount_borrowed", name: "Monto Prestado", width: "150px" },
	{
		formatter(row) {
			return dayjs(row.createdAt).format("MMM D, YYYY h:mm A");
		},
		name: "Fecha de creación",
		width: "200px",
	},
	{
		formatter: (row) => {
			const mapping = {
				active: { label: "Activo", icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
				inactive: { label: "Inactivo", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
			};
			const { label, icon } = mapping[row.status] ?? { label: "Unknown", icon: null };

			return <Chip icon={icon} label={label} size="small" variant="outlined" />;
		},
		name: "Estado",
		width: "150px",
	},
	{
		formatter: () => (
			<IconButton component={RouterLink} href={paths.dashboard.customers.details("1")}>
				<PencilSimpleIcon />
			</IconButton>
		),
		name: "Actions",
		hideName: true,
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
