"use client";

import * as React from "react";
import { ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { Document, Font, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { dayjs } from "@/lib/dayjs";

dayjs.locale("es");

Font.register({
	family: "Roboto",
	src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf",
});

export function ExportComponent({ balance, reports }) {
	const options = ["Excel", "PDF"];

	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
	const [selectedIndex, setSelectedIndex] = React.useState(1);

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		setOpen(false);
	};

	const handleClick = async () => {
		// Cuando son balances de ruta
		if (balance) {
			const assetsFormatted = balance.map((item) => {
				const key = item.name.split(" ")[0].toLowerCase();
				return { ...item, key };
			});

			if (selectedIndex === 0) exportExcelBalance(assetsFormatted);

			if (selectedIndex === 1) {
				const blob = await pdf(<MyDocumentBalance headers={assetsFormatted} />).toBlob();
				const today = dayjs();
				saveAs(
					blob,
					`cuadre_de_ruta_${today.format("DD")}_${today.format("MMMM").toLowerCase()}_${today.format("YYYY")}.pdf`
				);
			}
		} else {
			if (selectedIndex === 0) exportExcel(reports);

			if (selectedIndex === 1) {
				const blob = await pdf(<MyDocument report={reports} />).toBlob();
				const today = dayjs();
				saveAs(
					blob,
					`${reports.reportName.replaceAll(/\s+/g, "_").toLowerCase()}_${today.format("DD")}_${today.format("MMMM").toLowerCase()}_${today.format("YYYY")}.pdf`
				);
			}
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
		<Stack direction="row" spacing={2} alignItems={"center"}>
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
			<Popper sx={{ zIndex: 1 }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
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
	);
}

export const MyDocument = ({ report }) => {
	// Encabezados desde las keys de la primera fila de detalle
	const headers = Object.keys(report.detailRowsToExport[0]);

	// Totales
	const totalsKeys = Object.keys(report.totalsRowToExport);
	const totalsValues = Object.values(report.totalsRowToExport);

	const columnCount = headers.length;
	const colWidth = `${100 / columnCount}%`;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<Text style={styles.title}>{report.reportName}</Text>

				{/* Tabla de detalle */}
				<View style={styles.table}>
					{/* Encabezados */}
					<View style={styles.tableRow}>
						{headers.map((h) => (
							<Text key={h} style={[styles.tableCol, { width: colWidth }, styles.tableHeader]}>
								{h.replaceAll("_", " ").replaceAll(/\b\w/g, (c) => c.toUpperCase())}
							</Text>
						))}
					</View>

					{/* Filas */}
					{report.detailRowsToExport.map((row, idx) => (
						<View style={styles.tableRow} key={idx}>
							{Object.values(row).map((val, i) => (
								<Text key={i} style={[styles.tableCol, { width: colWidth }]}>
									{String(val)}
								</Text>
							))}
						</View>
					))}
				</View>

				{/* Totales */}
				<View style={[styles.table, styles.totals]}>
					<View style={styles.tableRow}>
						<Text style={[styles.tableCol, { width: colWidth }, styles.tableHeader]}>Totales</Text>
						{totalsKeys.map((h) => (
							<Text key={h} style={[styles.tableCol, { width: colWidth }, styles.tableHeader]}>
								{h.replaceAll("_", " ").replaceAll(/\b\w/g, (c) => c.toUpperCase())}
							</Text>
						))}
					</View>
					<View style={styles.tableRow}>
						<Text style={[styles.tableCol, { width: colWidth }]}></Text>
						{totalsValues.map((val, i) => (
							<Text key={i} style={[styles.tableCol, { width: colWidth }]}>
								{String(val)}
							</Text>
						))}
					</View>
				</View>
			</Page>
		</Document>
	);
};

export const MyDocumentBalance = ({ headers }) => (
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

const exportExcel = async (data) => {
	const today = dayjs();
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet(data.reportName);

	//  Título
	const totalColumns = Object.keys(data.detailRowsToExport[0]).length;
	sheet.mergeCells(1, 1, 1, totalColumns);
	const titleCell = sheet.getCell(1, 1);
	titleCell.value = data.reportName;
	titleCell.alignment = { vertical: "middle", horizontal: "center" };
	titleCell.font = { bold: true, size: 16 };

	//  Encabezados (fila 2)
	const headers = Object.keys(data.detailRowsToExport[0]);
	const headerRow = sheet.getRow(2);
	headerRow.values = headers.map((h) =>
		// convertir snake_case en texto más legible
		h.replaceAll("_", " ").replaceAll(/\b\w/g, (c) => c.toUpperCase())
	);
	headerRow.font = { bold: true };
	headerRow.alignment = { vertical: "middle", horizontal: "center" };

	//  Filas de detalle (a partir de fila 3)
	for (const row of data.detailRowsToExport) {
		sheet.addRow(Object.values(row));
	}

	//  Espacio + Totales
	sheet.addRow([]);
	const totalsKeys = ["Totales", ...Object.keys(data.totalsRowToExport)];
	const totalsValues = ["", ...Object.values(data.totalsRowToExport)];

	// fila de encabezados de totales
	const totalsHeaderRow = sheet.addRow(
		totalsKeys.map((h) => h.replaceAll("_", " ").replaceAll(/\b\w/g, (c) => c.toUpperCase()))
	);
	totalsHeaderRow.font = { bold: true };
	totalsHeaderRow.alignment = { vertical: "middle", horizontal: "center" };

	// fila con valores de totales
	const totalsRow = sheet.addRow(totalsValues);
	totalsRow.font = { bold: true };

	//  Ajustar ancho columnas automáticamente
	for (const col of sheet.columns) {
		let maxLength = 0;
		col.eachCell({ includeEmpty: true }, (cell) => {
			const len = cell.value ? cell.value.toString().length : 10;
			if (len > maxLength) maxLength = len;
		});
		col.width = Math.max(maxLength, 15);
	}

	//  Exportar archivo
	const buffer = await workbook.xlsx.writeBuffer();
	saveAs(
		new Blob([buffer]),
		`${data.reportName.replaceAll(/\s+/g, "_").toLowerCase()}_${today.format("DD")}_${today
			.format("MMMM")
			.toLowerCase()}_${today.format("YYYY")}.xlsx`
	);
};

const exportExcelBalance = async (headers) => {
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
		width: "25%",
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
