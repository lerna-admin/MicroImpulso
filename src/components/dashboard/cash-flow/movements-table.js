"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

dayjs.locale("es");

const columns = [
	{ field: "id", name: "ID", width: "150px" },
	{
		formatter: (row) => {
			const mapping = {
				COBRO_CLIENTE: { label: "Cobro", color: "success" },
				"PRESTAMO ADMINISTRADOR": { label: "Prestamo administrador", color: "error" },
				ENTRADA_GERENCIA: { label: "Entra caja", color: "success" },
				GASTO_PROVEEDOR: { label: "Gastos", color: "error" },
				TRANSFERENCIA: { label: "Transferencia", color: "info" },
			};
			const { label, color } = mapping[row.category] ?? { label: "Unknown", color: "secondary" };

			return <Chip color={color} label={label} size="small" variant="soft" />;
		},
		name: "Categoria",
		width: "150px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.amount
			);
		},
		name: "Monto",
		width: "150px",
	},
	{
		formatter: (row) => {
			return dayjs(row.createdAt).utc().format("D MMMM YYYY").toUpperCase();
		},
		name: "Fecha de creación",
		width: "150px",
	},
	{
		formatter: (row) => (
			<div>
				<Typography color="text.secondary" variant="body2">
					{row.origen.name}
				</Typography>
			</div>
		),
		name: "Origen",
		width: "150px",
	},
	{
		formatter: (row) => (
			<div>
				<Typography color="text.secondary" variant="body2">
					{row.destino.name}
				</Typography>
			</div>
		),
		name: "Destino",
		width: "150px",
	},
	{
		formatter: (row) => (
			<div>
				<Typography color="text.secondary" variant="body2">
					{row.description}
				</Typography>
			</div>
		),
		name: "Description",
		width: "250px",
	},
];

export function MovementsTable({ movementsData, filters }) {
	const { limit, date } = filters;
	const [selectedDate, setSelectedDate] = React.useState(dayjs(date));
	const [search, setSearch] = React.useState("");

	const router = useRouter();

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.date) {
				searchParams.set("date", newFilters.date);
			}
			if (newFilters.page) {
				searchParams.set("page", newFilters.page);
			}
			if (newFilters.limit) {
				searchParams.set("limit", newFilters.limit);
			}
			if (newFilters.search) {
				searchParams.set("search", newFilters.search);
			}

			router.push(`${paths.dashboard.cash_flow}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleFilterChange = React.useCallback(
		(value) => {
			setSelectedDate(value);
			setSearch("");
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, page: 1, limit: limit, date: dateFormatted });
		},
		[updateSearchParams, filters]
	);

	const handleSearch = (event) => {
		setSearch(event.target.value);
	};

	return (
		<React.Fragment>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", p: 3 }}>
				<OutlinedInput
					placeholder="Buscar movimientos por descripción"
					startAdornment={
						<InputAdornment position="start">
							<MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
						</InputAdornment>
					}
					value={search}
					onChange={handleSearch}
					sx={{ flex: "1 1 auto" }}
					onKeyDown={(e) => {
						if (e.key !== "Enter") return;
						updateSearchParams({
							...filters,
							search: search,
							page: 1,
							limit: limit,
							date: dayjs(selectedDate).format("YYYY-MM-DD"),
						});
					}}
				/>
				<DatePicker name="movementDate" value={selectedDate} onChange={handleFilterChange} />
			</Stack>
			<Divider />
			<DataTable columns={columns} rows={movementsData} />
			{movementsData.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No se encontraron movimientos de caja.
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}
