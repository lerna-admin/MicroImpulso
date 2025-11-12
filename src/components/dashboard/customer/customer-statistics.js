"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, Chip, Tooltip, useMediaQuery, useTheme } from "@mui/material";
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
	const { limit, type, paymentDay } = filters;
	const [activeType, setActiveType] = React.useState(null);
	const [activePaymentDay, setActivePaymentDay] = React.useState(null);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const [filterButtonsAndStatistics, setFilterButtonsAndStatistics] = React.useState([
		{ id: 1, action: false, label: "NP:", icon: <ThumbsDownIcon />, value: "0" },
		{ id: 2, action: false, label: "M > 15:", icon: <WarningIcon />, value: "0" },
		{ id: 3, action: false, label: "CR:", icon: <ReceiptXIcon />, value: "0" },
		{ id: 4, action: false, label: "", icon: <UserCircleIcon />, value: "0" },
		{ id: 5, action: false, label: "", icon: <MoneyIcon />, value: "0" },
		{ id: 6, action: true, label: "Quincenal", icon: <CalendarDotsIcon />, value: "" },
		{ id: 7, action: true, label: "Mensual", icon: <CalendarDotsIcon />, value: "" },
		{ id: 8, action: true, label: "5-20", icon: <CalendarDotsIcon />, value: "" },
		{ id: 9, action: true, label: "10-25", icon: <CalendarDotsIcon />, value: "" },
		{ id: 10, action: true, label: "15-30", icon: <CalendarDotsIcon />, value: "" },
		{ id: 11, action: true, label: "3-18", icon: <CalendarDotsIcon />, value: "" },
		
	]);

	React.useEffect(() => {
		if (type === undefined) {
			setActiveType(null);
		}
		if (paymentDay === undefined) {
			setActivePaymentDay(null);
		}
	}, [type, paymentDay]);

	React.useEffect(() => {
		const updates = [
			{
				id: 5,
				value: new Intl.NumberFormat("es-CO", {
					style: "currency",
					currency: "COP",
					minimumFractionDigits: 0,
				}).format(statistics.remainingTotal),
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
		[activeType, activePaymentDay, updateSearchParams, filters, limit]
	);

	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: isSmallScreen ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
				gridTemplateRows: isSmallScreen ? "repeat(5, auto)" : "repeat(2, auto)",
				gap: 1.3,
			}}
		>
			{filterButtonsAndStatistics.map((item, index) => {
				const { label, value, icon, action } = item;

				return (
					<Box key={index} sx={{ textAlign: "center" }}>
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
									width: "100%",
								}}
							/>
						</Tooltip>
					</Box>
				);
			})}
		</Box>
	);
}
