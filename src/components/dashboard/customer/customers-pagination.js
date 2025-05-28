"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TablePagination from "@mui/material/TablePagination";

import { paths } from "@/paths";

export function CustomersPagination({ filters, customerTotalItems, customersPage, customerLimit }) {
	const { status } = filters;
	const router = useRouter();
	const [row, setRow] = React.useState(customerLimit || 5);
	const [page, setPage] = React.useState(customersPage - 1 || 0);

	React.useEffect(() => {
		setPage(0);
	}, [customerTotalItems]);

	const handleRowsPerPageChange = ({ target }) => {
		const newLimit = target.value;
		setRow(newLimit);
		const searchParams = new URLSearchParams();
		searchParams.set("status", status || "");
		searchParams.set("page", 1);
		searchParams.set("limit", newLimit);
		router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
		const searchParams = new URLSearchParams();
		searchParams.set("status", status || "");
		searchParams.set("page", (newPage + 1).toString());
		searchParams.set("limit", row.toString());
		router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
	};

	return (
		<TablePagination
			component="div"
			count={customerTotalItems}
			page={page}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
			rowsPerPage={row}
			rowsPerPageOptions={[5, 10, 25, 50]}
			labelRowsPerPage={"Filas"}
		/>
	);
}
