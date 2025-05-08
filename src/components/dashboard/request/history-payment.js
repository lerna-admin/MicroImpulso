"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { ShoppingCartSimple as ShoppingCartSimpleIcon } from "@phosphor-icons/react/dist/ssr/ShoppingCartSimple";

import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

const columns = [
	{
		formatter: (row) => (
			<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
				{dayjs(row.createdAt).format("MMM D, YYYY hh:mm A")}
			</Typography>
		),
		name: "Fecha",
		align: "start",
	},
	{
		formatter: (row) => (
			<Typography sx={{ whiteSpace: "nowrap" }} variant="subtitle2">
				{new Intl.NumberFormat("en-US", { style: "currency", currency: row.currency }).format(row.amount)}
			</Typography>
		),
		name: "Monto",
		width: "200px",
	},
	{
		formatter: (row) => {
			const mapping = {
				pending: { label: "Pendiente", color: "warning" },
				completed: { label: "Completado", color: "success" },
				canceled: { label: "Cancelado", color: "error" },
			};
			const { label, color } = mapping[row.status] ?? { label: "Unknown", color: "secondary" };

			return <Chip color={color} label={label} size="small" variant="soft" />;
		},
		name: "Estado",
		width: "200px",
	},
];

export function HistoryPayments({ totalPagado, payments = [], totalPrestado, cuotas }) {
	return (
		<Card>
			<CardHeader
				action={
					<Button color="secondary" startIcon={<PlusIcon />}>
						Crear Pago
					</Button>
				}
				avatar={
					<Avatar>
						<ShoppingCartSimpleIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				title="Historial de Pagos"
			/>
			<CardContent>
				<Stack spacing={3}>
					<Card sx={{ borderRadius: 1 }} variant="outlined">
						<Stack
							direction="row"
							divider={<Divider flexItem orientation="vertical" />}
							spacing={3}
							sx={{ justifyContent: "space-between", p: 2 }}
						>
							<div>
								<Typography color="text.secondary" variant="overline">
									Cuotas
								</Typography>
								<Typography variant="h6">{new Intl.NumberFormat("en-US").format(cuotas)}</Typography>
							</div>
							<div>
								<Typography color="text.secondary" variant="overline">
									Total Pagado
								</Typography>
								<Typography variant="h6">
									{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPagado)}
								</Typography>
							</div>
							<div>
								<Typography color="text.secondary" variant="overline">
									Total Prestado
								</Typography>
								<Typography variant="h6">
									{new Intl.NumberFormat("en-US", { style: "currency", currency: "COP" }).format(totalPrestado)}
								</Typography>
							</div>
						</Stack>
					</Card>
					<Card sx={{ borderRadius: 1 }} variant="outlined">
						<Box sx={{ overflowX: "auto" }}>
							<DataTable columns={columns} rows={payments} />
						</Box>
					</Card>
				</Stack>
			</CardContent>
		</Card>
	);
}
