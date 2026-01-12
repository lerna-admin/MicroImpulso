"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";

import { dashboardConfig } from "@/config/dashboard";
import { useAuth } from "@/components/auth/custom/auth-context";
import { useSettings } from "@/components/core/settings/settings-context";

import { MainNav } from "./main-nav";
import { SideNav } from "./side-nav";

export function VerticalLayout({ children }) {
	const { settings } = useSettings();

	const { user, isLoading } = useAuth();

	const userRole = user?.role;

	const filteredItems = React.useMemo(() => {
		if (!userRole || !dashboardConfig?.navItems) return [];

		// Mapeo de roles backend → bloque de menú
		let effectiveRole = userRole;
		if (userRole === "SUPERADMIN" || userRole === "ADMIN" || userRole === "MARKETING") {
			effectiveRole = "MANAGER"; // reutiliza menú de gerente
		}

		return dashboardConfig.navItems.filter((route) => route.key === effectiveRole);
	}, [userRole]);

	const navColor = settings.dashboardNavColor ?? dashboardConfig.navColor;

	if (!isLoading)
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
