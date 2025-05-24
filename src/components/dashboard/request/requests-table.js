"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { updateRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { createTransaction } from "@/app/dashboard/transactions/hooks/use-transactions";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Link,
	Menu,
	MenuItem,
	Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
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
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

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
						No se encontraron solicitudes
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}

export function ActionsCell({ row }) {
	const router = useRouter();
	const popover = usePopover();
	const popoverAlert = usePopover();
	const popoverModalApproved = usePopover();
	const popoverModalFunded = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleOptions = (event) => {
		setAnchorEl(event.currentTarget);
		popover.handleOpen();
	};

	const handleApproveLoanRequest = async () => {
		const response = await updateRequest({ status: "approved" }, row.id);
		if (response.status === 200) popoverAlert.handleOpen();
		router.refresh();
		popoverModalApproved.handleClose();
	};

	const handleFundedLoanRequest = async () => {
		const data = {
			loanRequestId: row.id,
			transactionType: "disbursement",
			amount: row.requestedAmount,
			reference: "Abono cliente",
		};

		await createTransaction(data);

		router.refresh();
		popoverModalFunded.handleClose();
	};

	return (
		<React.Fragment>
			<Tooltip title="Más opciones">
				<IconButton disabled={row.status === "funded"} onClick={handleOptions}>
					<DotsThreeIcon weight="bold" />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				open={popover.open}
				onClose={popover.handleClose}
				slotProps={{ paper: { elevation: 0 } }}
			>
				<MenuItem
					onClick={() => {
						popover.handleClose();
						popoverModalApproved.handleOpen();
					}}
				>
					<Typography>Aprobar</Typography>
				</MenuItem>
				<MenuItem
					onClick={() => {
						popover.handleClose();
						popoverModalFunded.handleOpen();
					}}
				>
					<Typography>Desembolsar</Typography>
				</MenuItem>
			</Menu>

			{/* Modal para aprobar solicitud*/}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={popoverModalApproved.open}
				onClose={popoverModalApproved.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Confirmación"}</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"center"}>
						{`¿Desea cambiar el estado de la solicitud a Aprobada para el cliente ${row.client.name}?`}
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ padding: 3 }}>
					<Button variant="contained" onClick={handleApproveLoanRequest} autoFocus>
						Aceptar
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							popover.handleClose();
							popoverModalApproved.handleClose();
						}}
					>
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>

			{/* Modal para desembolsar solicitud*/}
			<Dialog
				fullWidth
				maxWidth={"sm"}
				open={popoverModalFunded.open}
				onClose={popoverModalFunded.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"}>
					{"Confirmación"}
				</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"justify"}>
						{`Esta acción no realiza el desembolso automáticamente.
						Al aceptar, se notificará al cliente ${row.client.name} que su préstamo de ${Number.parseInt(
							row.requestedAmount
						).toLocaleString("es-CO", {
							style: "currency",
							currency: "COP",
							minimumFractionDigits: 0,
						})} fue desembolsado.
						Asegúrese de haber realizado el desembolso de forma manual antes de continuar.`}
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ padding: 3 }}>
					<Button variant="contained" onClick={handleFundedLoanRequest} autoFocus>
						Aceptar
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							popover.handleClose();
							popoverModalFunded.handleClose();
						}}
					>
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>

			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={"Solicitud actualizada!"}
				autoHideDuration={2000}
				posHorizontal={"right"}
				posVertical={"bottom"}
			></NotificationAlert>
		</React.Fragment>
	);
}
