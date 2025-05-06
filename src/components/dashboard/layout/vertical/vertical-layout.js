"use client";

import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";

import { dashboardConfig } from "@/config/dashboard";
import { useSettings } from "@/components/core/settings/settings-context";

import { MainNav } from "./main-nav";
import { SideNav } from "./side-nav";

export function VerticalLayout({ children }) {
	const { settings } = useSettings();

	const [userRole, setUserRole] = React.useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/auth/get-user");
				const data = await res.json();
				const {
					data: {
						user: { role },
					},
				} = data;
				if (!data.error) {
					setUserRole(role);
				}
			} catch (error) {
				console.error("Failed to load user info:", error);
			}
		};

		fetchUser();
	}, []);

	const filteredItems = dashboardConfig.navItems.filter((route) => route.key.includes(userRole));

	const navColor = settings.dashboardNavColor ?? dashboardConfig.navColor;

	return (
		<React.Fragment>
			<GlobalStyles
				styles={{
					body: {
						"--MainNav-height": "56px",
						"--MainNav-zIndex": 1000,
						"--SideNav-width": "280px",
						"--SideNav-zIndex": 1100,
						"--MobileNav-width": "320px",
						"--MobileNav-zIndex": 1100,
					},
				}}
			/>
			<Box
				sx={{
					bgcolor: "var(--mui-palette-background-default)",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					minHeight: "100%",
				}}
			>
				<SideNav color={navColor} items={filteredItems} />
				<Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column", pl: { lg: "var(--SideNav-width)" } }}>
					<MainNav items={filteredItems} />
					<Box
						component="main"
						sx={{
							"--Content-margin": "0 auto",
							"--Content-maxWidth": "var(--maxWidth-xl)",
							"--Content-paddingX": "24px",
							"--Content-paddingY": { xs: "24px", lg: "64px" },
							"--Content-padding": "var(--Content-paddingY) var(--Content-paddingX)",
							"--Content-width": "100%",
							display: "flex",
							flex: "1 1 auto",
							flexDirection: "column",
						}}
					>
						{children}
					</Box>
				</Box>
			</Box>
		</React.Fragment>
	);
}
