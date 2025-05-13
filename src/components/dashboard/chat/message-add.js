"use client";

import * as React from "react";
import { stringAvatar } from "@/helpers/avatar-colors";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Camera as CameraIcon } from "@phosphor-icons/react/dist/ssr/Camera";
import { Paperclip as PaperclipIcon } from "@phosphor-icons/react/dist/ssr/Paperclip";
import { PaperPlaneTilt as PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";

import { useAuth } from "@/components/auth/custom/auth-context";

export function MessageAdd({ disabled = false, onSend }) {
	const { user } = useAuth();

	const userName = user?.name || "Usuario";

	const [content, setContent] = React.useState("");
	const fileInputRef = React.useRef(null);

	const handleAttach = React.useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleChange = React.useCallback((event) => {
		setContent(event.target.value);
	}, []);

	const handleSend = React.useCallback(() => {
		if (!content) {
			return;
		}

		onSend?.("text", content);
		setContent("");
	}, [content, onSend]);

	const handleKeyUp = React.useCallback(
		(event) => {
			if (event.code === "Enter") {
				handleSend();
			}
		},
		[handleSend]
	);

	return (
		<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "0 0 auto", px: 3, py: 1 }}>
			<Avatar {...stringAvatar(userName)} />
			<OutlinedInput
				disabled={disabled}
				onChange={handleChange}
				onKeyUp={handleKeyUp}
				placeholder="Leave a message"
				sx={{ flex: "1 1 auto" }}
				value={content}
			/>
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<Tooltip title="Send">
					<span>
						<IconButton
							color="primary"
							disabled={!content || disabled}
							onClick={handleSend}
							sx={{
								bgcolor: "var(--mui-palette-primary-main)",
								color: "var(--mui-palette-primary-contrastText)",
								"&:hover": { bgcolor: "var(--mui-palette-primary-dark)" },
							}}
						>
							<PaperPlaneTiltIcon />
						</IconButton>
					</span>
				</Tooltip>
				<Stack direction="row" spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
					<Tooltip title="Attach photo">
						<span>
							<IconButton disabled={disabled} edge="end" onClick={handleAttach}>
								<CameraIcon />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title="Attach file">
						<span>
							<IconButton disabled={disabled} edge="end" onClick={handleAttach}>
								<PaperclipIcon />
							</IconButton>
						</span>
					</Tooltip>
				</Stack>
			</Stack>
			<input hidden ref={fileInputRef} type="file" />
		</Stack>
	);
}
