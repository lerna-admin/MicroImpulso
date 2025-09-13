"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles";
import { Box, Card, Chip, FormControl, InputLabel, Select, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";
import { Option } from "@/components/core/option";

import { ExportComponent } from "../../export/export-component";

const columns = [
	{
		formatter: (row) => (
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<div>
					<Typography color="textPrimary" fontWeight={700} variant="body2">
						{row.clientName}
					</Typography>
					<Typography color="text.secondary" fontWeight={300} variant="body2">
						{row.agentName}
					</Typography>
				</div>
			</Stack>
		),
		name: "Cliente - Agente",
		width: "150px",
	},
	{
		formatter(row) {
			return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.amount
			);
		},
		name: "Monto",
		width: "150px",
	},
	{
		formatter(row) {
			return row.branchName;
		},
		name: "Sede",
		width: "100px",
	},
	{
		formatter(row) {
			return dayjs(row.date).format("MMM D, YYYY");
		},
		name: "Fecha",
		width: "150px",
	},
	{
		formatter(row) {
			const mapping = {
				disbursement: { label: "Desembolso", color: "warning" },
				penalty: { label: "Renovación", color: "error" },
				repayment: { label: "Pago", color: "success" },
			};

			const { label, color } = mapping[row.type] ?? { label: "Unknown", color: "secondary" };

			return <Chip color={color} label={label} size="small" variant="soft" />;
		},
		name: "Tipo",
		width: "150px",
	},
];

export function TransactionDetails({ data, user, filters, branches }) {
	const { startDate, endDate } = filters;
	const { role, branchId } = user;

	const router = useRouter();
	const [selectedStartDate, setSelectedStartDate] = React.useState(dayjs(startDate));
	const [selectedEndDate, setSelectedEndDate] = React.useState(dayjs(endDate));
	const [selectedBranch, setSelectedBranch] = React.useState("");

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.startDate) {
				searchParams.set("startDate", newFilters.startDate);
			}
			if (newFilters.endDate) {
				searchParams.set("endDate", newFilters.endDate);
			}
			if (newFilters.branch) {
				searchParams.set("branch", newFilters.branch);
			}

			router.push(`${paths.dashboard.reports.transactionDetails}?${searchParams.toString()}`);
		},
		[router]
	);

	React.useEffect(() => {
		if (branchId && role === ROLES.ADMIN) setSelectedBranch(branchId);
	}, [role, branchId]);

	const handleFilterBranchChange = React.useCallback(
		(e) => {
			const value = e.target.value;
			setSelectedBranch(value);
			updateSearchParams({ ...filters, branch: value });
		},
		[updateSearchParams, filters]
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

	const statusMap = {
		penalty: "Renovación",
		disbursement: "Desembolsado",
		repayment: "Pago",
	};

	const currencyFormatter = new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	});

	const detailRowsToExport = data.map((item) => ({
		Fecha: item.date,
		Cliente: item.clientName,
		Agente: item.agentName,
		Sede: item.branchName,
		Monto: currencyFormatter.format(item.amount),
		Tipo: statusMap[item.type] || item.type,
	}));

	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "end" }}>
				<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
					Detalle de Transacciones
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
				{branches.length === 0 ? null : (
					<FormControl sx={{ maxWidth: "170px", width: "100%" }} disabled={role === ROLES.ADMIN}>
						<InputLabel id="selectedBranch">Sede:</InputLabel>
						<Select labelId="selectedBranch" defaultValue="" value={selectedBranch} onChange={handleFilterBranchChange}>
							{branches.length === 0 ? null : <Option value="">Todas las sedes</Option>}
							{branches.length === 0
								? null
								: branches.map(({ id, name }) => (
										<Option key={id} value={id}>
											{name}
										</Option>
									))}
						</Select>
					</FormControl>
				)}
				{data.length === 0 ? null : (
					<ExportComponent
						reports={{
							reportName: `Detalle de Transacciones`,
							detailRowsToExport,
						}}
					/>
				)}
			</Stack>
			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<DataTable columns={columns} rows={data} />
					{data.length === 0 ? (
						<Box sx={{ p: 3 }}>
							<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
								No se encontraron transacciones.
							</Typography>
						</Box>
					) : null}
				</Box>
			</Card>
		</Stack>
	);
}
