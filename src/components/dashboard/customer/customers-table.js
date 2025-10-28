"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { renewRequest, updateRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { createTransaction } from "@/app/dashboard/transactions/hooks/use-transactions";
import { getAllUsers } from "@/app/dashboard/users/hooks/use-users";
import { deleteAlphabeticals } from "@/helpers/format-currency";
import { formatPhoneNumber } from "@/helpers/phone-mask";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Autocomplete,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	Menu,
	MenuItem,
	TextField,
	Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BellRinging as BellRingingIcon, DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

dayjs.locale("es");

const getColorByDaysLeft = (daysLeft) => {
	if (daysLeft <= 3) return "#FF0000"; // Rojo;
	if (daysLeft <= 8) return "#FF7F50"; // Naranja;
	if (daysLeft <= 12) return "#FFD700"; // Amarillo
};

export function CustomersTable({ rows, permissions, role, branch }) {
	const columns = [
		{
			formatter: (row) => (
				<Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
					<Typography color="text.secondary" variant="body2">
						{row.client.id}
					</Typography>
					<ShowAlert endDateLoanRequest={row.loanRequest.endDateAt} />
				</Stack>
			),
			name: "#",
			align: "center",
			width: "50px",
		},
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Link
							color="inherit"
							component={RouterLink}
							href={paths.dashboard.customers.details(row.client.id)}
							sx={{ whiteSpace: "nowrap" }}
							variant="subtitle2"
						>
							{row.client.name}
						</Link>
						<Typography color="text.secondary" variant="body2">
							{formatPhoneNumber(row.client.phone)}
						</Typography>
						<Typography color="text.secondary" variant="body2">
							{row.client.document}
						</Typography>
					</div>
				</Stack>
			),
			name: "Nombre Completo",
			width: "150px",
		},
		{
			formatter: (row) => (
				<Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
					<Typography color="inherit" variant="body2">
						{dayjs(row.loanRequest.createdAt).format("MMM D, YYYY").toUpperCase()}
					</Typography>
					<Typography color="inherit" variant="body2">
						{dayjs(row.loanRequest.endDateAt).format("MMM D, YYYY").toUpperCase()}
					</Typography>
				</Stack>
			),
			name: "Fecha Inicio / Fecha Fin",
			align: "center",
			width: "120px",
		},
		{
			formatter(row) {
				return dayjs(row.loanRequest.updatedAt).format("MMM D, YYYY").toUpperCase();
			},
			name: "Fecha Ult. Pago",
			align: "center",
			width: "135px",
		},
		{
			formatter(row) {
				return row.agent.name;
			},
			name: "Agente",
			align: "center",
			width: "135px",
		},
		{
			formatter(row) {
				return row.loanRequest.type?.toUpperCase();
			},
			name: "Tipo Pago",
			align: "center",
			width: "80px",
		},
		{
			formatter(row) {
				return row.loanRequest.mode;
			},
			name: "Modalidad",
			align: "center",
			width: "100px",
		},
		{
			formatter(row) {
				return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.amountBorrowed
				);
			},
			name: "Prestamo",
			align: "center",
			width: "90px",
		},
		{
			formatter(row) {
				return row.loanRequest.paymentDay;
			},
			name: "Dia Pago",
			align: "center",
			width: "70px",
		},
		{ field: "diasMora", name: "Mora", align: "center", width: "60px" },
		{
			formatter(row) {
				return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.totalRepayment
				);
			},
			name: "Abono",
			align: "center",
			width: "90px",
		},

		{
			formatter(row) {
				return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.loanRequest.amount - row.totalRepayment
				);
			},
			name: "Saldo",
			align: "center",
			width: "90px",
		},
		{
			formatter: (row) => <ActionsCell row={row} permissions={permissions} role={role} branch={branch} />,
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

function ShowAlert({ endDateLoanRequest }) {
	const today = dayjs().startOf("day");
	const endDate = dayjs(endDateLoanRequest).utc().startOf("day");
	const daysLeft = endDate.diff(today, "day") + 1;
	const [color, setColor] = React.useState("");

	React.useEffect(() => {
		const color = getColorByDaysLeft(daysLeft);
		setColor(color);
	}, [daysLeft]);

	return daysLeft < 13 ? <BellRingingIcon size={18} weight="fill" color={color} /> : null;
}

export function ActionsCell({ row, permissions, role, branch }) {
	const router = useRouter();
	const popover = usePopover();
	const popoverAlert = usePopover();
	const modalApproved = usePopover();
	const modalFunded = usePopover();
	const modalRenew = usePopover();
	const modalReasigment = usePopover();
	const modalRejected = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [amount, setAmount] = React.useState(0);
	const [selectedDate, setSelectedDate] = React.useState(dayjs(row.endDateAt));
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");
	const [isPending, setIsPending] = React.useState(false);
	const isAgentClosed = Cookies.get("isAgentClosed");

	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const handlePayment = () => {
		if (isAgentClosed === "true") {
			popoverAlert.handleOpen();
			setAlertMsg("El agente ya hizo el cierre del dia.");
			setAlertSeverity("error");
		} else {
			popover.handleClose();
			router.push(paths.dashboard.requests.details(row.loanRequest.id));
		}
	};

	const schema = zod.object({
		user: zod
			.object({
				id: zod.number().nullable(),
				label: zod.string().nullable(),
			})
			.refine(
				(val) =>
					typeof val === "object" &&
					val !== null &&
					"id" in val &&
					typeof val.id === "number" &&
					val.id > 0 &&
					"label" in val &&
					typeof val.label === "string" &&
					val.label.trim() !== "",
				{
					message: "Debes seleccionar un usuario",
				}
			),
		motivoRejected: zod.string().min(1, { message: "La descripción es obligatoria" }),
	});

	const defaultValues = {
		user: { id: row.agent.id, label: row.agent.name },
		motivoRejected: "",
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		getValues,
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

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
			await updateRequest({ status: "approved" }, row.loanRequest.id);
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
			await renewRequest({ amount: amount, newDate: selectedDate }, row.loanRequest.id);
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
				loanRequestId: row.loanRequest.id,
				transactionType: "disbursement",
				amount: row.loanRequest.requestedAmount,
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

	const debounced = React.useMemo(
		() =>
			debounce((value) => {
				if (value.trim()) {
					fetchOptions(value);
				} else {
					setOptions([]);
				}
			}, 700), // Espera 700ms después del último tipo
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	React.useEffect(() => {
		debounced(inputValue);
		// Cleanup del debounce para evitar efectos secundarios
		return () => {
			debounced.clear();
		};
	}, [inputValue, debounced]);

	const fetchOptions = async (query) => {
		setLoading(true);
		try {
			const { data } = await getAllUsers({ name: query, role: "AGENT", branchId: branch });
			const dataFormatted = data.map((user) => ({ label: user.name, id: user.id }));
			setOptions(dataFormatted);
		} catch (error) {
			console.error("Error fetching autocomplete options:", error);
		} finally {
			setLoading(false);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onSubmit = React.useCallback(async (dataForm) => {
		const { user } = dataForm;
		try {
			await updateRequest({ agent: user.id }, row.loanRequest.id);
			setAlertMsg("¡Se ha guardado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			popoverAlert.handleOpen();
			popover.handleClose();
			modalReasigment.handleClose();
			reset();
		}
		router.refresh();
	});

	const handleRequestRejected = async () => {
		const motivoRejectedValue = getValues("motivoRejected");
		try {
			await updateRequest({ status: "rejected", notes: motivoRejectedValue }, row.loanRequest.id);
			setAlertMsg("¡Se ha guardado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			popoverAlert.handleOpen();
			popover.handleClose();
			modalRejected.handleClose();
			reset();
		}
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
					disabled={row.loanRequest.status !== "funded" && row.loanRequest.status !== "renewed"}
					onClick={handlePayment}
				>
					<Typography>Abonar</Typography>
				</MenuItem>
				<MenuItem
					disabled={row.loanRequest.status !== "new" && row.loanRequest.status !== "under_review"}
					onClick={() => {
						popover.handleClose();
						modalApproved.handleOpen();
					}}
				>
					<Typography>Aprobar solicitud</Typography>
				</MenuItem>
				<MenuItem
					disabled={
						(role === "ADMIN" && row.loanRequest.status !== "approved") ||
						canDisburse.granted === false ||
						row.loanRequest.status !== "approved"
					}
					onClick={() => {
						popover.handleClose();
						modalFunded.handleOpen();
					}}
				>
					<Typography>Desembolsar solicitud</Typography>
				</MenuItem>
				<MenuItem
					disabled={row.loanRequest.status !== "funded"}
					onClick={() => {
						popover.handleClose();
						modalRenew.handleOpen();
					}}
				>
					<Typography>Renovar solicitud</Typography>
				</MenuItem>
				<MenuItem
					disabled={role === "AGENT"}
					onClick={() => {
						popover.handleClose();
						modalReasigment.handleOpen();
					}}
				>
					<Typography>Reasignar solicitud</Typography>
				</MenuItem>
				<MenuItem
					onClick={() => {
						popover.handleClose();
						modalRejected.handleOpen();
					}}
				>
					<Typography>Rechazar solicitud</Typography>
				</MenuItem>
			</Menu>

			{/* Modal para rechazar solicitud */}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={modalRejected.open}
				onClose={modalRejected.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4 }}>
					{"Rechazar solicitud"}
				</DialogTitle>

				<DialogContent>
					<form onSubmit={handleSubmit(handleRequestRejected)}>
						<Grid container spacing={3}>
							<Grid
								size={{
									md: 12,
									xs: 12,
								}}
								direction={"row"}
							>
								<Controller
									control={control}
									name="motivoRejected"
									render={({ field }) => (
										<FormControl fullWidth error={Boolean(errors.motivoRejected)}>
											<TextField
												label="Motivo"
												placeholder="Escribe un motivo..."
												multiline
												minRows={3}
												{...field}
												slotProps={{ htmlInput: { maxLength: 150 } }}
											/>
											{errors.motivoRejected ? <FormHelperText>{errors.motivoRejected.message}</FormHelperText> : null}
										</FormControl>
									)}
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
								<Button variant="contained" disabled={isPending} type="submit" autoFocus>
									Guardar
								</Button>
								<Button
									variant="outlined"
									onClick={() => {
										popover.handleClose();
										modalRejected.handleClose();
										reset();
									}}
								>
									Cancelar
								</Button>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>

			{/* Modal para reasignar solicitud */}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={modalReasigment.open}
				onClose={modalReasigment.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4 }}>
					{"Reasignar solicitud"}
				</DialogTitle>

				<DialogContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container spacing={3}>
							<Grid
								size={{
									md: 12,
									xs: 12,
								}}
								direction={"row"}
							>
								<Controller
									control={control}
									name="user"
									render={({ field }) => {
										return (
											<FormControl error={Boolean(errors.user)} fullWidth>
												<InputLabel required sx={{ marginBottom: "0.5rem" }}>
													Agente
												</InputLabel>
												<Autocomplete
													freeSolo
													options={options}
													loading={loading}
													inputValue={inputValue}
													value={field.value || null}
													onInputChange={(event, newInputValue) => {
														setInputValue(newInputValue);
													}}
													onChange={(event, newValue) => {
														field.onChange(newValue ?? { id: null, label: null });
													}}
													getOptionLabel={(option) => (typeof option === "string" ? option : option?.label || "")}
													isOptionEqualToValue={(option, value) => option?.label === value?.label}
													renderInput={(params) => (
														<TextField
															{...params}
															placeholder="Escribe su nombre"
															variant="outlined"
															slotProps={{
																input: {
																	...params.InputProps,
																	endAdornment: (
																		<React.Fragment>
																			{loading ? <CircularProgress color="inherit" size={20} /> : null}
																			{params.InputProps.endAdornment}
																		</React.Fragment>
																	),
																},
															}}
														/>
													)}
												/>
												{errors.user ? <FormHelperText>{errors.user.message}</FormHelperText> : null}
											</FormControl>
										);
									}}
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
								<Button variant="contained" disabled={isPending} type="submit" autoFocus>
									Guardar
								</Button>
								<Button
									variant="outlined"
									onClick={() => {
										popover.handleClose();
										modalReasigment.handleClose();
										reset();
									}}
								>
									Cancelar
								</Button>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>

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
									const parsed = deleteAlphabeticals(e.target.value);
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
							row.loanRequest.requestedAmount
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
