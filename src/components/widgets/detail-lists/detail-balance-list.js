"use client";

import * as React from "react";
import { CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";

dayjs.locale("es");

export function DetailBalanceList({ data }) {
	const [assets, setAssets] = React.useState([
		{ id: 1, name: "Cartera ($)", value: "" },
		{ id: 2, name: "Cobrado ($)", value: "" },
		{ id: 3, name: "Clientes (#)", value: "" },
		{ id: 4, name: "Renovados $ (#)", value: "" },
		{ id: 5, name: "Nuevos $ (#)", value: "" },
	]);

	React.useEffect(() => {
		const updates = [
			{ id: 1, value: parseCurrency(data.cartera) },
			{ id: 2, value: parseCurrency(data.cobrado) },
			{ id: 3, value: data.clientes },
			{ id: 4, value: `${parseCurrency(data.valorRenovados)} (${data.renovados})` },
			{ id: 5, value: `${parseCurrency(data.valorNuevos)} (${data.nuevos})` },
		];
		setAssets((prev) =>
			prev.map((item) => {
				const update = updates.find((u) => u.id === item.id);
				return update ? { ...item, value: update.value } : item;
			})
		);
	}, [data]);

	const totalAmount = data.valorRenovados + data.valorNuevos;
	const totalRequests = data.renovados + data.nuevos;

	const today = dayjs();
	const formattedDate = `${today.format("DD")} ${today.format("MMMM").toUpperCase()} ${today.format("YYYY, hh:mm A")}`;

	const popover = usePopover();

	const handleRoadClousure = async () => {
		popover.handleClose();
		console.log("handleRoadClousure");
	};

	return (
		<Card variant="outlined">
			<CardHeader
				titleTypographyProps={{ variant: "h5" }}
				title={"Balance de la ruta"}
				action={
					<Button size="xs" variant="contained" onClick={popover.handleOpen}>
						Cierre
					</Button>
				}
			/>
			<Divider />
			<Box sx={{ bgcolor: "var(--mui-palette-background-level1)", p: 3 }}>
				<Container maxWidth="sm">
					<Card>
						<CardContent>
							<Stack divider={<Divider />} spacing={2}>
								<Box display={"flex"} justifyContent={"space-between"} padding={1}>
									<Typography color="text.secondary" variant="h6">
										Cuadre de ruta
									</Typography>
									<Typography color="text.secondary" variant="caption">
										{formattedDate}
									</Typography>
								</Box>
								<Stack spacing={2}>
									<List disablePadding>
										{assets.map((asset) => (
											<ListItem disableGutters key={asset.id} sx={{ py: 1.5 }}>
												<Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: "1 1 auto" }}>
													<Typography variant="subtitle2">{asset.name}</Typography>
												</Stack>
												<Typography color="text.secondary" variant="subtitle2">
													{asset.value}
												</Typography>
											</ListItem>
										))}
									</List>
								</Stack>

								<div>
									<Typography variant="overline">{`Total $ (#)`}</Typography>
									<Typography variant="h5">
										{new Intl.NumberFormat("es-CO", {
											currency: "COP",
											minimumFractionDigits: 0,
										}).format(totalAmount) + ` (${totalRequests})`}
									</Typography>
								</div>
							</Stack>
						</CardContent>
					</Card>
				</Container>
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
							{`Una vez realice el cierre no podra hacer más transacciones ni modificar el estado de las solicitudes. ¿Desea continuar?`}
						</DialogContentText>
					</DialogContent>
					<DialogActions sx={{ padding: 3 }}>
						<Button variant="contained" onClick={handleRoadClousure} autoFocus>
							Aceptar
						</Button>
						<Button variant="outlined" onClick={popover.handleClose}>
							Cancelar
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Card>
	);
}

const parseCurrency = (value) => {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	}).format(value);
};
