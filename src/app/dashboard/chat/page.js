import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { DocumentsModal } from "@/components/dashboard/chat/documents-modal";

import { getCustomerById } from "../customers/hooks/use-customers";
import { getDocumentsByClientId } from "../documents/hooks/use-documents";

export const metadata = { title: `Chat | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { previewId } = await searchParams;

	if (!previewId) return;
	const { client } = await getCustomerById(previewId);
	const { documents } = await getDocumentsByClientId(previewId);

	return (
		<React.Fragment>
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					flex: "1 1 auto",
					flexDirection: "column",
					justifyContent: "center",
					overflowY: "auto",
					p: 3,
				}}
			>
				<Stack spacing={2} sx={{ alignItems: "center" }}>
					<Box component="img" src="/assets/not-found.svg" sx={{ height: "auto", maxWidth: "100%", width: "120px" }} />
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="subtitle1">
						Inicia una conversación!
					</Typography>
				</Stack>
			</Box>
			<DocumentsModal open={Boolean(previewId)} customer={client} documents={documents} />
		</React.Fragment>
	);
}
