"use client";

import * as React from "react";
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

const tabs = [
	{ label: "Overview", value: "overview" },
	{ label: "Reviews", value: "reviews" },
	{ label: "Activity", value: "activity" },
	{ label: "Team", value: "team" },
	{ label: "Assets", value: "assets" },
];

function useSegment() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);

	return segments[4] ?? "overview";
}

export function CompanyTabs() {
	const segment = useSegment();

	return (
		<Tabs sx={{ px: 3 }} value={segment} variant="scrollable">
			{tabs.map((tab) => (
				<Tab {...tab} component={RouterLink} key={tab.value} tabIndex={0} />
			))}
		</Tabs>
	);
}
