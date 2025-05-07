"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	CardsThree as CardsThreeIcon,
	DotsThree as DotsThreeIcon,
	XCircle as XCircleIcon,
	Timer as TimerIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";

export function CustomersTable({ rows }) {
	const columns = [
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Typography variant="subtitle2">{row.name}</Typography>
						<Typography color="text.secondary" variant="body2">
							{row.email}
						</Typography>
					</div>
				</Stack>
			),
			name: "Nombre Completo",
			width: "150px",
		},
		{ field: "documentId", name: "Identificación", width: "150px" },
		{ field: "phone", name: "Celular", width: "130px" },
		{ field: "address", name: "Dirección", width: "150px" },
		{
			formatter(row) {
				return row.amountTaken ? `$ ${row.amountTaken}` : `$ 0`;
			},
			name: "Monto Prestado",
			width: "100px",
		},
		{
			formatter(row) {
				return dayjs(row.createdAt).format("MMM D, YYYY");
			},
			name: "Fecha creación",
			width: "150px",
		},
		{
			formatter(row) {
				return dayjs(row.updatedAt).format("MMM D, YYYY");
			},
			name: "Fecha actualizada",
			width: "150px",
		},
		{
			formatter: (row) => {
				const mapping = {
					active: { label: "Activo", icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
					inactive: { label: "Inactivo", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
					pending: { label: "Pendiente", icon: <TimerIcon color="var(--mui-palette-warning-main)" weight="fill"/> },
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

	return (
		<React.Fragment>
			<DataTable columns={columns} rows={rows} />
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

export function ActionsCell({ row }) {
	const router = useRouter();
	const popover = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleOptions = (event) => {
		setAnchorEl(event.currentTarget);
		popover.handleOpen();
	};

	const handleEditProfile = () => {
		popover.handleClose();
		router.push(paths.dashboard.customers.details(row.id));
	};

	const handleApplications = () => {
		popover.handleClose();
		router.push(paths.dashboard.applications);
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
				<MenuItem onClick={handleEditProfile}>
					<ListItemIcon>
						<PencilSimpleIcon />
					</ListItemIcon>
					<Typography>Editar perfil</Typography>
				</MenuItem>
				<MenuItem onClick={handleApplications}>
					<ListItemIcon>
						<CardsThreeIcon />
					</ListItemIcon>
					<Typography>Ver solicitudes</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}
