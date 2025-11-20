"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { closeDay, getDailyTraceDetailed } from "@/app/dashboard/balance/hooks/use-balance";
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
import { DatePicker } from "@mui/x-date-pickers";
import { FileArrowDown as FileArrowDownIcon } from "@phosphor-icons/react/dist/ssr";
import Cookies from "js-cookie";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { ExportComponent } from "@/components/dashboard/export/export-component.js";

import { NotificationAlert } from "../../widgets/notifications/notification-alert";

dayjs.locale("es");

export function DetailBalanceList({ dataBalance, traceData, user, filters }) {
	const { date } = filters;
	const kpis = dataBalance ?? {};
	const resolvedTransfersIn = kpis.transferEntrante ?? traceData?.kpis?.transferEntrante ?? 0;
	const resolvedTransfersOut = kpis.transferSaliente ?? traceData?.kpis?.transferSaliente ?? 0;
	const resolvedNuevos = kpis.clientesNuevos ?? traceData?.kpis?.clientesNuevos ?? { cantidad: 0, montoPrestado: 0 };
	const resolvedRenovados =
		kpis.clientesRenovados ?? traceData?.kpis?.clientesRenovados ?? { cantidad: 0, montoPrestado: 0 };

	const [assets, setAssets] = React.useState([
		{ id: 2, name: "Cartera ($)", value: "" },
		{ id: 1, name: "Base anterior ($)", value: "" },
		{ id: 3, name: "Cobrado ($)", value: "" },
		{ id: 4, name: "Clientes (#)", value: "" },
		{ id: 5, name: "Renovados $ (#)", value: "" },
		{ id: 6, name: "Nuevos $ (#)", value: "" },
		{ id: 7, name: "Transferencias Entrantes $", value: "" },
		{ id: 8, name: "Transferencias Salientes $", value: "" },
		
	]);

	const [selectedDate, setSelectedDate] = React.useState(dayjs(date));

	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");

	const fallbackTotal =
		(kpis.baseAnterior ?? 0) +
		(kpis.valorCobradoDia ?? 0) -
		(resolvedNuevos?.montoPrestado ?? 0) -
		(resolvedRenovados?.montoPrestado ?? 0) +
		resolvedTransfersIn -
		resolvedTransfersOut;

	const totalAmount = traceData?.totalFinal ?? fallbackTotal;

	const today = dayjs(date);
	const formattedDate = `${today.format("DD")} ${today.format("MMMM").toUpperCase()} ${today.format("YYYY")}`;

	const popover = usePopover();
	const router = useRouter();

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.date) {
				searchParams.set("date", newFilters.date);
			}

			router.push(`${paths.dashboard.balance}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleFilterChange = React.useCallback(
		(value) => {
			setSelectedDate(value);

			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, date: dateFormatted });
		},
		[filters, updateSearchParams]
	);

	React.useEffect(() => {
		const updates = [
			{ id: 2, value: parseCurrency(kpis.valorEnCartera ?? 0) },
			{ id: 1, value: parseCurrency(kpis.baseAnterior ?? 0) },
			{ id: 3, value: parseCurrency(kpis.valorCobradoDia ?? 0) },
			{ id: 4, value: kpis.clientesEnDeuda ?? traceData?.kpis?.clientesEnDeuda ?? 0 },
			{
				id: 5,
				value: `${parseCurrency(resolvedRenovados?.montoPrestado ?? 0)} (${resolvedRenovados?.cantidad ?? 0})`,
			},
			{
				id: 6,
				value: `${parseCurrency(resolvedNuevos?.montoPrestado ?? 0)} (${resolvedNuevos?.cantidad ?? 0})`,
			},
			{ id: 7, value: parseCurrency(resolvedTransfersIn || 0) },
			{ id: 8, value: parseCurrency(resolvedTransfersOut || 0) },
		];
		setAssets((prev) =>
			prev.map((item) => {
				const update = updates.find((u) => u.id === item.id);
				return update ? { ...item, value: update.value } : item;
			})
		);
	}, [kpis, resolvedRenovados, resolvedNuevos, resolvedTransfersIn, resolvedTransfersOut, traceData]);
	
	const handleRoadClousure = async () => {
		popover.handleClose();
		try {
			await closeDay(user.id);
			setAlertMsg("¡Se ha cerrado el dia exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			popoverAlert.handleOpen();
			Cookies.set("isAgentClosed", true);
		}
	};

	const handleDownloadDetail = async () => {
		let urlSeteada = "";
		try {
			const { url } = await getDailyTraceDetailed(user.id, selectedDate.format("YYYY-MM-DD"));
			urlSeteada = url;
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			window.open(urlSeteada, "_blank", "noopener, noreferrer");
		}
	};

	return (
		<Card variant="outlined">
			<CardHeader
				titleTypographyProps={{ variant: "h5" }}
				title={"Balance de la ruta"}
				action={
					<Stack direction="row" spacing={2}>
						<DatePicker name="movementDate" value={selectedDate} onChange={handleFilterChange} />
						<ExportComponent balance={assets} />
						<Button size="xs" variant="contained" onClick={popover.handleOpen}>
							Cierre
						</Button>
					</Stack>
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
									<Stack spacing={2} flex flexDirection={"row"} justifyContent={"space-between"}>
										<Typography variant="h5" alignSelf={"center"}>
											{parseCurrency(totalAmount)}
										</Typography>

										<Button
											size="xs"
											variant="contained"
											onClick={handleDownloadDetail}
											startIcon={<FileArrowDownIcon />}
										>
											Descargar Detalle
										</Button>
									</Stack>
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
			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
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
