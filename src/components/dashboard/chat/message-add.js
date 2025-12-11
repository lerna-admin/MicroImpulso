"use client";

import * as React from "react";
import { stringAvatar } from "@/helpers/avatar-colors";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Camera as CameraIcon } from "@phosphor-icons/react/dist/ssr/Camera";
import { Paperclip as PaperclipIcon } from "@phosphor-icons/react/dist/ssr/Paperclip";
import { PaperPlaneTilt as PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";

import { useAuth } from "@/components/auth/custom/auth-context";

export function MessageAdd({ disabled = false, onSend, onUpload }) {
	const { user } = useAuth();
	const userName = user?.name || "Usuario";

	const [content, setContent] = React.useState("");
	const editorRef = React.useRef(null);
	const fileInputRef = React.useRef(null);
	const [attachmentType, setAttachmentType] = React.useState("any");

	const handleAttach = React.useCallback((acceptType) => {
		setAttachmentType(acceptType);
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = React.useCallback(
		(event) => {
			const file = event.target.files?.[0];
			if (!file) return;
			onUpload?.(file);
			event.target.value = "";
		},
		[onUpload]
	);

	const handleInput = React.useCallback(() => {
		setContent(editorRef.current.innerHTML);
	}, []);

	const handleSend = React.useCallback(() => {
		if (!content || content === "<br>" || content === "<p><br></p>") return;

		onSend?.("text", content);

		setContent("");
		if (editorRef.current) editorRef.current.innerHTML = "";
	}, [content, onSend]);

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	};

	return (
		<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "0 0 auto", px: 3, py: 1 }}>
			<Avatar {...stringAvatar(userName)} />

			<div
				ref={editorRef}
				contentEditable={!disabled}
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				placeholder="Leave a message"
				style={{
					flex: "1 1 auto",
					minHeight: "48px",
					maxHeight: "120px",
					overflowY: "auto",
					border: "1px solid rgba(0,0,0,0.23)",
					borderRadius: "8px",
					padding: "12px",
					outline: "none",
					fontSize: "16px",
				}}
				className="editable-input"
			></div>

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
							<IconButton disabled={disabled} edge="end" onClick={() => handleAttach("image/*")}>
								<CameraIcon />
							</IconButton>
						</span>
					</Tooltip>

					<Tooltip title="Attach file">
						<span>
							<IconButton disabled={disabled} edge="end" onClick={() => handleAttach("*/*")}>
								<PaperclipIcon />
							</IconButton>
						</span>
					</Tooltip>
				</Stack>
			</Stack>

			<input hidden ref={fileInputRef} type="file" accept={attachmentType} onChange={handleFileChange} />
		</Stack>
	);
}
