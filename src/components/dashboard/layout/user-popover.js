"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react/dist/ssr/CreditCard";
import { LockKey as LockKeyIcon } from "@phosphor-icons/react/dist/ssr/LockKey";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { AuthStrategy } from "@/lib/auth-strategy";

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
			Sign out
		</MenuItem>
	);
}

export function UserPopover({ anchorEl, onClose, open }) {
	const [user, setUser] = useState(null);
	
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/auth/get-user");
				const data = await res.json();
				if (!data.error) {
					setUser(data.user.user);
				}
			} catch (err) {
				console.error("Failed to load user info:", err);
			}
		};

		if (open) fetchUser();
	}, [open]);

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
				<Typography>{user?.name ?? "Usuario"}</Typography>
				<Typography color="text.secondary" variant="body2">
					{user?.email ?? ""}
				</Typography>
			</Box>
			<Divider />
			<List sx={{ p: 1 }}>
				<MenuItem component={RouterLink} href={paths.dashboard.settings.account} onClick={onClose}>
					<ListItemIcon>
						<UserIcon />
					</ListItemIcon>
					Account
				</MenuItem>
				<MenuItem component={RouterLink} href={paths.dashboard.settings.security} onClick={onClose}>
					<ListItemIcon>
						<LockKeyIcon />
					</ListItemIcon>
					Security
				</MenuItem>
				<MenuItem component={RouterLink} href={paths.dashboard.settings.billing} onClick={onClose}>
					<ListItemIcon>
						<CreditCardIcon />
					</ListItemIcon>
					Billing
				</MenuItem>
			</List>
			<Divider />
			<Box sx={{ p: 1 }}>
				<SignOutButton />
			</Box>
		</Popover>
	);
}
