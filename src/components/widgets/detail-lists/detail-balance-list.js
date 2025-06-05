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

const assets = [
	{ name: "Cartera ($)", value: 21_500 },
	{ name: "Cobrado ($)", value: 15_300 },
	{ name: "Clientes (#)", value: 2076 },
	{ name: "Renovados $ (#)", value: 2076 },
	{ name: "Nuevos $ (#)", value: 2076 },
];

export function DetailBalanceList() {
	const totalAmount = assets.reduce((acc, asset) => {
		return acc + asset.value;
	}, 0);

	const totalRequests = 10;

	const today = dayjs();
	const formattedDate = `${today.format("DD")} ${today.format("MMMM").toUpperCase()} ${today.format("YYYY, hh:mm A")}`;

	const popover = usePopover();

	const handleRoadClousure = () => {
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
						<CardHeader
							subheader={
								<Box display={"flex"} justifyContent={"space-between"}>
									<Typography color="text.secondary" variant="h6">
										Cuadre de ruta
									</Typography>
									<Typography color="text.secondary" variant="caption">
										{formattedDate}
									</Typography>
								</Box>
							}
						></CardHeader>
						<CardContent>
							<Stack divider={<Divider />} spacing={2}>
								<Stack spacing={2}>
									<List disablePadding>
										{assets.map((asset) => (
											<ListItem disableGutters key={asset.name} sx={{ py: 1.5 }}>
												<Stack direction="row" spacing={1} sx={{ alignItems: "center", flex: "1 1 auto" }}>
													<Typography variant="subtitle2">{asset.name}</Typography>
												</Stack>
												<Typography color="text.secondary" variant="subtitle2">
													{new Intl.NumberFormat("es-CO", {
														currency: "COP",
														minimumFractionDigits: 0,
													}).format(asset.value)}
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
