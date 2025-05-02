"use client";

import * as React from "react";

import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

const columns = [
	{
		formatter: (row) => {
			return dayjs(row.creditDate).format("MMM D, YYYY h:mm A");
		},
		name: "Fecha credito",
		width: "160px",
	},
	{
		formatter: (row) => {
			return dayjs(row.expirationDate).format("MMM D, YYYY h:mm A");
		},
		name: "Fecha vencimiento",
		width: "160px",
	},
	{
		formatter: (row) => {
			return dayjs(row.paymentDate).format("MMM D, YYYY h:mm A");
		},
		name: "Fecha pago",
		width: "160px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: row.currency }).format(row.payment);
		},
		name: "Abono",
		width: "120px",
	},
];

export function LineItemsTable({ rows }) {
	return <DataTable columns={columns} rows={rows} />;
}
