import * as React from "react";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { CustomersFilters } from "@/components/dashboard/customer/customers-filters";
import { CustomersPagination } from "@/components/dashboard/customer/customers-pagination";
import { CustomersSelectionProvider } from "@/components/dashboard/customer/customers-selection-context";
import { CustomersTable } from "@/components/dashboard/customer/customers-table";

export const metadata = { title: `Lista | Clientes | Dashboard | ${appConfig.name}` };

const customers = [
	{
		id: "1.034.567.891",
		name: "Fran Perez",
		avatar: "/assets/avatar-5.png",
		email: "fran.perez@domain.com",
		phone: "(815) 704-0045",
		address: "Carrera 12 #45-67",
		status: "active",
		amount_borrowed: "$1.000.000",
		createdAt: dayjs().subtract(1, "hour").toDate(),
	},
	{
		id: "7.892.345.120",
		name: "Penjani Inyene",
		avatar: "/assets/avatar-4.png",
		email: "penjani.inyene@domain.com",
		phone: "(803) 937-8925",
		address: "Calle 8A #34-22",
		status: "active",
		amount_borrowed: "$300.000",
		createdAt: dayjs().subtract(3, "hour").toDate(),
	},
	{
		id: "52.340.678",
		name: "Carson Darrin",
		avatar: "/assets/avatar-3.png",
		email: "carson.darrin@domain.com",
		phone: "(715) 278-5041",
		address: "Transversal 30 #19-10",
		status: "inactive",
		amount_borrowed: "$150.000",
		createdAt: dayjs().subtract(1, "hour").subtract(1, "day").toDate(),
	},
	{
		id: "10.456.789",
		name: "Siegbert Gottfried",
		avatar: "/assets/avatar-2.png",
		email: "siegbert.gottfried@domain.com",
		phone: "(603) 766-0431",
		address: "Carrera 7 #23-45",
		status: "inactive",
		amount_borrowed: "$700.000",
		createdAt: dayjs().subtract(7, "hour").subtract(1, "day").toDate(),
	},
	{
		id: "98.123.456",
		name: "Miron Vitold",
		avatar: "/assets/avatar-1.png",
		email: "miron.vitold@domain.com",
		phone: "(425) 434-5535",
		address: "Calle 14 #8-50",
		status: "active",
		amount_borrowed: "$1.500.000",
		createdAt: dayjs().subtract(2, "hour").subtract(2, "day").toDate(),
	},
];

export default async function Page({ searchParams }) {
	const { email, phone, sortDir, status } = await searchParams;

	const sortedCustomers = applySort(customers, sortDir);
	const filteredCustomers = applyFilters(sortedCustomers, { email, phone, status });

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
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Empleados</Typography>
					</Box>
					{/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button startIcon={<PlusIcon />} variant="contained">
							Add
						</Button>
					</Box> */}
				</Stack>
				<CustomersSelectionProvider customers={filteredCustomers}>
					<Card>
						<CustomersFilters filters={{ email, phone, status }} sortDir={sortDir} />
						<Divider />
						<Box sx={{ overflowX: "auto" }}>
							<CustomersTable rows={filteredCustomers} />
						</Box>
						<Divider />
						<CustomersPagination count={filteredCustomers.length + 100} page={0} />
					</Card>
				</CustomersSelectionProvider>
			</Stack>
		</Box>
	);
}

// Sorting and filtering has to be done on the server.

function applySort(row, sortDir) {
	return row.sort((a, b) => {
		if (sortDir === "asc") {
			return a.createdAt.getTime() - b.createdAt.getTime();
		}

		return b.createdAt.getTime() - a.createdAt.getTime();
	});
}

function applyFilters(row, { email, phone, status }) {
	return row.filter((item) => {
		if (email && !item.email?.toLowerCase().includes(email.toLowerCase())) {
			return false;
		}

		if (phone && !item.phone?.toLowerCase().includes(phone.toLowerCase())) {
			return false;
		}

		if (status && item.status !== status) {
			return false;
		}

		return true;
	});
}
