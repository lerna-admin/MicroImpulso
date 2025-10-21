"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Chip, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import {
	CheckCircle,
	Clock,
	DotsThree as DotsThreeIcon,
	ExclamationMark,
	XCircle,
} from "@phosphor-icons/react/dist/ssr";

import { paths } from "@/paths";
import { usePopover } from "@/hooks/use-popover";
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
				renewed: {
					label: "Renovada",
					icon: <CheckCircle color="var(--mui-palette-info-main)" weight="fill" />,
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
		formatter: (row) => <ActionsCell row={row} />,
		name: "Acciones",
		hideName: true,
		width: "70px",
		align: "right",
	},
	// {
	// 	formatter: (row) => {
	// 		return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
	// 			row.requestedAmount
	// 		);
	// 	},
	// 	name: "Cantidad solicitada",
	// 	width: "100px",
	// 	align: "center",
	// },
	// {
	// 	formatter: (row) => {
	// 		return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
	// 			row.amount
	// 		);
	// 	},
	// 	name: "Total a pagar",
	// 	width: "100px",
	// 	align: "right",
	// },
];

export function CustomersLineItemsTable({ rows }) {
	return <DataTable columns={columns} rows={rows} />;
}

export function ActionsCell({ row }) {

	const [anchorEl, setAnchorEl] = React.useState(null);
	const popover = usePopover();
	const router = useRouter();

	const handleHistoryPayment = () => {
		router.push(paths.dashboard.requests.details(row.id));
	};

	const handleOptions = (event) => {
		popover.handleOpen();
		setAnchorEl(event.currentTarget);
	};

	return (
		<React.Fragment>
			<Tooltip title="Más opciones">
				<IconButton onClick={handleOptions}>
					<DotsThreeIcon weight="bold" />
				</IconButton>
			</Tooltip>

			<Menu
				anchorEl={anchorEl}
				open={popover.open}
				onClose={popover.handleClose}
				slotProps={{ paper: { elevation: 0 } }}
			>
				<MenuItem onClick={handleHistoryPayment}>
					<Typography>Ver historial de pagos</Typography>
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
