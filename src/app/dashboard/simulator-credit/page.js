"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { appConfig } from "@/config/app";

export default function Page() {
  const [capital, setCapital] = React.useState(150000);
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
      .catch((err) => console.error("Failed to load API routes:", err));
  }, []);

  React.useEffect(() => {
    if (!apiUrl) return;
    fetch("/auth/profile")
      .then((res) => res.json())
      .then((data) => {
        setAgentId(data.user.id);
      })
      .catch((err) => console.error("Failed to load agent profile:", err));
  }, [apiUrl]);

  React.useEffect(() => {
    if (!apiUrl || !agentId) return;
    fetch(`${apiUrl}/loan-request/agent/${agentId}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((req) => req.status === "under_review")
          .map((req) => req.client);
        const uniqueClients = Array.from(new Map(filtered.map(c => [c.id, c])).values());
        setClients(uniqueClients);
      })
      .catch((err) => console.error("Error loading clients:", err))
      .finally(() => setLoading(false));
  }, [apiUrl, agentId]);

  const handleSend = async () => {
    if (!previewRef.current || !apiUrl || !selectedClient) return;
    const canvas = await html2canvas(previewRef.current);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    const formData = new FormData();
    formData.append("file", blob, "simulation.png");
    formData.append("clientId", selectedClient);

    await fetch(`${apiUrl}/chat/send-simulation`, {
      method: "POST",
      body: formData,
    });
  };

  return (
    <Stack spacing={4} sx={{ minWidth: "1000px", mx: "auto", mt: 4}}>
      <Typography variant="h4">Simulador de crédito</Typography>
      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
        {/* Formulario */}
        <Stack spacing={2} sx={{ width: "50%" }}>
          <TextField
            label="Monto Solicitado"
            variant="outlined"
            type="number"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            fullWidth
          />

          <TextField
            label="Días para pagar"
            variant="outlined"
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            fullWidth
          />

          <FormControl fullWidth disabled={loading || clients.length === 0}>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={selectedClient}
              label="Cliente"
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
            {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            disabled={!selectedClient}
            onClick={handleSend}
          >
            Enviar Simulación al Cliente
          </Button>
        </Stack>

        {/* Vista Previa */}
        <Paper elevation={3} sx={{ p: 3, width: "50%" }} ref={previewRef}>
          <Stack spacing={2}>
            <Typography variant="h5">Simulador de crédito</Typography>
            <Typography><strong>Capital:</strong> ${capital.toLocaleString()}</Typography>
            <Typography><strong>Tasa E.A:</strong> 26.1%</Typography>
            <Typography><strong>Tasa E.D:</strong> {(ED * 100).toFixed(6)}%</Typography>
            <Typography><strong>Días para pagar:</strong> {days} días</Typography>
            <Typography><strong>Interés:</strong> ${interest.toLocaleString()}</Typography>
            <Typography><strong>Aval:</strong> ${aval.toLocaleString()}</Typography>
            <Typography><strong>Total a pagar:</strong> ${totalToPay.toLocaleString()}</Typography>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <QRCodeSVG value="https://microimpulso.lernasoft.net" size={96} />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
