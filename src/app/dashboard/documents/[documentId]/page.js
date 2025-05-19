"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import RouterLink from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { paths } from "@/paths";
import PdfViewer from "@/app/pdf/invoices/[invoiceId]/pdfViewer";

export default function Page() {
  const { documentId } = useParams();
  const [clientId, setClientId] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    fetch("/dashboard/api/routes")
      .then((res) => res.json())
      .then((config) => {
        const fullUrl = config.apiUrl.startsWith("http") ? config.apiUrl : `https://${config.apiUrl}`;
        setApiUrl(fullUrl);
      })
      .catch((err) => console.error("Failed to load API config:", err));
  }, []);

  useEffect(() => {
    if (!documentId || !apiUrl) return;

    fetch(`${apiUrl}/documents/${documentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.clientId) setClientId(data.clientId);
        setDocumentData(data);
      })
      .catch((err) => console.error("Failed to fetch document:", err));
  }, [documentId, apiUrl]);

  const backHref = clientId
    ? `/dashboard/client/${clientId}/documents`
    : paths.dashboard.documents.list;

  const isPdf = documentData?.mimeType === "application/pdf";

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
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={backHref}
              sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              Documents
            </Link>
          </div>
          <Stack direction="row" spacing={3} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <Stack spacing={1}>
              <Chip color="warning" label="Pending" variant="soft" />
            </Stack>
          </Stack>
        </Stack>

        <Card sx={{ p: 2, minHeight: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {!documentData ? (
            <p>Loading...</p>
          ) : isPdf ? (
            <PdfViewer documentId={documentId} />
          ) : (
            <img
              src={`${apiUrl}${documentData.url}`}
              alt="Uploaded document"
              style={{ maxWidth: "100%", maxHeight: "700px", objectFit: "contain" }}
            />
          )}
        </Card>
      </Stack>
    </Box>
  );
}
