import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DynamicLogo } from "@/components/core/logo";
import { InvoicePDFLink } from "@/components/dashboard/invoice/invoice-pdf-link";
import { LineItemsTable } from "@/components/dashboard/invoice/line-items-table";
export const metadata = { title: `Details | Invoices | Dashboard | ${appConfig.name}` };
import PdfViewer from "@/components/dashboard/documents/pdf-viewer";
const lineItems = [
	{ id: "LI-001", name: "Pro Subscription", quantity: 1, currency: "USD", unitAmount: 14.99, totalAmount: 14.99 },
];

export default function Page() {
	const documentId = "c05fb9c0-129e-4ff1-aaa1-2804f75f9737"; // dinámico si quieres desde ruta, props, etc.
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
							href={paths.dashboard.invoices.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Invoices
						</Link>
					</div>
					<Stack direction="row" spacing={3} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
						<Stack spacing={1}>
							<Typography variant="h4">INV-001</Typography>
							<div>
								<Chip color="warning" label="Pending" variant="soft" />
							</div>
						</Stack>
						<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
							
							<Button component="a" href={paths.pdf.invoice("1")} target="_blank" variant="contained">
								Preview
							</Button>
						</Stack>
					</Stack>
				</Stack>
				<Card sx={{ p: 2 }}>
					<PdfViewer documentId="c05fb9c0-129e-4ff1-aaa1-2804f75f9737" />;
				</Card>
			</Stack>
		</Box>
	);
}
