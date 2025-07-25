import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { DocumentsUploadedByClient } from "@/components/dashboard/reports/documents-uploaded-by-client/documents-uploaded-by-client";

export const metadata = { title: `Documentos Subidos por Cliente | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate, docType } = await searchParams;
	const {
		data: { user },
	} = await getUser();

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<DocumentsUploadedByClient filters={{ startDate, endDate, docType }} user={user} />
		</Box>
	);
}
