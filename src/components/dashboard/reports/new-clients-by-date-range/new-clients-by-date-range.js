"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, Card, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

const columns = [
	{ field: "id", name: "ID", width: "50px" },
	{
		formatter: (row) => (
			<Typography variant="body2" color="initial">
				{row.clientName}
			</Typography>
		),
		name: "Nombre cliente",
		width: "100px",
	},
	{
		formatter(row) {
			return dayjs(row.createdAt).format("MMM D, YYYY");
		},
		name: "Fecha creación",
		width: "100px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.amount ?? 0
			);
		},
		name: "Monto",
		width: "100px",
	},
	{
		formatter: (row) => (
			<Typography variant="body2" color="initial">
				{row.branch}
			</Typography>
		),
		name: "Sede",
		width: "100px",
	},
];

export function NewClientsByDateRange({ filters, rows }) {
	const { startDate, endDate } = filters;
	const router = useRouter();

	const [selectedStartDate, setSelectedStartDate] = React.useState(dayjs(startDate));
	const [selectedEndDate, setSelectedEndDate] = React.useState(dayjs(endDate));

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.startDate) {
				searchParams.set("startDate", newFilters.startDate);
			}
			if (newFilters.endDate) {
				searchParams.set("endDate", newFilters.endDate);
			}

			router.push(`${paths.dashboard.reports.newClientsByDateRange}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleFilterStartDateChange = React.useCallback(
		(value) => {
			setSelectedStartDate(value);
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, startDate: dateFormatted });
		},
		[updateSearchParams, filters]
	);

	const handleFilterEndDateChange = React.useCallback(
		(value) => {
			setSelectedEndDate(value);
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, endDate: dateFormatted });
		},
		[updateSearchParams, filters]
	);

	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
				<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
					Clientes Nuevos por Rango de Fechas
				</Typography>
				<DatePicker
					label="Fecha inicio:"
					sx={{ flexGrow: 1, maxWidth: "170px" }}
					name="startDate"
					value={selectedStartDate}
					onChange={handleFilterStartDateChange}
				/>

				<DatePicker
					label="Fecha final:"
					sx={{ flexGrow: 1, maxWidth: "170px" }}
					name="endDate"
					value={selectedEndDate}
					onChange={handleFilterEndDateChange}
				/>
			</Stack>
			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<DataTable columns={columns} rows={rows} />
					{rows.length === 0 ? (
						<Box sx={{ p: 3 }}>
							<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
								No se encontraron clientes
							</Typography>
						</Box>
					) : null}
				</Box>
			</Card>
		</Stack>
	);
}
