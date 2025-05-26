"use client";

import * as React from "react";
import { Box, Chip, Divider, Grid2, Tooltip } from "@mui/material";
import {
	CalendarDots as CalendarDotsIcon,
	Money as MoneyIcon,
	ReceiptX as ReceiptXIcon,
	ThumbsDown as ThumbsDownIcon,
	UserCircle as UserCircleIcon,
	Warning as WarningIcon,
} from "@phosphor-icons/react/dist/ssr";

function totalToPayAllCustomers(array) {
	const total = array.reduce((sum, { totalToPay }) => sum + totalToPay, 0);
	return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(total);
}

function totalCustomers(array) {
	return array.filter(({ status }) => status.toUpperCase() === "ACTIVE").length;
}

function totalMoraGreatherThanFifteen(array) {
	return array.reduce((sum, { diasMora }) => sum + (diasMora > 15 ? 1 : 0), 0);
}

function totalCreditsRejected(array) {
	return array.reduce((sum, { loanRequest: { status } }) => sum + (status === "rejected" ? 1 : 0), 0);
}

function totalNoPayments(array) {
	return array.filter(({ loanRequest: { transactions } }) => transactions.Transactiontype === "repayment").length;
}

const handleClick = () => {
	console.info("You clicked the Chip.");
};

export function CustomerStatistics({ customers }) {
	const [filterButtonsAndStatistics, setFilterButtonsAndStatistics] = React.useState([
		{ id: 1, action: false, label: "NP:", icon: <ThumbsDownIcon />, value: "0" },
		{ id: 2, action: false, label: "M > 15:", icon: <WarningIcon />, value: "0" },
		{ id: 3, action: false, label: "CR:", icon: <ReceiptXIcon />, value: "0" },
		{ id: 4, action: false, label: "", icon: <UserCircleIcon />, value: "" },
		{ id: 5, action: false, label: "", icon: <MoneyIcon />, value: "" },
		{ divider: true },
		{ id: 6, action: true, label: "Bisemanal", icon: <CalendarDotsIcon />, value: "" },
		{ id: 7, action: true, label: "5-20", icon: <CalendarDotsIcon />, value: "" },
		{ id: 8, action: true, label: "10-25", icon: <CalendarDotsIcon />, value: "" },
		{ id: 9, action: true, label: "15-30", icon: <CalendarDotsIcon />, value: "" },
	]);

	const updateValuesByIcons = (id, nuevoValor) => {
		setFilterButtonsAndStatistics((prev) =>
			prev.map((item) => (item.id === id ? { ...item, value: nuevoValor } : item))
		);
	};

	React.useEffect(() => {
		updateValuesByIcons(5, totalToPayAllCustomers(customers));
		updateValuesByIcons(4, totalCustomers(customers));
		updateValuesByIcons(2, totalMoraGreatherThanFifteen(customers));
		updateValuesByIcons(3, totalCreditsRejected(customers));
		updateValuesByIcons(1, totalNoPayments(customers));
	}, [customers]);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Grid2 container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="center">
				{filterButtonsAndStatistics.map((item, index) => {
					if (item.divider) {
						return <Divider key={index} orientation="vertical" flexItem sx={{ mx: 2, borderColor: "grey" }} />;
					}
					const { label, value, icon, action } = item;
					return (
						<Grid2 key={index} size={"auto"}>
							<Tooltip title={value}>
								<Chip
									icon={icon}
									label={label !== "Users" || label !== "Money" ? `${label} ${value}`.trim() : ""}
									variant="outlined"
									size="small"
									onClick={action ? handleClick : undefined}
									sx={{
										fontSize: "0.75rem",
										px: 1,
										height: 32,
										maxWidth: 110,
										whiteSpace: "nowrap",
									}}
								/>
							</Tooltip>
						</Grid2>
					);
				})}
			</Grid2>
		</Box>
	);
}
