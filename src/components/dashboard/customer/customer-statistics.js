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

export function CustomerStatistics({ statistics }) {
	const router = useRouter();

	const [filterButtonsAndStatistics, setFilterButtonsAndStatistics] = React.useState([
		{ id: 1, action: false, label: "NP:", icon: <ThumbsDownIcon />, value: "0" },
		{ id: 2, action: false, label: "M > 15:", icon: <WarningIcon />, value: "0" },
		{ id: 3, action: false, label: "CR:", icon: <ReceiptXIcon />, value: "0" },
		{ id: 4, action: false, label: "", icon: <UserCircleIcon />, value: "" },
		{ id: 5, action: false, label: "", icon: <MoneyIcon />, value: "" },
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

	const handleFilterButton = (itemId) => {
		console.log(itemId);

		// const searchParams = new URLSearchParams();
		// searchParams.set("quincenal");
		// router.push(`${paths.dashboard.customers.list}?${searchParams.toString()}`);
	};

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
									onClick={action ? () => handleFilterButton(item.label) : undefined}
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
