"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";

const columns = [
	{ field: "type", name: "Tipo de formato", width: "150px" },
	{
		formatter: (row) => {
			return (
				<Typography suppressHydrationWarning sx={{ whiteSpace: "nowrap" }} variant="inherit">
					{dayjs(row.createdAt).format("MM/D/YYYY, hh:mm A")}
				</Typography>
			);
		},
		name: "Fecha de creación",
		width: "250px",
		align: "left",
	},
	{
		formatter(row) {
			return <Link href={row.url}>File</Link>;
		},
		name: "URL",
		width: "150px",
	},
	{
		formatter(row) {
			return <Chip label={row.classification} size="small" variant="soft" />;
		},
		name: "Clasificación",
		width: "150px",
	},
];

export function DocumentsModal({ open, customer, documents }) {
	const router = useRouter();
	const popover = usePopover();

	const handleClose = React.useCallback(() => {
		router.push(paths.dashboard.chat.base);
	}, [router]);

	return (
		<Dialog
			maxWidth="lg"
			onClose={handleClose}
			open={open}
			sx={{
				"& .MuiDialog-container": { justifyContent: "flex-end" },
				"& .MuiDialog-paper": { height: "80%", width: "100%" },
			}}
		>
			<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 5, minHeight: 0 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "0 0 auto", p: 1 }}>
					<Typography sx={{ flex: "1 1 auto" }} variant="h5">
						Documentos
					</Typography>
					<IconButton onClick={handleClose}>
						<XIcon />
					</IconButton>
				</Stack>

				<Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
					{/* <Stack direction="row" spacing={4} sx={{ alignItems: "flex-start" }}> */}

					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Card>
							<CardHeader title="Cliente" />
							<Divider />
							<PropertyList divider={<Divider />} sx={{ "--PropertyItem-padding": "16px 24px" }}>
								{[
									{ key: "Nombre completo", value: customer?.name },
									{ key: "Tipo documento", value: customer?.documentType },
									{ key: "Documento", value: customer?.document },
									{ key: "Dirección", value: customer?.address },
									{ key: "Correo", value: customer?.email },
									{ key: "Celular", value: customer?.phone },
								].map((item) => (
									<PropertyItem key={item.key} name={item.key} value={item.value} />
								))}
							</PropertyList>
						</Card>
					</Grid>
					<Grid
						size={{
							md: 8,
							xs: 12,
						}}
					>
						<Card>
							<CardHeader
								action={
									<>
										<IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
											<DotsThreeIcon weight="bold" />
										</IconButton>
										<Menu anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open}>
											<MenuItem
												onClick={() => {
													popover.handleClose();
												}}
											>
												<ListItemIcon>
													<PencilSimpleIcon />
												</ListItemIcon>
												<Typography>Editar</Typography>
											</MenuItem>
										</Menu>
									</>
								}
								title="Listado de documentos"
							/>
							<Divider />
							<Box sx={{ overflowX: "auto" }}>
								<DataTable columns={columns} rows={documents} />
							</Box>
						</Card>
					</Grid>
				</Grid>
				{/* </Stack> */}
			</DialogContent>
		</Dialog>
	);
}
