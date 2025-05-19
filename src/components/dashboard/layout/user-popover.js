"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { AuthStrategy } from "@/lib/auth-strategy";
import { useAuth } from "@/components/auth/custom/auth-context";

function SignOutButton() {
	let signOutUrl = paths.home;

	if (appConfig.authStrategy === AuthStrategy.AUTH0) {
		signOutUrl = paths.auth.auth0.signOut;
	}

	if (appConfig.authStrategy === AuthStrategy.CUSTOM) {
		signOutUrl = paths.auth.signOut;
	}

	return (
		<MenuItem component="a" href={signOutUrl} sx={{ justifyContent: "center" }}>
			Cerrar sesión
		</MenuItem>
	);
}

export function UserPopover({ anchorEl, onClose, open }) {
	const { user } = useAuth();

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			onClose={onClose}
			open={Boolean(open)}
			slotProps={{ paper: { sx: { width: "280px" } } }}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
		>
			<Box sx={{ p: 2 }}>
				<Typography>{user?.name ? `${user?.name} - ${user.role}` : "Usuario"}</Typography>
				<Typography color="text.secondary" variant="body2">
					{user?.email ?? ""}
				</Typography>
			</Box>
			<Divider />
			<Box sx={{ p: 1 }}>
				<SignOutButton />
			</Box>
		</Popover>
	);
}
