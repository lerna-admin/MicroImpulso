import React from "react";
import { Alert, Snackbar } from "@mui/material";

export const NotificationAlert = ({ openAlert, onClose, msg, severity }) => {
	return (
		<Snackbar
			open={openAlert}
			autoHideDuration={3000}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		>
			<Alert severity={severity} onClose={onClose}>
				{msg}
			</Alert>
		</Snackbar>
	);
};
