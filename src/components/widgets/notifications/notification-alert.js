import React from "react";
import { Alert, Snackbar } from "@mui/material";

export const NotificationAlert = ({ openAlert, onClose, msg, autoHideDuration, posVertical, posHorizontal }) => {
	return (
		<Snackbar
			open={openAlert}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			anchorOrigin={{ vertical: posVertical, horizontal: posHorizontal }}
		>
			<Alert severity="success" onClose={onClose}>
				{msg}
			</Alert>
		</Snackbar>
	);
};
