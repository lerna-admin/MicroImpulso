"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TablePagination from "@mui/material/TablePagination";

import { paths } from "@/paths";

export function MovementsPagination({ filters, movementsTotalItems, movementsPage, movementLimit }) {
	const router = useRouter();
	const [row, setRow] = React.useState(Number(movementLimit) || 5);
	const [page, setPage] = React.useState(Number(movementsPage) || 0);

	React.useEffect(() => {
		setPage(0);
	}, [movementsTotalItems]);

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

	const handleRowsPerPageChange = React.useCallback(
		({ target }) => {
			const newLimit = target.value;
			const newPage = 1;
			setRow(newLimit);
			setPage(newPage - 1);
			updateSearchParams({ ...filters, page: newPage, limit: newLimit });
		},
		[updateSearchParams, filters]
	);

	const handlePageChange = React.useCallback(
		(event, newPage) => {
			setPage(newPage);
			updateSearchParams({ ...filters, page: (newPage + 1).toString(), limit: row.toString() });
		},
		[updateSearchParams, filters]
	);

	return (
		<TablePagination
			component="div"
			count={movementsTotalItems}
			page={page}
			onPageChange={handlePageChange}
			onRowsPerPageChange={handleRowsPerPageChange}
			rowsPerPage={row}
			rowsPerPageOptions={[5, 10, 25, 50]}
			labelRowsPerPage={"Filas"}
		/>
	);
}
