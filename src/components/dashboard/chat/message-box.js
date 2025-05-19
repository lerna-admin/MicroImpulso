import * as React from "react";
import RouterLink from "next/link";
import { stringAvatar } from "@/helpers/avatar-colors";
import { Link } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";

dayjs.locale("es");

function extractUuid(text) {
	const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
	const match = text.match(uuidRegex);
	return match ? match[0] : null;
}

export function MessageBox({ message }) {
	const userName = message.author.name || "Usuario";
	const position = message.direction === "OUTGOING" ? "right" : "left";
	const uuid = extractUuid(message.content);

	return (
		<Box sx={{ alignItems: position === "right" ? "flex-end" : "flex-start", flex: "0 0 auto", display: "flex" }}>
			<Stack
				direction={position === "right" ? "row-reverse" : "row"}
				spacing={2}
				sx={{
					alignItems: "flex-start",
					maxWidth: "500px",
					ml: position === "right" ? "auto" : 0,
					mr: position === "left" ? "auto" : 0,
				}}
			>
				<Avatar {...stringAvatar(userName)} />
				<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
					<Card
						sx={{
							px: 2,
							py: 1,
							...(position === "right" && {
								bgcolor: "var(--mui-palette-primary-main)",
								color: "var(--mui-palette-primary-contrastText)",
							}),
						}}
					>
						<Stack spacing={1}>
							<div>
								<Typography color="inherit" variant="subtitle2">
									{message.author.name}
								</Typography>
							</div>
							{message.type === "image" ? (
								<CardMedia
									image={message.content}
									onClick={() => {
										// open modal
									}}
									sx={{ height: "200px", width: "200px" }}
								/>
							) : null}
							{message.type === "text" && uuid === null ? (
								<Typography color="inherit" variant="body1">
									{message.content}
								</Typography>
							) : (
								<Link
									component={RouterLink}
									target="_blank"
									href={paths.dashboard.documents.details(uuid)}
									variant="subtitle2"
								>
									Documento recibido
								</Link>
							)}
						</Stack>
					</Card>
					<Box sx={{ display: "flex", justifyContent: position === "right" ? "flex-end" : "flex-start", px: 2 }}>
						<Typography color="text.secondary" noWrap variant="caption">
							{dayjs(message.createdAt).fromNow()}
						</Typography>
					</Box>
				</Stack>
			</Stack>
		</Box>
	);
}
