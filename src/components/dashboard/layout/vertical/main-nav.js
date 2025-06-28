"use client";

import * as React from "react";
import { stringAvatar } from "@/helpers/avatar-colors";
import { Badge } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon, List as ListIcon } from "@phosphor-icons/react/dist/ssr";

import { getNotificationsByUser } from "@/hooks/use-notifications";
import { usePopover } from "@/hooks/use-popover";
import { useAuth } from "@/components/auth/custom/auth-context";

import { MobileNav } from "../mobile-nav";
import { NotificationsPopover } from "../notifications-popover";
import { UserPopover } from "../user-popover";

export function MainNav({ items }) {
	const [openNav, setOpenNav] = React.useState(false);

	return (
		<React.Fragment>
			<Box
				component="header"
				sx={{
					"--MainNav-background": "var(--mui-palette-background-default)",
					"--MainNav-divider": "var(--mui-palette-divider)",
					bgcolor: "var(--MainNav-background)",
					left: 0,
					position: "sticky",
					pt: { lg: "var(--Layout-gap)" },
					top: 0,
					width: "100%",
					zIndex: "var(--MainNav-zIndex)",
				}}
			>
				<Box
					sx={{
						borderBottom: "1px solid var(--MainNav-divider)",
						display: "flex",
						flex: "1 1 auto",
						minHeight: "var(--MainNav-height)",
						px: { xs: 2, lg: 3 },
						py: 1,
					}}
				>
					{" "}
					<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto" }}>
						<IconButton
							onClick={() => {
								setOpenNav(true);
							}}
							sx={{ display: { lg: "none" } }}
						>
							<ListIcon />
						</IconButton>
					</Stack>
					<Stack
						direction="row"
						spacing={2}
						sx={{ alignItems: "center", flex: "1 1 auto", justifyContent: "flex-end" }}
					>
						<NotificationsButton />
						<UserButton />
					</Stack>
				</Box>
			</Box>
			<MobileNav
				items={items}
				onClose={() => {
					setOpenNav(false);
				}}
				open={openNav}
			/>
		</React.Fragment>
	);
}

function NotificationsButton() {
	const popover = usePopover();
	const { user } = useAuth();

	const [notificationsCount, setNotificationsCount] = React.useState([]);

	const fetchNotifications = React.useCallback(async () => {
		try {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "/auth/profile", true);
			xhr.addEventListener("readystatechange", () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						try {
							const { user } = JSON.parse(xhr.responseText);
							const promise = getNotificationsByUser(user.id);
							promise.then((resp) => {
								const noLeidas = resp.filter((n) => !n.isRead).length;
								setNotificationsCount(noLeidas);
							});
						} catch (error) {
							console.error("Invalid JSON:", xhr.responseText, error);
						}
					} else {
						console.error("asd");
					}
				}
			});
			xhr.send();
		} catch (error) {
			console.error("❌ Error fetching chat data:", error);
		}
	}, [user.id, user.name]);

	React.useEffect(() => {
		if (!user?.id) return;
		fetchNotifications(); // First load
		const interval = setInterval(fetchNotifications, 3000);
		return () => clearInterval(interval);
	}, [fetchNotifications, user?.id]);

	return (
		<React.Fragment>
			<Tooltip title="Notificaciones">
				<IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
					<Badge badgeContent={notificationsCount} color="error">
						<BellIcon />
					</Badge>
				</IconButton>
			</Tooltip>
			<NotificationsPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
		</React.Fragment>
	);
}

function UserButton() {
	const popover = usePopover();
	const { user } = useAuth();

	const userName = user?.name || "Usuario";

	return (
		<React.Fragment>
			<Tooltip title="Usuario">
				<Box
					component="button"
					onClick={popover.handleOpen}
					ref={popover.anchorRef}
					sx={{ border: "none", background: "transparent", cursor: "pointer", p: 0 }}
				>
					<Avatar {...stringAvatar(userName)} />
				</Box>
				<UserPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
			</Tooltip>
		</React.Fragment>
	);
}
