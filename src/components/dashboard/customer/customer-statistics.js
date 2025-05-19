"use client";

import * as React from "react";
import { Box, Chip, Divider, Grid2 } from "@mui/material";
import {
	CalendarDots as CalendarDotsIcon,
	Money as MoneyIcon,
	ReceiptX as ReceiptXIcon,
	ThumbsDown as ThumbsDownIcon,
	UserCircle as UserCircleIcon,
	Warning as WarningIcon,
} from "@phosphor-icons/react/dist/ssr";

const filterButtonsAndStatistics = [
	{ action: false, label: "NP:", icon: <ThumbsDownIcon />, value: "66" },
	{ action: false, label: "M > 15:", icon: <WarningIcon />, value: "67" },
	{ action: false, label: "CR:", icon: <ReceiptXIcon />, value: "0" },
	{ action: false, label: "", icon: <UserCircleIcon />, value: "451" },
	{ action: false, label: "", icon: <MoneyIcon />, value: "88480" },
	{ divider: true },
	{ action: true, label: "Bisemanal", icon: <CalendarDotsIcon />, value: "" },
	{ action: true, label: "5-20", icon: <CalendarDotsIcon />, value: "" },
	{ action: true, label: "10-25", icon: <CalendarDotsIcon />, value: "" },
	{ action: true, label: "15-30", icon: <CalendarDotsIcon />, value: "" },
];

export function CustomerStatistics() {
	const handleClick = () => {
		console.info("You clicked the Chip.");
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			{/* <Box sx={{ flexGrow: 1, px: 1 }}> */}
			{/* <Grid2 container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="center"> */}

			<Grid2 container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="center">
				{filterButtonsAndStatistics.map((item, index) => {
					if (item.divider) {
						return <Divider key={index} orientation="vertical" flexItem sx={{ mx: 2, borderColor: "grey" }} />;
					}
					const { label, value, icon, action } = item;
					return (
						<Grid2 key={index} size={"auto"}>
							<Chip
								icon={icon}
								label={`${label} ${value}`.trim()}
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
						</Grid2>
					);
				})}
			</Grid2>
		</Box>
	);
}
