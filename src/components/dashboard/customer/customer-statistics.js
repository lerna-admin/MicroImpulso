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
	const { limit, type, paymentDay, mora } = filters;
	const [activeType, setActiveType] = React.useState(null);
	const [activePaymentDay, setActivePaymentDay] = React.useState(null);
	const [activeMora, setActiveMora] = React.useState(null);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const [filterButtonsAndStatistics, setFilterButtonsAndStatistics] = React.useState([
		{ id: 1, action: true, label: "NP:", icon: <ThumbsDownIcon />, value: "0" },
		{ id: 2, action: true, label: "M > 15:", icon: <WarningIcon />, value: "0" },
		{ id: 3, action: true, label: "CR:", icon: <ReceiptXIcon />, value: "0" },
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
		if (mora === undefined) {
			setActiveMora(null);
		} else {
			setActiveMora(mora);
		}
	}, [type, paymentDay, mora]);

	React.useEffect(() => {
		const updates = [
			{
				id: 5,
				value: new Intl.NumberFormat("es-CO", {
					style: "currency",
					currency: "COP",
					minimumFractionDigits: 0,
				}).format(statistics.remainingTotal ?? 0),
			},
			{ id: 4, value: statistics.activeClientsCount ?? 0 },
			{ id: 3, value: statistics.noPayment30 ?? 0 },
			{ id: 2, value: statistics.mora15 ?? 0 },
			{ id: 1, value: statistics.delinquentClients ?? 0 },
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
				searchParams.set("branch", String(newFilters.branch));
			}
			if (newFilters.agent) {
				searchParams.set("agent", String(newFilters.agent));
			}
			if (newFilters.mora) {
				searchParams.set("mora", newFilters.mora);
			}

			router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleFilterButton = React.useCallback(
		(value) => {
			const upperValue = value.toUpperCase();

			if (value === "NP:" || value === "M > 15:" || value === "CR:") {
				let newMora = activeMora;
				const moraKey =
					value === "NP:" ? "NP" : value === "M > 15:" ? "M15" : "CR";

				newMora = activeMora === moraKey ? null : moraKey;
				setActiveMora(newMora);

				updateSearchParams({
					...filters,
					page: 1,
					limit,
					mora: newMora || undefined,
				});

				return;
			}

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

	const containerStyles = {
		display: "flex",
		flexWrap: "wrap",
		gap: 1.25,
		justifyContent: "center",
		alignItems: "center",
	};

	const chipStyles = {
		fontSize: "0.75rem",
		px: 1.5,
		height: 32,
		minWidth: 110,
	};

	return (
		<Box sx={containerStyles}>
			{filterButtonsAndStatistics.map((item, index) => {
				const { label, value, icon, action } = item;

				return (
					<Box key={index} sx={{ textAlign: "center" }}>
						<Tooltip title={value}>
							<Chip
								icon={icon}
								label={`${label} ${value}`.trim()}
								variant={
									label.toUpperCase() === activeType ||
									label.toUpperCase() === activePaymentDay ||
									(label === "NP:" && activeMora === "NP") ||
									(label === "M > 15:" && activeMora === "M15") ||
									(label === "CR:" && activeMora === "CR")
										? "contained"
										: "outlined"
								}
								size="small"
								onClick={action ? () => handleFilterButton(label) : undefined}
								sx={chipStyles}
							/>
						</Tooltip>
					</Box>
				);
			})}
		</Box>
	);
}
