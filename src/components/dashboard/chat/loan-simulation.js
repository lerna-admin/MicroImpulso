"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { sendSimulation } from "@/app/dashboard/chat/hooks/use-conversations";
import { getRequestsByCustomerId, updateRequest } from "@/app/dashboard/requests/hooks/use-requests";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

const parseCurrency = (value) => {
	// Elimina cualquier carácter que no sea número
	return Number(value.replaceAll(/[^0-9]/g, ""));
};

export function LoanSimulation({ contact }) {
	const [capital, setCapital] = React.useState(0);
	const [typePayment, setTypePayment] = React.useState("");
	const [datePayment, setDatePayment] = React.useState("");
	const [selectedDate, setSelectedDate] = React.useState(dayjs());
	const [days, setDays] = React.useState(0);
	const previewRef = React.useRef();

	const popover = usePopover();
	const popoverAlert = usePopover();
	const router = useRouter();

	const EA = 0.261;
	const ED = Math.pow(1 + EA, 1 / 365) - 1;
	const interest = Math.round(capital * ED * days);
	const totalToPay = capital * 1.2;
	const aval = Math.round(totalToPay - capital - interest);

	const handleSend = async () => {
		if (!previewRef.current) return;

		const canvas = await html2canvas(previewRef.current);
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
		const formData = new FormData();
		formData.append("file", blob, "SimulaciónDeCredito.png");
		formData.append("clientId", contact.id);

		popover.handleClose();
		await sendSimulation(formData);
	};

	const handleSave = async () => {
		const request = await getRequestsByCustomerId(contact.id);

		// Actualiza el amount de la solicitud
		const response = await updateRequest(
			{
				requestedAmount: capital,
				endDateAt: selectedDate.utc(true),
				amount: totalToPay,
				paymentDay: datePayment,
				type: typePayment,
			},
			request.id
		);

		if (response) popoverAlert.handleOpen();

		//Probar sin el router refresh, ya que el cambio se veria al dirigirme a la pagina de solicitudes
		router.refresh();
	};

	const handleDateChange = (newValue) => {
		setSelectedDate(newValue);

		if (newValue) {
			const now = dayjs(); // Hora exacta actual
			const target = dayjs(newValue); // Fecha seleccionada con hora (por defecto 00:00)
			const diff = target.diff(now, "day", true); // true => diferencia con decimales

			const rounded = Math.ceil(diff); // Si quieres contar "1 día exacto desde ahora", redondea hacia arriba
			setDays(rounded);
		} else {
			setDays(0);
		}
	};

	return (
		<Stack spacing={4}>
			<Typography variant="h5">Simulador de crédito</Typography>

			{/* Vista Previa */}
			{capital == 0 ? null : (
				<Grid container spacing={3} ref={previewRef} sx={{ p: 2 }} textAlign={"center"}>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Typography>
							<strong>Capital:</strong> ${capital.toLocaleString()}
						</Typography>
					</Grid>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Typography>
							<strong>Tasa E.A:</strong> 26.1%
						</Typography>
					</Grid>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Typography>
							<strong>Tasa E.D:</strong> {(ED * 100).toFixed(6)}%
						</Typography>
					</Grid>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Typography>
							<strong>Días para pagar:</strong> {days > 1 ? `${days} días` : `${days} día`}
						</Typography>
					</Grid>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Typography>
							<strong>Interés:</strong> {days < 1 ? null : `$${interest.toLocaleString()}`}
						</Typography>
					</Grid>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Typography>
							<strong>Aval:</strong> ${aval.toLocaleString()}
						</Typography>
					</Grid>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Typography>
							<strong>Total a pagar:</strong> ${totalToPay.toLocaleString()}
						</Typography>
					</Grid>
					{/* <Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
							<QRCodeSVG value="https://microimpulso.lernasoft.net" size={73} />
						</Box>
					</Grid> */}
				</Grid>
			)}

			{/* Formulario */}
			<Grid container spacing={3}>
				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<TextField
						label="Monto Solicitado"
						variant="outlined"
						slotProps={{ htmlInput: { min: 0 } }}
						value={capital.toLocaleString("es-CO")}
						onChange={(e) => {
							const parsed = parseCurrency(e.target.value);
							setCapital(parsed);
						}}
						fullWidth
					/>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<InputLabel id="type-payment">Tipo de pago</InputLabel>
					<Select fullWidth labelId="type-payment" value={typePayment} onChange={(e) => setTypePayment(e.target.value)}>
						<MenuItem value="QUINCENAL">Quincenal</MenuItem>
						<MenuItem value="MENSUAL">Mensual</MenuItem>
					</Select>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<InputLabel id="date-payment">Fecha de pago</InputLabel>
					<Select fullWidth labelId="date-payment" value={datePayment} onChange={(e) => setDatePayment(e.target.value)}>
						<MenuItem value="15-30">15 - 30</MenuItem>
						<MenuItem value="5-20">5 - 20</MenuItem>
						<MenuItem value="10-25">10 - 25</MenuItem>
					</Select>
				</Grid>
				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<DatePicker
						sx={{ width: "100%" }}
						label="Día a pagar"
						value={selectedDate}
						onChange={handleDateChange}
						minDate={dayjs()}
					/>
				</Grid>
				<Grid
					size={{
						md: 4,
						xs: 12,
					}}
				>
					<Button
						variant="contained"
						disabled={
							capital === 0 || typePayment === "" || datePayment === "" || dayjs(selectedDate).isSame(dayjs(), "day")
						}
						onClick={handleSave}
					>
						Guardar
					</Button>
				</Grid>
				<Grid
					display={"flex"}
					justifyContent={"end"}
					size={{
						md: 8,
						xs: 12,
					}}
				>
					<Button
						variant="contained"
						disabled={
							capital === 0 || typePayment === "" || datePayment === "" || dayjs(selectedDate).isSame(dayjs(), "day")
						}
						onClick={popover.handleOpen}
					>
						Enviar Simulación al Cliente
					</Button>
				</Grid>
			</Grid>

			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={"¡Solicitud actualizada!"}
			></NotificationAlert>

			{/* Modal para enviar simulacion de credito*/}
			<Dialog
				fullWidth
				maxWidth={"sm"}
				open={popover.open}
				onClose={popover.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"}>
					{"Confirmación"}
				</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"justify"}>
						{`¿ Desea enviarle una simulación de credito a ${contact.name}
						 por un monto de ${Number.parseInt(capital).toLocaleString("es-CO", {
								style: "currency",
								currency: "COP",
								minimumFractionDigits: 0,
							})} ?`}
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ padding: 3 }}>
					<Button variant="contained" onClick={handleSend} autoFocus>
						Aceptar
					</Button>
					<Button variant="outlined" onClick={popover.handleClose}>
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
