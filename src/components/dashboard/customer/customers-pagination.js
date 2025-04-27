"use client";

import * as React from "react";
import TablePagination from "@mui/material/TablePagination";

export function CustomersPagination({ count }) {
	// You should implement the pagination using a similar logic as the filters.
	// Note that when page change, you should keep the filter search params.

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(Number.parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TablePagination
			component="div"
			count={count}
			page={page}
			onPageChange={handleChangePage}
			onRowsPerPageChange={handleChangeRowsPerPage}
			rowsPerPage={rowsPerPage}
			labelRowsPerPage={"Filas"}
		/>
	);
}
