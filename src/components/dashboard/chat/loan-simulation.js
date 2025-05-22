"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { sendSimulation } from "@/app/dashboard/chat/hooks/use-conversations";
import { updateRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

import { dayjs } from "@/lib/dayjs";

const parseCurrency = (value) => {
	// Elimina cualquier carácter que no sea número
	return Number(value.replaceAll(/[^0-9]/g, ""));
};

export function LoanSimulation({ contactFound }) {
	const [capital, setCapital] = React.useState(0);
	const [selectedDate, setSelectedDate] = React.useState(dayjs());
	const [days, setDays] = React.useState(0);
	const previewRef = React.useRef();
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
		formData.append("file", blob, "simulacion.png");
		formData.append("clientId", contactFound.id);

		await sendSimulation(formData);
		router.refresh();

		// Actualiza el amount
		// await updateRequest({});
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
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
							<QRCodeSVG value="https://microimpulso.lernasoft.net" size={73} />
						</Box>
					</Grid>
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
						md: 12,
						xs: 12,
					}}
				>
					<DatePicker
						sx={{ width: "100%" }}
						label="Días para pagar"
						value={selectedDate}
						onChange={handleDateChange}
						minDate={dayjs()}
					/>
				</Grid>
				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<Button
						variant="contained"
						disabled={capital === 0 || dayjs(selectedDate).isSame(dayjs(), "day")}
						onClick={handleSend}
					>
						Enviar Simulación al Cliente
					</Button>
				</Grid>
			</Grid>
		</Stack>
	);
}
