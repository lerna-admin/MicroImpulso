"use client";

import * as React from "react";
import { stringAvatar } from "@/helpers/avatar-colors";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ChatText as ChatTextIcon } from "@phosphor-icons/react/dist/ssr/ChatText";
// import { EnvelopeSimple as EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

// import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { getNotificationsByUser } from "@/hooks/use-notifications";
import { useAuth } from "@/components/auth/custom/auth-context";

export function NotificationsPopover({ anchorEl, onClose, onRemoveOne, open = false }) {
	const { user } = useAuth();

	const [notifications, setNotifications] = React.useState([]);

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
								console.log(resp);

								const notificationsFormatted = resp.map((notify) => ({
									id: notify.id,
									createdAt: notify.createdAt,
									read: notify.isRead,
									type: notify.type,
									author: { name: notify.payload.actor.name },
								}));

								console.log(notificationsFormatted);

								setNotifications(notificationsFormatted);
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
		const interval = setInterval(fetchNotifications, 5000);
		return () => clearInterval(interval);
	}, [fetchNotifications, user?.id]);

	// const notifications = [
	// 	{
	// 		id: "EV-004",
	// 		createdAt: dayjs().subtract(7, "minute").subtract(5, "hour").subtract(1, "day").toDate(),
	// 		read: false,
	// 		type: "new_job",
	// 		author: { name: "Jie Yan", avatar: "/assets/avatar-8.png" },
	// 		job: { title: "Remote React / React Native Developer" },
	// 	},
	// ];

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			onClose={onClose}
			open={open}
			slotProps={{ paper: { sx: { width: "380px" } } }}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
		>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between", px: 3, py: 2 }}>
				<Typography variant="h6">Notificaciones</Typography>
				{/* <Tooltip title="Mark all as read">
					<IconButton edge="end" onClick={onMarkAllAsRead}>
						<EnvelopeSimpleIcon />
					</IconButton>
				</Tooltip> */}
			</Stack>
			{notifications.length === 0 ? (
				<Box sx={{ p: 2 }}>
					<Typography variant="subtitle2">No hay notificaciones</Typography>
				</Box>
			) : (
				<Box sx={{ maxHeight: "270px", overflowY: "auto" }}>
					<List disablePadding>
						{notifications.map((notification, index) => (
							<NotificationItem
								divider={index < notifications.length - 1}
								key={notification.id}
								notification={notification}
								onRemove={() => {
									onRemoveOne?.(notification.id);
								}}
							/>
						))}
					</List>
				</Box>
			)}
		</Popover>
	);
}

function NotificationItem({ divider, notification, onRemove }) {
	return (
		<ListItem divider={divider} sx={{ alignItems: "flex-start", justifyContent: "space-between", pb: "2rem" }}>
			<NotificationContent notification={notification} />
			<Tooltip title="Remove">
				<IconButton edge="end" onClick={onRemove} size="small">
					<XIcon />
				</IconButton>
			</Tooltip>
		</ListItem>
	);
}

function NotificationContent({ notification }) {
	if (notification.type === "new_feature") {
		return (
			<Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
				<Avatar>
					<ChatTextIcon fontSize="var(--Icon-fontSize)" />
				</Avatar>
				<div>
					<Typography variant="subtitle2">New feature!</Typography>
					<Typography variant="body2">{notification.description}</Typography>
					<Typography color="text.secondary" variant="caption">
						{dayjs(notification.createdAt).format("MMM D, hh:mm A")}
					</Typography>
				</div>
			</Stack>
		);
	}

	if (notification.type === "new_company") {
		return (
			<Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
				<Avatar src={notification.author.avatar}>
					<UserIcon />
				</Avatar>
				<div>
					<Typography variant="body2">
						<Typography component="span" variant="subtitle2">
							{notification.author.name}
						</Typography>{" "}
						created{" "}
						<Link underline="always" variant="body2">
							{notification.company.name}
						</Link>{" "}
						company
					</Typography>
					<Typography color="text.secondary" variant="caption">
						{dayjs(notification.createdAt).format("MMM D, hh:mm A")}
					</Typography>
				</div>
			</Stack>
		);
	}

	if (notification.type === "agent.closed_day") {
		return (
			<Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
				{/* <Avatar src={notification.author.avatar}>
					<UserIcon />
				</Avatar> */}
				<Avatar {...stringAvatar(notification.author.name)} />
				<div>
					<Typography variant="body2">
						<Typography component="span" variant="subtitle2">
							{notification.author.name}
						</Typography>{" "}
						hizo el cierre del dia.
					</Typography>
					<Typography color="text.secondary" variant="caption">
						{dayjs(notification.createdAt).format("MMM D, hh:mm A")}
					</Typography>
				</div>
			</Stack>
		);
	}

	return <div />;
}
