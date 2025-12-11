import * as React from "react";
import { stringAvatar } from "@/helpers/avatar-colors";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { dayjs } from "@/lib/dayjs";
import { useAuth } from "@/components/auth/custom/auth-context";

dayjs.locale("es");

function getDisplayContent(lastMessage, userId) {
	const author = lastMessage.author.id === userId ? "Yo: " : "";
	const message = lastMessage.type === "image" ? "Envio una foto" : lastMessage.content;

	return `${author}${message}`;
}

function extractUuid(text) {
	const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
	const match = text.match(uuidRegex);
	return match ? match[0] : null;
}

export function ThreadItem({ active = false, thread, messages, onSelect }) {
	const { user } = useAuth();

	const recipients = (thread.participants ?? []).filter((participant) => participant.id !== user.id);

	const lastMessage = messages.at(-1);
	const needsAttention = lastMessage?.direction === "INCOMING" && !lastMessage.isRead;
	const uuid = lastMessage ? extractUuid(lastMessage.content) : null;
	const previewColor = lastMessage?.direction === "INCOMING" && !lastMessage.isRead ? "text.primary" : "text.secondary";

	return (
		<Box component="li" sx={{ userSelect: "none" }}>
			<Box
				onClick={onSelect}
				onKeyUp={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						onSelect?.();
					}
				}}
				role="button"
				sx={{
					alignItems: "center",
					borderRadius: 1,
					cursor: "pointer",
					display: "flex",
					flex: "0 0 auto",
					gap: 1,
					p: 1,
					...(lastMessage?.direction === "INCOMING" && !lastMessage.isRead && !active
						? { bgcolor: "rgba(156, 163, 175, 0.2)" }
						: {}),
					...(active && { bgcolor: "var(--mui-palette-action-selected)" }),
					"&:hover": {
						...(!active && {
							bgcolor: needsAttention ? "rgba(255, 170, 0, 0.18)" : "var(--mui-palette-action-hover)",
						}),
					},
				}}
				tabIndex={0}
			>
				<div>
					<AvatarGroup
						max={2}
						sx={{
							"& .MuiAvatar-root": {
								fontSize: "var(--fontSize-xs)",
								...(thread.type === "group"
									? { height: "24px", ml: "-16px", width: "24px", "&:nth-of-type(2)": { mt: "12px" } }
									: { height: "36px", width: "36px" }),
							},
						}}
					>
						{recipients.map((recipient) => (
							<Avatar key={recipient.id} {...stringAvatar(recipient.name)} />
						))}
					</AvatarGroup>
				</div>
				<Box sx={{ flex: "1 1 auto", overflow: "hidden" }}>
					<Typography noWrap variant="subtitle2">
						{recipients.map((recipient) => recipient.name).join(", ")}
					</Typography>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						{lastMessage && uuid === null ? (
							<Typography color={previewColor} noWrap sx={{ flex: "1 1 auto", fontWeight: lastMessage.direction === "INCOMING" && !lastMessage.isRead ? 600 : undefined }} variant="subtitle2">
								{getDisplayContent(lastMessage, user.id)}
							</Typography>
						) : (
							<Typography color={previewColor} noWrap sx={{ flex: "1 1 auto", fontWeight: lastMessage?.direction === "INCOMING" && !lastMessage?.isRead ? 600 : undefined }} variant="subtitle2">
								Documento recibido
							</Typography>
						)}
					</Stack>
				</Box>
				{lastMessage ? (
					<Typography color="text.secondary" sx={{ whiteSpace: "nowrap" }} variant="caption">
						{dayjs(lastMessage.createdAt).fromNow()}
					</Typography>
				) : null}
			</Box>
		</Box>
	);
}
