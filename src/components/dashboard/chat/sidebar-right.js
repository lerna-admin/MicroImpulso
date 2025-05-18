"use client";

import * as React from "react";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Option } from "@/components/core/option";

import { ChatContext } from "./chat-context";

export function SidebarRight({
	contacts,
	currentThreadId,
	messages,
	onCloseMobile,
	onSelectContact,
	onSelectThread,
	openDesktop,
	openMobile,
	threads,
}) {
	const mdUp = useMediaQuery("up", "md");

	const content = (
		<SidebarContent
			closeOnGroupClick={!mdUp}
			closeOnThreadSelect={!mdUp}
			contacts={contacts}
			currentThreadId={currentThreadId}
			messages={messages}
			onClose={onCloseMobile}
			onSelectContact={onSelectContact}
			onSelectThread={onSelectThread}
			threads={threads}
		/>
	);

	if (mdUp) {
		return (
			<Box
				sx={{
					borderLeft: "1px solid var(--mui-palette-divider)",
					flex: "0 0 auto",
					mr: openDesktop ? 0 : "-500px",
					position: "relative",
					transition: "margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
					width: "500px",
				}}
			>
				{content}
			</Box>
		);
	}

	return (
		<Drawer PaperProps={{ sx: { maxWidth: "100%", width: "500px" } }} onClose={onCloseMobile} open={openMobile}>
			{content}
		</Drawer>
	);
}

function SidebarContent({ currentThreadId, threads, contacts }) {
	const { setOpenDesktopSidebarRight } = React.useContext(ChatContext);
	const threadFound = threads.find((thread) => thread.id === currentThreadId);
	const contactFound = contacts.find((contact) => contact.id === threadFound.participants[1].id);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "0 0 auto", p: 2 }}>
				<Typography sx={{ flex: "1 1 auto" }} variant="h5">
					Perfil
				</Typography>
				<IconButton
					onClick={() => {
						setOpenDesktopSidebarRight((prev) => !prev);
					}}
				>
					<XIcon />
				</IconButton>
			</Stack>
			<Stack spacing={4} sx={{ p: 3 }}>
				<Grid container spacing={3}>
					<Grid
						size={{
							md: 6,
							xs: 12,
						}}
					>
						<FormControl fullWidth>
							<InputLabel required>Nombre Completo</InputLabel>
							<OutlinedInput defaultValue={contactFound.name} name="name" />
						</FormControl>
					</Grid>
					<Grid
						size={{
							md: 6,
							xs: 12,
						}}
					>
						<FormControl fullWidth>
							<InputLabel required>Tipo de Documento</InputLabel>
							<Select displayEmpty={true} name="document">
								<Option value="cc">Cedula de Ciudadania</Option>
								<Option value="ce">Cedula de Extranjeria</Option>
								<Option value="te">Tarjeta de extranjería</Option>
							</Select>
						</FormControl>
					</Grid>
					<Grid
						size={{
							md: 6,
							xs: 12,
						}}
					>
						<FormControl fullWidth>
							<InputLabel required>Cedula</InputLabel>
							<OutlinedInput defaultValue={contactFound.document} name="address" />
						</FormControl>
					</Grid>
					<Grid
						size={{
							md: 6,
							xs: 12,
						}}
					>
						<FormControl fullWidth>
							<InputLabel required>Dirección</InputLabel>
							<OutlinedInput defaultValue={contactFound.address} name="address" />
						</FormControl>
					</Grid>
					<Grid
						size={{
							md: 6,
							xs: 12,
						}}
					>
						<FormControl fullWidth>
							<InputLabel required>Numero Celular</InputLabel>
							<OutlinedInput defaultValue={contactFound.phone} name="phone" />
						</FormControl>
					</Grid>
				</Grid>

				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Button
						variant="contained"
						onClick={() => {
							setOpenDesktopSidebarRight((prev) => !prev);
						}}
					>
						Guardar
					</Button>
				</Grid>
			</Stack>
		</Box>
	);
}
