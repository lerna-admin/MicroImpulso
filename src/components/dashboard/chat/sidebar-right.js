"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Form17 } from "@/components/widgets/forms/form-17";

export function SidebarRight({
	contacts,
	currentThreadId,
	messages,
	onCloseMobile,
	onSelectContact,
	onSelectThread,
	openDesktop,
	openMobile,
	threads,
}) {
	const mdUp = useMediaQuery("up", "md");

	const content = (
		<SidebarContent
			closeOnGroupClick={!mdUp}
			closeOnThreadSelect={!mdUp}
			contacts={contacts}
			currentThreadId={currentThreadId}
			messages={messages}
			onClose={onCloseMobile}
			onSelectContact={onSelectContact}
			onSelectThread={onSelectThread}
			threads={threads}
		/>
	);

	if (mdUp) {
		return (
			<Box
				sx={{
					borderLeft: "1px solid var(--mui-palette-divider)",
					flex: "0 0 auto",
					mr: openDesktop ? 0 : "-500px",
					position: "relative",
					transition: "margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
					width: "500px",
				}}
			>
				{content}
			</Box>
		);
	}

	return (
		<Drawer PaperProps={{ sx: { maxWidth: "100%", width: "500px" } }} onClose={onCloseMobile} open={openMobile}>
			{content}
		</Drawer>
	);
}

function SidebarContent() {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "0 0 auto", p: 2 }}>
				<Typography sx={{ flex: "1 1 auto" }} variant="h5">
					Perfil
				</Typography>
			</Stack>

			<Form17 />
		</Box>
	);
}
