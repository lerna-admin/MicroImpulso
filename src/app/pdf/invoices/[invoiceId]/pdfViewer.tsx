"use client";

import { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfViewerProps {
	documentId: string;
}

export default function PdfViewer({ documentId }: PdfViewerProps) {
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const layoutPluginInstance = defaultLayoutPlugin();

	useEffect(() => {
		fetch("/dashboard/api/routes")
			.then((res) => res.json())
			.then((config) => {
				if (config.NODE_ENV) {
					const base = config.apiUrl?.startsWith("http") ? config.apiUrl : `https://${config.apiUrl}`;
					setFileUrl(`${base}/documents/${documentId}/file`);
				} else {
					const base = config.apiUrl?.startsWith("http") ? config.apiUrl : `http://${config.apiUrl}`;
					setFileUrl(`${base}/documents/${documentId}/file`);
				}
			})
			.catch((err) => console.error("Failed to load API config:", err));
	}, [documentId]);

	if (!fileUrl) return <p>Loading PDF...</p>;

	return (
		<div style={{ height: "800px", width: "100%" }}>
			<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
				<Viewer fileUrl={fileUrl} plugins={[layoutPluginInstance]} />
			</Worker>
		</div>
	);
}
