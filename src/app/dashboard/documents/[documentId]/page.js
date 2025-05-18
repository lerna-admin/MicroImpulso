"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RouterLink from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { paths } from "@/paths";
import { DynamicLogo } from "@/components/core/logo";
import { LineItemsTable } from "@/components/dashboard/invoice/line-items-table";
import PdfViewer from "@/app/pdf/invoices/[invoiceId]/pdfViewer";

const lineItems = [
  { id: "LI-001", name: "Pro Subscription", quantity: 1, currency: "USD", unitAmount: 14.99, totalAmount: 14.99 },
];

export default function Page() {
  const { documentId } = useParams();
  const [clientId, setClientId] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);

  useEffect(() => {
    // Fetch the dynamic API URL
    fetch("/api/routes")
      .then((res) => res.json())
      .then((config) => {
        console.log(config)
        setApiUrl(config.apiUrl);
      })
      .catch((err) => console.error("Failed to load API config:", err));
  }, []);

  useEffect(() => {
    if (!documentId || !apiUrl) return;

    fetch(`${apiUrl}/documents/${documentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.clientId) {
          setClientId(data.clientId);
        }
        console.log(data);
      })
      .catch((err) => console.error("Failed to fetch document:", err));
  }, [documentId, apiUrl]);

  const backHref = clientId
    ? `/dashboard/client/${clientId}/documents`
    : paths.dashboard.documents.list;

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
              <div>
                <Chip color="warning" label="Pending" variant="soft" />
              </div>
            </Stack>
          </Stack>
        </Stack>

        <Card sx={{ p: 2 }}>
          <PdfViewer documentId={documentId} />
        </Card>
      </Stack>
    </Box>
  );
}
