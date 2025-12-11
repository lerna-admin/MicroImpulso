import * as React from "react";
import { useRouter } from "next/navigation";
import { stringAvatar } from "@/helpers/avatar-colors";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { FileDoc as FileDocIcon, User as UserIcon, XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";

import { paths } from "@/paths";
import { usePopover } from "@/hooks/use-popover";
import { useAuth } from "@/components/auth/custom/auth-context";

import { ChatContext } from "./chat-context";
import { rejectClientLoan } from "@/app/dashboard/chat/hooks/use-conversations";

export function ThreadToolbar({ thread }) {
	const { user } = useAuth();
	const router = useRouter();
	const popover = usePopover();

	const recipients = (thread.participants ?? []).filter((participant) => participant.id !== user.id);

	const { setOpenDesktopSidebarRight } = React.useContext(ChatContext);

	const handleRejectLoan = React.useCallback(async () => {
		const clientId = recipients[0]?.id;
		if (!clientId) return;
		if (typeof window !== "undefined") {
			const confirmReject = window.confirm("¿Marcar la solicitud activa de este cliente como rechazada?");
			if (!confirmReject) {
				return;
			}
		}
		try {
			await rejectClientLoan(clientId);
			router.refresh();
		} catch (error) {
			console.error("Error marcando solicitud como rechazada", error);
		}
	}, [recipients, router]);

	return (
		<React.Fragment>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					alignItems: "center",
					borderBottom: "1px solid var(--mui-palette-divider)",
					flex: "0 0 auto",
					justifyContent: "space-between",
					minHeight: "64px",
					px: 2,
					py: 1,
				}}
			>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", minWidth: 0 }}>
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
					<Box sx={{ minWidth: 0 }}>
						<Typography noWrap variant="subtitle2">
							{recipients.map((recipient) => recipient.name).join(", ")}
						</Typography>
					</Box>
				</Stack>
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<Tooltip title="Más opciones">
						<IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
							<DotsThreeIcon weight="bold" />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>
			<Menu anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open}>
				<MenuItem
					onClick={() => {
						popover.handleClose();
						router.push(paths.dashboard.chat.preview(recipients[0].id));
					}}
				>
					<ListItemIcon>
						<FileDocIcon />
					</ListItemIcon>
					<Typography>Ver documentos</Typography>
				</MenuItem>
				<MenuItem
					onClick={() => {
						popover.handleClose();
						setOpenDesktopSidebarRight((prev) => !prev);
					}}
				>
					<ListItemIcon>
						<UserIcon />
					</ListItemIcon>
					<Typography>Ver perfil</Typography>
				</MenuItem>
				<MenuItem
					onClick={() => {
						popover.handleClose();
						handleRejectLoan();
					}}
				>
					<ListItemIcon>
						<XCircleIcon />
					</ListItemIcon>
					<Typography>Marcar solicitud como rechazada</Typography>
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
