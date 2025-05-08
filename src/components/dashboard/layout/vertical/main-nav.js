"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
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

	const { user } = useAuth();
	
	const userName = React.useMemo(() => {
		return user?.name || "";
	}, [user?.name]);

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
						<UserButton userName={userName} />
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
			<Tooltip title="Notifications">
				<Badge
					color="error"
					sx={{ "& .MuiBadge-dot": { borderRadius: "50%", height: "10px", right: "6px", top: "6px", width: "10px" } }}
					variant="dot"
				>
					<IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
						<BellIcon />
					</IconButton>
				</Badge>
			</Tooltip>
			<NotificationsPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
		</React.Fragment>
	);
}

function UserButton({ userName }) {
	const popover = usePopover();

	return (
		<React.Fragment>
			<Box
				component="button"
				onClick={popover.handleOpen}
				ref={popover.anchorRef}
				sx={{ border: "none", background: "transparent", cursor: "pointer", p: 0 }}
			>
				<Badge
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					color="success"
					sx={{
						"& .MuiBadge-dot": {
							border: "2px solid var(--MainNav-background)",
							borderRadius: "50%",
							bottom: "6px",
							height: "12px",
							right: "6px",
							width: "12px",
						},
					}}
					variant="dot"
				>
					<Avatar />
				</Badge>
			</Box>
			<UserPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
		</React.Fragment>
	);
}

function stringAvatar(name) {
	return {
		sx: {
			bgcolor: stringToColor(name),
		},
		children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
	};
}

function stringToColor(string) {
	let hash = 0;
	let i;

	for (i = 0; i < string.length; i += 1) {
		hash = string.codePointAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		// eslint-disable-next-line unicorn/number-literal-case
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}

	return color;
}
