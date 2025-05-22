import * as React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import PdfViewer from "@/components/dashboard/documents/pdf-viewer";

import { getDocumentById, parseUrl } from "./../hooks/use-documents";

export default async function Page({ params }) {
	const { documentId } = await params;
	const { mimeType, url, classification } = await getDocumentById(documentId);

	const urlparse = parseUrl(url);

	const isPdf = mimeType === "application/pdf";

	const mapping = {
		ID: { label: "Cedula" },
		WORK_LETTER: { label: "Carta laboral" },
		UTILITY_BILL: { label: "Recibo" },
		PAYMENT_DETAIL: { label: "Desprendible de pago" },
		OTHER: { label: "Otro" },
	};

	const { label } = mapping[classification] ?? { label: "Unknown" };

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<Stack spacing={3}>
					<Stack direction="row" spacing={3} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
						<Stack spacing={1}>
							<Chip label={label} variant="soft" />
						</Stack>
					</Stack>
				</Stack>

				<Card sx={{ p: 2, minHeight: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
					{isPdf ? (
						<PdfViewer documentId={documentId} />
					) : (
						<Image
							width={900}
							height={900}
							src={urlparse}
							alt="Uploaded document"
							style={{ maxWidth: "100%", maxHeight: "700px", objectFit: "contain" }}
						/>
					)}
				</Card>
			</Stack>
		</Box>
	);
}
