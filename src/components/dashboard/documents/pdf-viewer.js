"use client";

import * as React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { parseUrlFile } from "@/app/dashboard/documents/hooks/use-documents";

export default function PdfViewer({ documentId }) {
	const layoutPluginInstance = defaultLayoutPlugin();

	const fileUrl = parseUrlFile(documentId);

	if (!fileUrl) return <p>Cargando PDF...</p>;

	return (
		<div style={{ height: "700px", width: "80%" }}>
			<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
				<Viewer fileUrl={fileUrl} plugins={[layoutPluginInstance]} />
			</Worker>
		</div>
	);
}
