"use client";

import * as React from "react";
import { closeDay } from "@/app/dashboard/balance/hooks/use-balance";
import {
	ButtonGroup,
	CardHeader,
	ClickAwayListener,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grow,
	MenuItem,
	MenuList,
	Paper,
	Popper,
} from "@mui/material";
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
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { Document, Font, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";

import { NotificationAlert } from "../notifications/notification-alert";

Font.register({
	family: "Roboto",
	src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf",
});

dayjs.locale("es");

const styles = StyleSheet.create({
	page: {
		padding: 30,
		fontSize: 12,
		fontFamily: "Roboto",
	},
	title: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 20,
		fontWeight: "bold",
	},
	table: {
		display: "table",
		width: "auto",
		borderStyle: "solid",
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
	tableRow: {
		flexDirection: "row",
	},
	tableCol: {
		width: "20%",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		padding: 5,
		textAlign: "center",
	},
	tableHeader: {
		fontSize: 12,
		fontWeight: "bold",
		backgroundColor: "#f0f0f0",
	},
});

export const MyDocument = ({ headers }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.title}>Cuadre de ruta</Text>

			<View style={styles.table}>
				{/* Encabezados */}
				<View style={styles.tableRow}>
					{headers.map((h) => (
						<Text style={[styles.tableCol, styles.tableHeader]} key={h.id}>
							{h.name}
						</Text>
					))}
				</View>

				{/* Valores */}
				<View style={styles.tableRow}>
					{headers.map((h) => (
						<Text style={styles.tableCol} key={h.id}>
							{String(h.value)}
						</Text>
					))}
				</View>
			</View>
		</Page>
	</Document>
);

export function DetailBalanceList({ dataBalance, user }) {
	const [assets, setAssets] = React.useState([
		{ id: 1, name: "Cartera ($)", value: "" },
		{ id: 2, name: "Cobrado ($)", value: "" },
		{ id: 3, name: "Clientes (#)", value: "" },
		{ id: 4, name: "Renovados $ (#)", value: "" },
		{ id: 5, name: "Nuevos $ (#)", value: "" },
	]);

	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");

	const totalAmount = dataBalance.valorRenovados + dataBalance.valorNuevos;
	const totalRequests = dataBalance.renovados + dataBalance.nuevos;

	const today = dayjs();
	const formattedDate = `${today.format("DD")} ${today.format("MMMM").toUpperCase()} ${today.format("YYYY, hh:mm A")}`;

	const popover = usePopover();

	const options = ["Excel", "PDF"];

	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
	const [selectedIndex, setSelectedIndex] = React.useState(1);

	React.useEffect(() => {
		const updates = [
			{ id: 1, value: parseCurrency(dataBalance.cartera) },
			{ id: 2, value: parseCurrency(dataBalance.cobrado) },
			{ id: 3, value: dataBalance.clientes },
			{ id: 4, value: `${parseCurrency(dataBalance.valorRenovados)} (${dataBalance.renovados})` },
			{ id: 5, value: `${parseCurrency(dataBalance.valorNuevos)} (${dataBalance.nuevos})` },
		];
		setAssets((prev) =>
			prev.map((item) => {
				const update = updates.find((u) => u.id === item.id);
				return update ? { ...item, value: update.value } : item;
			})
		);
	}, [dataBalance]);

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

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		setOpen(false);
	};

	const handleClick = async () => {
		const assetsFormatted = assets.map((item) => {
			const key = item.name.split(" ")[0].toLowerCase();
			return { ...item, key };
		});

		if (selectedIndex === 0) exportExcel(assetsFormatted);

		if (selectedIndex === 1) {
			const blob = await pdf(<MyDocument headers={assetsFormatted} />).toBlob();
			const today = dayjs();
			saveAs(
				blob,
				`cuadre_de_ruta_${today.format("DD")}_${today.format("MMMM").toLowerCase()}_${today.format("YYYY")}.pdf`
			);
		}
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	return (
		<Card variant="outlined">
			<CardHeader
				titleTypographyProps={{ variant: "h5" }}
				title={"Balance de la ruta"}
				action={
					<Stack direction="row" spacing={2}>
						<Stack direction="row" spacing={2} alignItems={"center"}>
							<Typography variant="body1" color="initial">
								Exportar:{" "}
							</Typography>
							<ButtonGroup variant="contained" ref={anchorRef} aria-label="Button group with a nested menu">
								<Button onClick={handleClick}>{options[selectedIndex]}</Button>
								<Button
									size="small"
									aria-controls={open ? "split-button-menu" : undefined}
									aria-expanded={open ? "true" : undefined}
									aria-label="select merge strategy"
									aria-haspopup="menu"
									onClick={handleToggle}
								>
									<ArrowDropDownIcon />
								</Button>
							</ButtonGroup>
							<Popper
								sx={{ zIndex: 1 }}
								open={open}
								anchorEl={anchorRef.current}
								role={undefined}
								transition
								disablePortal
							>
								{({ TransitionProps, placement }) => (
									<Grow
										{...TransitionProps}
										style={{
											transformOrigin: placement === "bottom" ? "center top" : "center bottom",
										}}
									>
										<Paper>
											<ClickAwayListener onClickAway={handleClose}>
												<MenuList id="split-button-menu" autoFocusItem>
													{options.map((option, index) => (
														<MenuItem
															key={option}
															selected={index === selectedIndex}
															onClick={(event) => handleMenuItemClick(event, index)}
															sx={{ margin: "0.5rem" }}
														>
															{option}
														</MenuItem>
													))}
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</Stack>
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
			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</Card>
	);
}

const exportExcel = async (headers) => {
	const today = dayjs();
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Cuadre de ruta");

	const totalColumns = headers.length;

	sheet.mergeCells(1, 1, 1, totalColumns);
	const titleCell = sheet.getCell(1, 1);
	titleCell.value = "Cuadre de ruta";
	titleCell.alignment = { vertical: "middle", horizontal: "center" };
	titleCell.font = { bold: true, size: 16 };

	const headerRow = sheet.getRow(2);
	headerRow.values = headers.map((h) => h.name);
	headerRow.font = { bold: true };
	headerRow.alignment = { vertical: "middle", horizontal: "center" };

	const valuesRow = sheet.getRow(3);
	valuesRow.values = headers.map((h) => h.value);

	// eslint-disable-next-line unicorn/no-array-for-each
	headers.forEach((h, i) => {
		sheet.getColumn(i + 1).width = 20;
	});

	// Exportar archivo
	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(
		new Blob([buffer]),
		`cuadre_de_ruta_${today.format("DD")}_${today.format("MMMM").toLowerCase()}_${today.format("YYYY")}.xlsx`
	);
};

const parseCurrency = (value) => {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	}).format(value);
};
