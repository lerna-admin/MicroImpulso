import React from "react";
import { Alert, Snackbar } from "@mui/material";

export const NotificationAlert = ({ openAlert, onClose, msg, severity = "success" }) => {
	return (
		<Snackbar
			open={openAlert}
			autoHideDuration={2000}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		>
			<Alert severity={severity} onClose={onClose}>
				{msg}
			</Alert>
		</Snackbar>
	);
};
