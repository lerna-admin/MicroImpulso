"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatedClassificationDocumentById } from "@/app/dashboard/documents/hooks/use-documents";
import { Card, CardHeader, Chip, Divider, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FloppyDisk, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";
import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function DocumentsModal({ open, customer, documents }) {
	const columns = [
		{
			formatter: (row) => {
				return (
					<Typography suppressHydrationWarning sx={{ whiteSpace: "nowrap" }} variant="inherit">
						{dayjs(row.createdAt).format("MM/D/YYYY, hh:mm A")}
					</Typography>
				);
			},
			name: "Fecha de carga",
			width: "250px",
			align: "left",
		},
		{
			formatter(row) {
				return (
					<Link target="_blank" href={paths.dashboard.documents.details(row.id)} variant="subtitle2">
						File
					</Link>
				);
			},
			name: "URL",
			width: "150px",
		},
		{
			formatter(row) {
				const mapping = {
					ID: { label: "Cedula" },
					WORK_LETTER: { label: "Carta laboral" },
					UTILITY_BILL: { label: "Recibo" },
					PAYMENT_DETAIL: { label: "Desprendible de pago" },
					OTHER: { label: "Otro" },
				};

				const { label } = mapping[row.classification] ?? { label: "Unknown" };
				return editRowId === row.id ? (
					<Select value={editedValue} onChange={(e) => setEditedValue(e.target.value)} size="small">
						<MenuItem value="ID">Cedula</MenuItem>
						<MenuItem value="WORK_LETTER">Carta laboral</MenuItem>
						<MenuItem value="UTILITY_BILL">Recibo</MenuItem>
						<MenuItem value="PAYMENT_DETAIL">Desprendible de pago</MenuItem>
						<MenuItem value="OTHER">Otro</MenuItem>
					</Select>
				) : (
					<Chip label={label} size="medium" variant="outlined" />
				);
			},
			name: "Clasificación",
			width: "150px",
		},
		{
			formatter: (row) =>
				editRowId === row.id ? (
					<IconButton onClick={() => handleSaveClick(row.id)}>
						<FloppyDisk />
					</IconButton>
				) : (
					<IconButton onClick={() => handleEditClick(row)}>
						<PencilSimple />
					</IconButton>
				),
			name: "Actions",
			hideName: true,
			width: "100px",
			align: "right",
		},
	];

	const router = useRouter();
	const [rows, setRows] = React.useState(documents);
	const [editRowId, setEditRowId] = React.useState(null);
	const [editedValue, setEditedValue] = React.useState("");
	const [openAlert, setOpenAlert] = React.useState(false);

	const handleClose = React.useCallback(() => {
		router.push(paths.dashboard.chat.base);
	}, [router]);

	const handleEditClick = (row) => {
		setEditRowId(row.id);
		setEditedValue(row.classification);
	};

	const handleSaveClick = async (id) => {
		const updatedRows = rows.map((row) => (row.id === id ? { ...row, classification: editedValue } : row));
		setRows(updatedRows);
		setEditRowId(null);

		const response = await updatedClassificationDocumentById({ classification: editedValue }, id);

		if (response.status == 200) setOpenAlert(true);
	};

	return (
		<Dialog
			maxWidth="lg"
			onClose={handleClose}
			open={open}
			sx={{
				"& .MuiDialog-container": { justifyContent: "center" },
				"& .MuiDialog-paper": { height: "80%", width: "100%" },
			}}
		>
			<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 5, minHeight: 0 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "0 0 auto", p: 1 }}>
					<Typography sx={{ flex: "1 1 auto" }} variant="h5">
						Documentos
					</Typography>
					<IconButton onClick={handleClose}>
						<XIcon />
					</IconButton>
				</Stack>

				<Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Card>
							<CardHeader title="Cliente" />
							<Divider />
							<PropertyList divider={<Divider />} sx={{ "--PropertyItem-padding": "16px 24px" }}>
								{[
									{ key: "Nombre completo", value: customer?.name },
									{ key: "Tipo documento", value: customer?.documentType },
									{ key: "Documento", value: customer?.document },
									{ key: "Dirección", value: customer?.address },
									{ key: "Correo", value: customer?.email },
									{ key: "Celular", value: customer?.phone },
								].map((item) => (
									<PropertyItem key={item.key} name={item.key} value={item.value} />
								))}
							</PropertyList>
						</Card>
					</Grid>
					<Grid
						size={{
							md: 8,
							xs: 12,
						}}
					>
						<Card>
							<CardHeader title="Listado de documentos" />
							<Divider />
							<Box sx={{ overflowX: "auto" }}>
								<DataTable columns={columns} rows={rows} />
								{rows.length === 0 ? (
									<Box sx={{ p: 3 }}>
										<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
											No se encontraron documentos
										</Typography>
									</Box>
								) : null}
							</Box>
						</Card>
					</Grid>
					<NotificationAlert
						openAlert={openAlert}
						onClose={() => setOpenAlert(false)}
						msg={"Clasificación actualizada!"}
						autoHideDuration={2000}
						posHorizontal={"right"}
						posVertical={"bottom"}
					></NotificationAlert>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}
