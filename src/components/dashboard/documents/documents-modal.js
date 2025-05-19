"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { paths } from "@/paths";

export function DocumentsModal({ open, clientId }) {
	const router = useRouter();

	// This component should load the order from the API based on the orderId prop.
	// For the sake of simplicity, we are just using a static order object.

	const handleClose = React.useCallback(() => {
		router.push(paths.dashboard.chat.base);
	}, [router]);

	return (
		<Dialog
			maxWidth="md"
			onClose={handleClose}
			open={open}
			sx={{
				"& .MuiDialog-container": { justifyContent: "flex-end" },
				"& .MuiDialog-paper": { height: "100%", width: "100%" },
			}}
		>
			<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
				<Stack direction="row" sx={{ alignItems: "center", flex: "0 0 auto", justifyContent: "space-between" }}>
					<Typography variant="h6">{clientId}</Typography>
					<IconButton onClick={handleClose}>
						<XIcon />
					</IconButton>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
