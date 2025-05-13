"use client";

import * as React from "react";
import { stringAvatar } from "@/helpers/avatar-colors";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";

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

	return (
		<React.Fragment>
			<Tooltip title="Notificaciones">
				<IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
					<BellIcon />
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
