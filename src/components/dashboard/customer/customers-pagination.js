"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TablePagination from "@mui/material/TablePagination";

import { paths } from "@/paths";

export function CustomersPagination({ filters, customerTotalItems, customersPage, customerLimit }) {
	const { status } = filters;
	const router = useRouter();
	const [row, setRow] = React.useState(Number(customerLimit) || 5);
	const [page, setPage] = React.useState(Number(customersPage) || 0);

	React.useEffect(() => {
		setPage(0);
	}, [customerTotalItems]);

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.status && newFilters.status !== "all") {
				searchParams.set("status", newFilters.status);
			}
			if (newFilters.page) {
				searchParams.set("page", newFilters.page);
			}
			if (newFilters.limit) {
				searchParams.set("limit", newFilters.limit);
			}
			if (newFilters.type) {
				searchParams.set("type", newFilters.type);
			}
			if (newFilters.paymentDay) {
				searchParams.set("paymentDay", newFilters.paymentDay);
			}
			if (newFilters.branch) {
				searchParams.set("branch", newFilters.branch);
			}
			if (newFilters.agent) {
				searchParams.set("agent", newFilters.agent);
			}
			if (newFilters.mora) {
				searchParams.set("mora", newFilters.mora);
			}
			if (newFilters.name) {
				searchParams.set("name", newFilters.name);
			}

			router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleRowsPerPageChange = React.useCallback(
		({ target }) => {
			const newLimit = target.value;
			const newPage = 1;
			setRow(newLimit);
			setPage(newPage - 1);
			const normalizedStatus = status && status !== "all" ? status : undefined;
			updateSearchParams({ ...filters, status: normalizedStatus, page: newPage, limit: newLimit });
		},
		[updateSearchParams, filters]
	);

	const handlePageChange = React.useCallback(
		(event, newPage) => {
			setPage(newPage);
			const normalizedStatus = status && status !== "all" ? status : undefined;
			updateSearchParams({
				...filters,
				status: normalizedStatus,
				page: (newPage + 1).toString(),
				limit: row.toString(),
			});
		},
		[updateSearchParams, filters]
	);

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
