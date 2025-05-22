"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	DotsThree as DotsThreeIcon,
	ExclamationMark as ExclamationMarkIcon,
	XCircle as XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock as ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";

const columns = [
	{
		formatter: (row) => (
			<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
				<Typography variant="subtitle2">{row.client.name}</Typography>
			</Stack>
		),
		name: "Nombre completo",
		width: "150px",
	},
	{ formatter: (row) => <p>{row.client.document}</p>, name: "Identificación", width: "100px" },
	{
		formatter(row) {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP" }).format(row.requestedAmount);
		},
		name: "Monto solicitado",
		width: "70px",
	},
	{
		formatter(row) {
			return dayjs(row.createdAt).format("MMM D, YYYY");
		},
		name: "Fecha de inicio",
		width: "100px",
	},
	{
		formatter(row) {
			return dayjs(row.updatedAt).format("MMM D, YYYY");
		},
		name: "Fecha de actualización",
		width: "100px",
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

	{
		formatter: (row) => <ActionsCell row={row} />,
		name: "Acciones",
		hideName: true,
		width: "70px",
		align: "right",
	},
];

export function RequestsTable({ rows }) {
	return (
		<React.Fragment>
			<DataTable columns={columns} rows={rows} />
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No requests found
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}

export function ActionsCell({ row }) {
	const router = useRouter();
	const popover = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleOptions = (event) => {
		setAnchorEl(event.currentTarget);
		popover.handleOpen();
	};

	const handleViewLoanRequest = () => {
		popover.handleClose();
		router.push(paths.dashboard.requests.details(row.id));
	};

	return (
		<>
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
				<MenuItem>
					<Typography>Abono Interes</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Aumento</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Fallida</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Abonar</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Renovar</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Historico</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Mensajeria</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Comunicación</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Sacar</Typography>
				</MenuItem>
				<MenuItem>
					<Typography>Novedad</Typography>
				</MenuItem>
				<MenuItem onClick={handleViewLoanRequest}>
					<Typography>Ver solicitud</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}
