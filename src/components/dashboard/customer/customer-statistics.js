"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, Chip, Divider, Grid2, Tooltip } from "@mui/material";
import {
	CalendarDots as CalendarDotsIcon,
	Money as MoneyIcon,
	ReceiptX as ReceiptXIcon,
	ThumbsDown as ThumbsDownIcon,
	UserCircle as UserCircleIcon,
	Warning as WarningIcon,
} from "@phosphor-icons/react/dist/ssr";

import { paths } from "@/paths";

export function CustomerStatistics({ statistics, filters = {} }) {
	const router = useRouter();
	const { limit } = filters;
	const [activeType, setActiveType] = React.useState(null);
	const [activePaymentDay, setActivePaymentDay] = React.useState(null);

	const [filterButtonsAndStatistics, setFilterButtonsAndStatistics] = React.useState([
		{ id: 1, action: false, label: "NP:", icon: <ThumbsDownIcon />, value: "0" },
		{ id: 2, action: false, label: "M > 15:", icon: <WarningIcon />, value: "0" },
		{ id: 3, action: false, label: "CR:", icon: <ReceiptXIcon />, value: "0" },
		{ id: 4, action: false, label: "", icon: <UserCircleIcon />, value: "0" },
		{ id: 5, action: false, label: "", icon: <MoneyIcon />, value: "0" },
		{ divider: true },
		{ id: 6, action: true, label: "Quincenal", icon: <CalendarDotsIcon />, value: "" },
		{ id: 7, action: true, label: "Mensual", icon: <CalendarDotsIcon />, value: "" },
		{ id: 8, action: true, label: "5-20", icon: <CalendarDotsIcon />, value: "" },
		{ id: 9, action: true, label: "10-25", icon: <CalendarDotsIcon />, value: "" },
		{ id: 10, action: true, label: "15-30", icon: <CalendarDotsIcon />, value: "" },
	]);

	React.useEffect(() => {
		const updates = [
			{
				id: 5,
				value: new Intl.NumberFormat("es-CO", {
					style: "currency",
					currency: "COP",
					minimumFractionDigits: 0,
				}).format(statistics.totalActiveAmountBorrowed - statistics.totalActiveRepayment),
			},
			{ id: 4, value: statistics.activeClientsCount },
			{ id: 3, value: statistics.critical20 },
			{ id: 2, value: statistics.mora15 },
			{ id: 1, value: statistics.noPayment30 },
		];

		setFilterButtonsAndStatistics((prev) =>
			prev.map((item) => {
				const update = updates.find((u) => u.id === item.id);
				return update ? { ...item, value: update.value } : item;
			})
		);
	}, [statistics]);

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
			if (newFilters.type) {
				searchParams.set("type", newFilters.type);
			}
			if (newFilters.paymentDay) {
				searchParams.set("paymentDay", newFilters.paymentDay);
			}

			router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleFilterButton = React.useCallback(
		(value) => {
			const upperValue = value.toUpperCase();

			const isType = upperValue === "MENSUAL" || upperValue === "QUINCENAL";

			let newType = activeType;
			let newPaymentDay = activePaymentDay;

			if (isType) {
				newType = activeType === upperValue ? null : upperValue;
				setActiveType(newType);
			} else {
				newPaymentDay = activePaymentDay === upperValue ? null : upperValue;
				setActivePaymentDay(newPaymentDay);
			}

			updateSearchParams({
				...filters,
				page: 1,
				limit: limit,
				type: newType,
				paymentDay: newPaymentDay,
			});
		},
		[updateSearchParams, filters]
	);

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
									label={`${label} ${value}`.trim()}
									variant={
										label.toUpperCase() === activeType || label.toUpperCase() === activePaymentDay
											? "contained"
											: "outlined"
									}
									size="small"
									onClick={action ? () => handleFilterButton(label) : undefined}
									sx={{
										fontSize: "0.75rem",
										px: 1,
										height: 32,
										maxWidth: 135,
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
