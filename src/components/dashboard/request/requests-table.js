"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { renewRequest, updateRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { createTransaction } from "@/app/dashboard/transactions/hooks/use-transactions";
import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Link,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
	DotsThree as DotsThreeIcon,
	ExclamationMark as ExclamationMarkIcon,
	XCircle as XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock as ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
import Cookies from "js-cookie";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function RequestsTable({ rows, permissions }) {
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
			name: "Fecha Inicio / Fecha Fin",
			align: "center",
			width: "120px",
		},
		{
			formatter(row) {
				return dayjs(row.updatedAt).format("MMM D, YYYY");
			},
			name: "Fecha Ult. Pago",
			width: "135px",
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
			formatter: (row) => <ActionsCell row={row} permissions={permissions} />,
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
						No se encontraron solicitudes
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}

export function ActionsCell({ row, permissions }) {
	const router = useRouter();
	const popover = usePopover();
	const popoverAlert = usePopover();
	const modalApproved = usePopover();
	const modalFunded = usePopover();
	const modalRenew = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [amount, setAmount] = React.useState(0);
	const [selectedDate, setSelectedDate] = React.useState(dayjs(row.endDateAt));
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");
	const [isPending, setIsPending] = React.useState(false);
	const isAgentClosed = Cookies.get("isAgentClosed");

	const canDisburse = permissions.find((per) => per.name === "CAN_DISBURSE");

	const handleOptions = (event) => {
		if (isAgentClosed === "true") {
			popoverAlert.handleOpen();
			setAlertMsg("El agente ya hizo el cierre del dia.");
			setAlertSeverity("error");
		} else {
			popover.handleOpen();
			setAnchorEl(event.currentTarget);
		}
	};

	const handleApproveLoanRequest = async () => {
		setIsPending(true);
		try {
			await updateRequest({ status: "approved" }, row.id);
			setAlertMsg("¡Aprobado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}
		popoverAlert.handleOpen();
		modalApproved.handleClose();
		setIsPending(false);
		router.refresh();
	};

	const handleRenewLoanRequest = async () => {
		setIsPending(true);
		try {
			await renewRequest({ amount: amount, newDate: selectedDate }, row.id);
			setAlertMsg("¡Renovado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}
		popoverAlert.handleOpen();
		modalRenew.handleClose();
		setIsPending(false);
		router.refresh();
	};

	const handleFundedLoanRequest = async () => {
		setIsPending(true);
		try {
			await createTransaction({
				loanRequestId: row.id,
				transactionType: "disbursement",
				amount: row.requestedAmount,
				reference: "Desembolso cliente",
			});
			setAlertMsg("¡Desembolsado exitosamente!");
			setAlertSeverity("success");
			modalFunded.handleClose();
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}
		popoverAlert.handleOpen();
		setIsPending(false);
		router.refresh();
	};

	const handleDateChange = (newValue) => {
		setSelectedDate(newValue);
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
				<MenuItem
					disabled={row.status !== "new" && row.status !== "under_review"}
					onClick={() => {
						popover.handleClose();
						modalApproved.handleOpen();
					}}
				>
					<Typography>Aprobar</Typography>
				</MenuItem>
				<MenuItem
					disabled={row.status !== "approved" || canDisburse.granted === false}
					onClick={() => {
						popover.handleClose();
						modalFunded.handleOpen();
					}}
				>
					<Typography>Desembolsar</Typography>
				</MenuItem>
				<MenuItem
					disabled={row.status !== "funded"}
					onClick={() => {
						popover.handleClose();
						router.push(paths.dashboard.requests.details(row.id));
					}}
				>
					<Typography>Abonar</Typography>
				</MenuItem>
				<MenuItem
					disabled={row.status !== "funded"}
					onClick={() => {
						popover.handleClose();
						modalRenew.handleOpen();
					}}
				>
					<Typography>Renovar</Typography>
				</MenuItem>
			</Menu>

			{/* Modal para renovar solicitud */}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={modalRenew.open}
				onClose={modalRenew.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4 }}>
					{"Renovar solicitud"}
				</DialogTitle>

				<DialogContent>
					<Grid container spacing={3}>
						<Grid
							size={{
								md: 12,
								xs: 12,
							}}
						>
							<TextField
								label="Monto"
								variant="outlined"
								slotProps={{ htmlInput: { min: 0 } }}
								value={amount.toLocaleString("es-CO")}
								onChange={(e) => {
									const parsed = parseCurrency(e.target.value);
									setAmount(parsed);
								}}
								fullWidth
							/>
						</Grid>
						<Grid
							size={{
								md: 12,
								xs: 12,
							}}
						>
							<DatePicker
								sx={{ width: "100%" }}
								label="Fecha nueva"
								value={selectedDate}
								onChange={handleDateChange}
								minDate={dayjs(row.endDateAt)}
							/>
						</Grid>

						<Grid
							size={{
								md: 12,
								xs: 12,
							}}
							display={"flex"}
							justifyContent={"flex-end"}
							gap={2}
						>
							<Button variant="contained" disabled={isPending} onClick={handleRenewLoanRequest} autoFocus>
								Aceptar
							</Button>
							<Button
								variant="outlined"
								onClick={() => {
									popover.handleClose();
									modalRenew.handleClose();
								}}
							>
								Cancelar
							</Button>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>

			{/* Modal para aprobar solicitud*/}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={modalApproved.open}
				onClose={modalApproved.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4 }}>
					{"Confirmación"}
				</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"justify"} sx={{ pb: 3 }}>
						{`¿Desea aprobar la solicitud para el cliente ${row.client.name}?`}
					</DialogContentText>
					<Box component={"div"} display={"flex"} justifyContent={"flex-end"} gap={2}>
						<Button variant="contained" disabled={isPending} onClick={handleApproveLoanRequest} autoFocus>
							Aceptar
						</Button>
						<Button
							variant="outlined"
							onClick={() => {
								popover.handleClose();
								modalApproved.handleClose();
							}}
						>
							Cancelar
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			{/* Modal para desembolsar solicitud*/}
			<Dialog
				fullWidth
				maxWidth={"sm"}
				open={modalFunded.open}
				onClose={modalFunded.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4 }}>
					{"Confirmación"}
				</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"justify"} sx={{ pb: 2 }}>
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
					<Box component={"div"} display={"flex"} justifyContent={"flex-end"} gap={2}>
						<Button variant="contained" onClick={handleFundedLoanRequest} disabled={isPending} autoFocus>
							Aceptar
						</Button>
						<Button
							variant="outlined"
							onClick={() => {
								popover.handleClose();
								modalFunded.handleClose();
							}}
						>
							Cancelar
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</React.Fragment>
	);
}

const parseCurrency = (value) => {
	// Elimina cualquier carácter que no sea número
	return Number(value.replaceAll(/[^0-9]/g, ""));
};
