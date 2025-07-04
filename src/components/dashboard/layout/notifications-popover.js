"use client";

import * as React from "react";
import { stringAvatar } from "@/helpers/avatar-colors";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// import { EnvelopeSimple as EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";

// import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { getNotificationsByUser, markAsReadNotification } from "@/hooks/use-notifications";
import { useAuth } from "@/components/auth/custom/auth-context";

export function NotificationsPopover({ anchorEl, onClose, open = false }) {
	const { user } = useAuth();

	// const notifications = [
	// 	{
	// 		id: "EV-004",
	// 		createdAt: dayjs().subtract(7, "minute").subtract(5, "hour").subtract(1, "day").toDate(),
	// 		read: false,
	// 		type: "new_job",
	// 		author: { name: "Jie Yan", avatar: "/assets/avatar-8.png" },
	// 		job: { title: "Remote React / React Native Developer" },
	// 	},
	// 	{
	// 		id: "EV-003",
	// 		createdAt: dayjs().subtract(18, "minute").subtract(3, "hour").subtract(5, "day").toDate(),
	// 		read: true,
	// 		type: "new_job",
	// 		author: { name: "Fran Perez", avatar: "/assets/avatar-5.png" },
	// 		job: { title: "Senior Golang Backend Engineer" },
	// 	},
	// 	{
	// 		id: "EV-002",
	// 		createdAt: dayjs().subtract(4, "minute").subtract(5, "hour").subtract(7, "day").toDate(),
	// 		read: true,
	// 		type: "new_feature",
	// 		description: "Logistics management is now available",
	// 	},
	// 	{
	// 		id: "EV-001",
	// 		createdAt: dayjs().subtract(7, "minute").subtract(8, "hour").subtract(7, "day").toDate(),
	// 		read: true,
	// 		type: "new_company",
	// 		author: { name: "Jie Yan", avatar: "/assets/avatar-8.png" },
	// 		company: { name: "Stripe" },
	// 	},
	// ];

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
								// console.log("resp", resp);

								const notificationsFormatted = resp.map((notify) => ({
									id: notify.id,
									createdAt: notify.createdAt,
									read: notify.isRead,
									type: notify.type,
									description: notify.description,
									author: { name: notify.payload.author?.name ?? "New Client" },
								}));

								// console.log("notificationsFormatted", notificationsFormatted);

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

	const handleRemoveOne = (notificationId) => {
		console.log(notificationId);
		const nuevosItems = notifications.filter((item) => item.id !== notificationId);
		setNotifications(nuevosItems);
	};

	React.useEffect(() => {
		if (!user?.id) return;
		fetchNotifications(); // First load
		const interval = setInterval(fetchNotifications, 30_000);
		return () => clearInterval(interval);
	}, [fetchNotifications, user?.id]);

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
									handleRemoveOne(notification.id);
								}}
							/>
						))}
					</List>
				</Box>
			)}
		</Popover>
	);
}

function NotificationItem({ divider, notification }) {
	return (
		<ListItem divider={divider} sx={{ alignItems: "flex-start", justifyContent: "space-between", pb: "1rem" }}>
			<NotificationContent notification={notification} />
			{/* <Tooltip title="Remove">
				<IconButton edge="end" onClick={onRemove} size="small">
					<XIcon />
				</IconButton>
			</Tooltip> */}
		</ListItem>
	);
}

function NotificationContent({ notification }) {
	const [isRead, setIsRead] = React.useState(notification.read);

	const handleMarkAsRead = async (notificationId) => {
		try {
			await markAsReadNotification(notificationId);
			setIsRead(true);
		} catch (error) {
			console.error(error.message);
		}
	};

	if (notification.type === "agent.closed_day") {
		return (
			<Stack
				direction="row"
				spacing={2}
				sx={{
					cursor: "pointer",
					alignItems: "flex-start",
					p: 2,
					"&:hover": {
						backgroundColor: "#f5f5f5",
					},
				}}
				onClick={() => handleMarkAsRead(notification.id)}
			>
				<Avatar {...stringAvatar(notification.author.name)} />
				<div>
					<Typography variant="body2">
						<Typography component="span" variant="inherit" fontWeight={isRead ? 300 : 500}>
							{`${notification.description}`}
						</Typography>
					</Typography>
					<Typography color="text.secondary" variant="caption">
						{dayjs(notification.createdAt).format("MMM D, hh:mm A")}
					</Typography>
				</div>
			</Stack>
		);
	}
	if (notification.type === "loan.approved") {
		return (
			<Stack
				direction="row"
				spacing={2}
				sx={{
					cursor: "pointer",
					alignItems: "flex-start",
					p: 2,
					"&:hover": {
						backgroundColor: "#f5f5f5",
					},
				}}
				onClick={() => handleMarkAsRead(notification.id)}
			>
				<Avatar {...stringAvatar(notification.author.name)} />
				<div>
					<Typography variant="body2">
						<Typography component="span" variant="inherit" fontWeight={isRead ? 300 : 500}>
							{`${notification.description} `}
						</Typography>
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
