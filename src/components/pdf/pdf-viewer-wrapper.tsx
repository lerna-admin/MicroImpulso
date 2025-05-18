// src/components/pdf/pdf-viewer-wrapper.tsx
"use client";

import PdfViewer from "@/app/pdf/invoices/[invoiceId]/pdfViewer";

export default function PdfViewerWrapper({ documentId }: { documentId: string }) {
  return <PdfViewer documentId={documentId} />;
}
