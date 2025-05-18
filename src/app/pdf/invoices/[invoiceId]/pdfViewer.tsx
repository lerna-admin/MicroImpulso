"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfViewerProps {
  documentId: string;
}

export default function PdfViewer({ documentId }: PdfViewerProps) {
  const fileUrl = `http://localhost:3100/documents/${documentId}/file`;
  const layoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ height: "800px", width: "100%" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={fileUrl} plugins={[layoutPluginInstance]} />
      </Worker>
    </div>
  );
}
