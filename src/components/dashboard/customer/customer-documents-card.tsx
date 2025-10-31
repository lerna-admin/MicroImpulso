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

// 🔁 centraliza las categorías permitidas.
// idealmente esto debería venir del backend algún día.


const CATEGORY_OPTIONS = [
	
	{ value: "ID", label: "Identificación" },
	{ value: "WORK_LETTER", label: "Carta Laboral" },
	{ value: "UTILITY_BILL", label: "Factura" },
	{ value: "OTHER", label: "Otro" },
	{ value: "PAYMENT_DETAIL", label: "Desprendible de Pago" }
];

async function fetchCustomerDocuments(customerId) {
	const res = await fetch(`/api/documents/client/${customerId}`, {
		method: "GET",
	});
	if (!res.ok) {
		throw new Error("No se pudieron cargar los documentos");
	}
	return res.json();
}

async function updateDocumentCategory(documentId, category) {
	const res = await fetch(`/api/documents/${documentId}/`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ category }),
	});
	if (!res.ok) {
		throw new Error("No se pudo actualizar la categoría");
	}
	return res.json();
}

// placeholder para subida de archivo
async function uploadDocument({ file, category, customerId }) {
	// Esto supone que tu backend va a aceptar multipart/form-data.
	// Si luego cambias a S3 presigned URL, acá es donde se ajusta.
	const formData = new FormData();
	formData.append("file", file);
	formData.append("category", category);
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

	// upload form state
	const [file, setFile] = React.useState<File | null>(null);
	const [newCategory, setNewCategory] = React.useState("OTHER");
	const [uploading, setUploading] = React.useState(false);

	// track per-row category while user changes it
	const [updatingDocId, setUpdatingDocId] = React.useState<string | null>(null);

	// initial load
	React.useEffect(() => {
		let active = true;
		(async () => {
			try {
				setLoading(true);
				const data = await fetchCustomerDocuments(customerId);
				if (active) {
					setDocs(data.documents);
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

	// handle category change for existing doc
	const handleChangeCategory = async (docId: string, category: string) => {
		try {
			setUpdatingDocId(docId);
			const updated = await updateDocumentCategory(docId, category);

			// actualiza en memoria
			setDocs((prev) =>
				prev.map((d) => (d.id === docId ? { ...d, category: updated.category ?? category } : d)),
			);
		} catch (err) {
			console.error(err);
			// opcional: toast/snackbar
		} finally {
			setUpdatingDocId(null);
		}
	};

	// handle file upload submit
	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) {
			// opcional: toast/snackbar
			return;
		}
		try {
			setUploading(true);
			const created = await uploadDocument({
				file,
				category: newCategory,
				customerId,
			});

			// Limpia el form y agrega el doc recién creado
			setFile(null);
			setNewCategory("OTHER");
			setDocs((prev) => [created, ...prev]);
		} catch (err) {
			console.error(err);
			// opcional: toast/snackbar
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
						<InputLabel id="new-doc-category-label">Categoría</InputLabel>
						<Select
							labelId="new-doc-category-label"
							label="Categoría"
							value={newCategory}
							onChange={(e) => setNewCategory(e.target.value)}
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
														value={doc.category || "OTHER"}
														onChange={(e) => {
															const nextCat = e.target.value;
															handleChangeCategory(doc.id, nextCat);
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
												{/* formateo rápido de fecha */}
												{doc.createdAt
													? new Date(doc.createdAt).toLocaleDateString("es-CO", {
															year: "numeric",
															month: "short",
															day: "numeric",
													  })
													: "—"}
											</TableCell>

											<TableCell>
												{/* Descargar / Ver */}
												<Button
													size="small"
													variant="text"
													component="a"
													href={'/api/documents/'+doc.id+'/file'}
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
