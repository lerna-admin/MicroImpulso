"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	CardsThree as CardsThreeIcon,
	DotsThree as DotsThreeIcon,
	Timer as TimerIcon,
	WarningDiamond as WarningDiamondIcon,
	XCircle as XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";

export function CustomersTable({ rows }) {
	const columns = [
		{ field: "clientId", name: "#", width: "50px" },
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Link
							color="inherit"
							component={RouterLink}
							href={paths.dashboard.customers.details(row.clientId)}
							sx={{ whiteSpace: "nowrap" }}
							variant="subtitle2"
						>
							{row.clientName}
						</Link>
						<Typography color="text.secondary" variant="body2">
							{row.phone}
						</Typography>
						<Typography color="text.secondary" variant="body2">
							{row.document}
						</Typography>
					</div>
				</Stack>
			),
			name: "Nombre Completo",
			width: "150px",
		},
		{
			formatter(row) {
				return dayjs(row.createdAt).format("MMM D, YYYY");
			},
			name: "Fecha Inicio",
			width: "150px",
		},
		{
			formatter(row) {
				return dayjs(row.updatedAt).format("MMM D, YYYY");
			},
			name: "Fecha Final",
			width: "150px",
		},
		{
			formatter(row) {
				return dayjs(row.createdAt).format("MMM D, YYYY");
			},
			name: "Fecha Ult. Pago",
			width: "150px",
		},
		{ field: "loanType", name: "Tipo Pago", width: "150px" },
		{ field: "loanMode", name: "Modalidad", width: "150px" },
		{ field: "amountBorrowed", name: "Prestamo", width: "150px" },
		{ field: "", name: "Dia Pago", width: "150px" },
		{ field: "moraDays", name: "Mora", width: "150px" },
		{ field: "totalPaid", name: "Abono", width: "150px" },

		{
			formatter(row) {
				return row.totalAmountToPay - row.totalPaid;
			},
			name: "Saldo",
			width: "150px",
		},
		// {
		// 	formatter(row) {
		// 		return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP" }).format(row.totalLoanAmount);
		// 	},
		// 	name: "Monto Prestado",
		// 	width: "100px",
		// },
		// {
		// 	formatter: (row) => {
		// 		const mapping = {
		// 			active: { label: "Activo", icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
		// 			inactive: { label: "Inactivo", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
		// 			suspended: { label: "Suspendido", icon: <TimerIcon color="var(--mui-palette-warning-main)" weight="fill" /> },
		// 			prospect: {
		// 				label: "Prospecto",
		// 				icon: <WarningDiamondIcon color="var(--mui-palette-info-main)" weight="fill" />,
		// 			},
		// 		};
		// 		const { label, icon } = mapping[row.status.toLowerCase()] ?? { label: "Unknown", icon: null };

		// 		return <Chip icon={icon} label={label} size="small" variant="outlined" />;
		// 	},
		// 	name: "Estado",
		// 	width: "100px",
		// },
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

function ActionsCell({ row }) {
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

	const handleLoanRequests = () => {
		popover.handleClose();
		router.push(`${paths.dashboard.requests.list}?document=${row.document}`);
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
				{/* <MenuItem onClick={handleEditProfile}>
					<ListItemIcon>
						<PencilSimpleIcon />
					</ListItemIcon>
					<Typography>Editar perfil</Typography>
				</MenuItem> */}
				{/* <MenuItem onClick={handleLoanRequests}>
					<ListItemIcon>
						<CardsThreeIcon />
					</ListItemIcon>
					<Typography>Ver solicitudes</Typography>
				</MenuItem> */}
				<MenuItem>
					<Typography>Abonar</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}
