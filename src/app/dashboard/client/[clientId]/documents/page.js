// O si es server component:

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { InvoicesTable } from "@/components/dashboard/invoice/invoices-table";
import { InvoicesPagination } from "@/components/dashboard/invoice/invoices-pagination";
import { InvoicesFiltersCard } from "@/components/dashboard/invoice/invoices-filters-card";
import { InvoicesFiltersButton } from "@/components/dashboard/invoice/invoices-filters-button";
import { InvoicesSort } from "@/components/dashboard/invoice/invoices-sort";
import { InvoicesStats } from "@/components/dashboard/invoice/invoices-stats";
import { ViewModeButton } from "@/components/dashboard/invoice/view-mode-button";
import { dayjs } from "@/lib/dayjs";

export default async function Page({ params }) { 
    const clientId = params.clientId 


  // Simulación, reemplaza esto con un fetch a tu backend para traer documentos de ese clientId
  const invoices = getInvoicesByClientId(clientId); // Debes implementarlo

  const filters = {}; // Ajusta si usarás filtros
  const sortedInvoices = applySort(invoices, "desc");
  const filteredInvoices = applyFilters(sortedInvoices, filters);

  return (
    <Box sx={{ maxWidth: "var(--Content-maxWidth)", m: "var(--Content-margin)", p: "var(--Content-padding)", width: "var(--Content-width)" }}>
      <Stack spacing={4}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
          <Box sx={{ flex: "1 1 auto" }}>
            <Typography variant="h4">Documents for Client {clientId}</Typography>
          </Box>
          <Button startIcon={<PlusIcon />} variant="contained">New</Button>
        </Stack>
        <InvoicesStats />
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
          <InvoicesFiltersButton filters={filters} sortDir="desc" view="list" />
          <InvoicesSort filters={filters} sortDir="desc" view="list" />
          <ViewModeButton view="list" />
        </Stack>
        <Stack direction="row" spacing={4} sx={{ alignItems: "flex-start" }}>
          <InvoicesFiltersCard filters={filters} sortDir="desc" view="list" />
          <Stack spacing={4} sx={{ flex: "1 1 auto", minWidth: 0 }}>
            <InvoicesTable rows={filteredInvoices} view="list" />
            <InvoicesPagination count={filteredInvoices.length} page={0} />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

// Simulación
function getInvoicesByClientId(clientId) {
  // Reemplaza esto con una llamada real a tu backend con fetch/axios/swr
  return [
    { id: "INV-001", customer: { name: `Client ${clientId}` }, currency: "USD", totalAmount: 100, status: "pending", issueDate: dayjs().toDate(), dueDate: dayjs().add(5, "day").toDate() },
    // ...
  ];
}

function applySort(rows, sortDir) {
  return rows.sort((a, b) => {
    if (sortDir === "asc") return a.issueDate.getTime() - b.issueDate.getTime();
    return b.issueDate.getTime() - a.issueDate.getTime();
  });
}

function applyFilters(rows, filters) {
  return rows; // Implementa lógica si usas filtros
}
