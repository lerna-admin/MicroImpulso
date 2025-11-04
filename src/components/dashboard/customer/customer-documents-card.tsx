"use client";

import * as React from "react";
import {
	Box,
	Card,
	CardHeader,
	CardContent,
	Divider,
	Stack,
	Typography,
	Button,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	CircularProgress,
} from "@mui/material";

// Las opciones válidas según DocumentType del backend
const CATEGORY_OPTIONS = [
	{ value: "ID", label: "Identificación" },
	{ value: "WORK_LETTER", label: "Carta Laboral" },
	{ value: "UTILITY_BILL", label: "Factura" },
	{ value: "OTHER", label: "Otro" },
	{ value: "PAYMENT_DETAIL", label: "Desprendible de Pago" },
];

// GET documentos del cliente
async function fetchCustomerDocuments(customerId) {
	const res = await fetch(`/api/documents/client/${customerId}`, {
		method: "GET",
	});
	if (!res.ok) {
		throw new Error("No se pudieron cargar los documentos");
	}
	return res.json();
}

// PATCH clasificación del documento existente
async function updateDocumentClassification(documentId, classification) {
	const res = await fetch(`/api/documents/${documentId}/`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		// 🔴 antes mandábamos { category }, esto el backend no lo entiende
		// ✅ ahora mandamos { classification }
		body: JSON.stringify({ classification }),
	});
	if (!res.ok) {
		throw new Error("No se pudo actualizar la categoría");
	}
	return res.json();
}

// POST subir nuevo documento
async function uploadDocument({ file, classification, customerId }) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("classification", classification); // <-- clave correcta
	formData.append("customerId", customerId);

	const res = await fetch(`/api/documents`, {
		method: "POST",
		body: formData,
	});

	if (!res.ok) {
		throw new Error("No se pudo subir el documento");
	}

	return res.json();
}

export default function CustomerDocumentsCard({ customerId }) {
	const [docs, setDocs] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	// estado del formulario de subida
	const [file, setFile] = React.useState<File | null>(null);

	// 🔴 antes newCategory
	// ✅ ahora newClassification (valor inicial OTHER)
	const [newClassification, setNewClassification] = React.useState("OTHER");

	const [uploading, setUploading] = React.useState(false);

	// documento que estamos actualizando (para deshabilitar su select)
	const [updatingDocId, setUpdatingDocId] = React.useState<string | null>(null);

	// carga inicial
	React.useEffect(() => {
		let active = true;
		(async () => {
			try {
				setLoading(true);
				const data = await fetchCustomerDocuments(customerId);
				if (active) {
					// esperamos que el backend responda algo tipo:
					// { documents: [{ id, classification, createdAt, ...}, ...] }
					setDocs(data.documents || []);
					setError(null);
				}
			} catch (err) {
				if (active) {
					setError("Error cargando documentos");
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		})();
		return () => {
			active = false;
		};
	}, [customerId]);

	// cambiar clasificación de un doc existente
	const handleChangeClassification = async (docId: string, nextClassification: string) => {
		try {
			setUpdatingDocId(docId);

			const updated = await updateDocumentClassification(docId, nextClassification);

			// el backend puede devolver el doc completo o solo { classification: '...' }
			const resolvedClassification = updated.classification ?? nextClassification;

			// actualizamos la lista local
			setDocs((prev) =>
				prev.map((d) =>
					d.id === docId
						? {
							...d,
							classification: resolvedClassification,
						}
						: d,
				),
			);
		} catch (err) {
			console.error(err);
			// aquí podrías disparar un snackbar/toast
		} finally {
			setUpdatingDocId(null);
		}
	};

	// subir archivo nuevo
	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		try {
			setUploading(true);

			const created = await uploadDocument({
				file,
				classification: newClassification,
				customerId,
			});

			// 🔧 si backend devuelve { success: true, document: {...} }
			// tomamos el doc correcto:
			const createdDoc = created.document ?? created;

			// 🔧 reforzamos que tenga la clasificación seleccionada
			const docWithClassification = {
				...createdDoc,
				classification: createdDoc.classification ?? newClassification,
			};

			setFile(null);
			setNewClassification("OTHER");

			// 🔧 añadimos el documento ya corregido al inicio
			setDocs((prev) => [docWithClassification, ...prev]);
		} catch (err) {
			console.error(err);
		} finally {
			setUploading(false);
		}
	};


	return (
		<Card sx={{ borderRadius: 1 }} variant="outlined">
			{/* ===== SUBIR DOCUMENTO ===== */}
			<CardHeader
				titleTypographyProps={{ variant: "subtitle1" }}
				title="Subir nuevo documento"
				subheader="Adjunta archivo y define la categoría antes de guardar"
			/>

			<CardContent>
				<Box
					component="form"
					onSubmit={handleUpload}
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						gap: 2,
						alignItems: { xs: "stretch", md: "flex-end" },
						flexWrap: "wrap",
					}}
				>
					<Box sx={{ flex: 1, minWidth: 240 }}>
						<Button
							variant="outlined"
							component="label"
							fullWidth
							sx={{ height: 56, justifyContent: "space-between" }}
						>
							<span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
								{file ? file.name : "Seleccionar archivo..."}
							</span>
							<input
								type="file"
								hidden
								onChange={(ev) => {
									const f = ev.target.files?.[0];
									if (f) {
										setFile(f);
									}
								}}
							/>
						</Button>
					</Box>

					<FormControl sx={{ minWidth: 200 }}>
						<InputLabel id="new-doc-classification-label">Categoría</InputLabel>
						<Select
							labelId="new-doc-classification-label"
							label="Categoría"
							value={newClassification}
							onChange={(e) => setNewClassification(e.target.value)}
						>
							{CATEGORY_OPTIONS.map((opt) => (
								<MenuItem key={opt.value} value={opt.value}>
									{opt.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Box sx={{ minWidth: 140 }}>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={uploading}
							sx={{ height: 56 }}
						>
							{uploading ? "Subiendo..." : "Subir"}
						</Button>
					</Box>
				</Box>
			</CardContent>

			<Divider />

			{/* ===== LISTA DE DOCUMENTOS ===== */}
			<CardContent>
				<Stack spacing={2}>
					<Typography variant="subtitle1">Documentos existentes</Typography>

					{loading ? (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<CircularProgress size={20} />
							<Typography variant="body2">Cargando documentos…</Typography>
						</Box>
					) : error ? (
						<Typography variant="body2" color="error">
							{error}
						</Typography>
					) : docs.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							Este cliente aún no tiene documentos.
						</Typography>
					) : (
						<Box sx={{ overflowX: "auto" }}>
							<Table size="small" sx={{ minWidth: 600 }}>
								<TableHead>
									<TableRow>
										<TableCell>Categoría</TableCell>
										<TableCell>Fecha de cargue</TableCell>
										<TableCell>Acciones</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{docs.map((doc) => (
										<TableRow key={doc.id} hover>
											<TableCell sx={{ minWidth: 180 }}>
												<FormControl fullWidth size="small">
													<Select
														// 🔴 antes: value={doc.category}
														// ✅ ahora usamos classification
														value={doc.classification || "OTHER"}
														onChange={(e) => {
															const nextClass = e.target.value;
															handleChangeClassification(doc.id, nextClass);
														}}
														disabled={updatingDocId === doc.id}
													>
														{CATEGORY_OPTIONS.map((opt) => (
															<MenuItem key={opt.value} value={opt.value}>
																{opt.label}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</TableCell>

											<TableCell sx={{ whiteSpace: "nowrap" }}>
												{doc.createdAt
													? new Date(doc.createdAt).toLocaleDateString("es-CO", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})
													: "—"}
											</TableCell>

											<TableCell>
												<Button
													size="small"
													variant="text"
													component="a"
													href={`/api/documents/${doc.id}/file`}
													target="_blank"
													rel="noopener noreferrer"
												>
													Abrir
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}
