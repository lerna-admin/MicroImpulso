import * as React from "react";
import PdfViewer from "@/app/pdf/invoices/[invoiceId]/pdfViewer";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { getDocumentById, parseUrl } from "./../hooks/use-documents";

export default async function Page({ params }) {
	const { documentId } = params;
	const { clientId, id, mimeType, url } = await getDocumentById(documentId);

	const urlparse = parseUrl(url);

	const isPdf = mimeType === "application/pdf";

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
							<Chip color="warning" label="Pending" variant="soft" />
						</Stack>
					</Stack>
				</Stack>

				<Card sx={{ p: 2, minHeight: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
					{isPdf ? (
						<PdfViewer documentId={documentId} />
					) : (
						<img
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
