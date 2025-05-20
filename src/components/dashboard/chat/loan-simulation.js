"use client";

import * as React from "react";
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";

export function LoanSimulation() {
	const [capital, setCapital] = React.useState("150000");
	const [days, setDays] = React.useState(8);
	const [selectedClient, setSelectedClient] = React.useState("");
	const [clients, setClients] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [apiUrl, setApiUrl] = React.useState("");
	const [agentId, setAgentId] = React.useState(null);
	const previewRef = React.useRef();

	const EA = 0.261;
	const ED = Math.pow(1 + EA, 1 / 365) - 1;
	const interest = Math.round(capital * ED * days);
	const totalToPay = capital * 1.2;
	const aval = Math.round(totalToPay - capital - interest);

	React.useEffect(() => {
		fetch("/dashboard/api/routes")
			.then((res) => res.json())
			.then((data) => {
				let url = data.apiUrl;
				if (!url.startsWith("http")) url = `http://${url}`;
				setApiUrl(url);
			})
			.catch((error) => console.error("Failed to load API routes:", error));
	}, []);

	React.useEffect(() => {
		if (!apiUrl) return;
		fetch("/auth/profile")
			.then((res) => res.json())
			.then((data) => {
				setAgentId(data.user.id);
			})
			.catch((error) => console.error("Failed to load agent profile:", error));
	}, [apiUrl]);

	React.useEffect(() => {
		if (!apiUrl || !agentId) return;
		fetch(`${apiUrl}/loan-request/agent/${agentId}`)
			.then((res) => res.json())
			.then((data) => {
				const filtered = data.filter((req) => req.status === "under_review").map((req) => req.client);
				const uniqueClients = [...new Map(filtered.map((c) => [c.id, c])).values()];
				setClients(uniqueClients);
			})
			.catch((error) => console.error("Error loading clients:", error))
			.finally(() => setLoading(false));
	}, [apiUrl, agentId]);

	const handleSend = async () => {
		if (!previewRef.current || !apiUrl || !selectedClient) return;
		const canvas = await html2canvas(previewRef.current);
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
		const formData = new FormData();
		formData.append("file", blob, "simulation.png");
		formData.append("clientId", selectedClient);

		await fetch(`${apiUrl}/chat/send-simulation`, {
			method: "POST",
			body: formData,
		});
	};
	return (
		<Stack spacing={4}>
			<Typography variant="h5">Simulador de crédito</Typography>

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
						type="number"
						value={capital}
						onChange={(e) => setCapital(Number(e.target.value))}
						fullWidth
					/>
				</Grid>

				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<TextField
						label="Días para pagar"
						variant="outlined"
						type="number"
						value={days}
						onChange={(e) => setDays(Number(e.target.value))}
						fullWidth
					/>
				</Grid>

				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<FormControl fullWidth disabled={loading || clients.length === 0}>
						<InputLabel>Cliente</InputLabel>
						<Select value={selectedClient} label="Cliente" onChange={(e) => setSelectedClient(e.target.value)}>
							{clients.map((client) => (
								<MenuItem key={client.id} value={client.id}>
									{client.name}
								</MenuItem>
							))}
						</Select>
						{loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
					</FormControl>
				</Grid>

				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<Button variant="contained" disabled={!selectedClient} onClick={handleSend}>
						Enviar Simulación al Cliente
					</Button>
				</Grid>
			</Grid>

			{/* Vista Previa */}
			<Grid container spacing={3} ref={previewRef} sx={{ p: 2 }}>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Typography>
						<strong>Capital:</strong> ${capital.toLocaleString()}
					</Typography>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Typography>
						<strong>Tasa E.A:</strong> 26.1%
					</Typography>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Typography>
						<strong>Tasa E.D:</strong> {(ED * 100).toFixed(6)}%
					</Typography>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Typography>
						<strong>Días para pagar:</strong> {days} días
					</Typography>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Typography>
						<strong>Interés:</strong> ${interest.toLocaleString()}
					</Typography>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Typography>
						<strong>Aval:</strong> ${aval.toLocaleString()}
					</Typography>
				</Grid>
				<Grid
					size={{
						md: 6,
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
					<Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
						<QRCodeSVG value="https://microimpulso.lernasoft.net" size={73} />
					</Box>
				</Grid>
			</Grid>
		</Stack>
	);
}
