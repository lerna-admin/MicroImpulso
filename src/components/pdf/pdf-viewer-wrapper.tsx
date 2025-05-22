// src/components/pdf/pdf-viewer-wrapper.tsx
"use client";

import PdfViewer from "@/components/dashboard/documents/pdf-viewer";

export default function PdfViewerWrapper({ documentId }: { documentId: string }) {
  return <PdfViewer documentId={documentId} />;
}
