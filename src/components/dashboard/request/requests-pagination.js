"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TablePagination from "@mui/material/TablePagination";

import { paths } from "@/paths";

export function RequestsPagination({ filters, requestTotalItems, requestsPage, requestLimit }) {
	const { status } = filters;
	const router = useRouter();
	const [row, setRow] = React.useState(Number(requestLimit) || 5);
	const [page, setPage] = React.useState(Number(requestsPage) || 0);

	React.useEffect(() => {
		setPage(0);
	}, [requestTotalItems]);

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.status) {
				searchParams.set("status", newFilters.status);
			}
			if (newFilters.page) {
				searchParams.set("page", newFilters.page);
			}
			if (newFilters.limit) {
				searchParams.set("limit", newFilters.limit);
			}

			router.push(`${paths.dashboard.requests.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleRowsPerPageChange = React.useCallback(
		({ target }) => {
			const newLimit = target.value;
			const newPage = 1;
			setRow(newLimit);
			setPage(newPage - 1);
			updateSearchParams({ ...filters, status: status || "", page: newPage, limit: newLimit });
		},
		[updateSearchParams, filters]
	);

	const handlePageChange = React.useCallback(
		(event, newPage) => {
			setPage(newPage);
			updateSearchParams({ ...filters, status: status || "", page: (newPage + 1).toString(), limit: row.toString() });
		},
		[updateSearchParams, filters]
	);
	return (
		<TablePagination
			component="div"
			count={requestTotalItems}
			page={page}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
			rowsPerPage={row}
			rowsPerPageOptions={[5, 10, 25, 50]}
			labelRowsPerPage={"Filas"}
		/>
	);
}
