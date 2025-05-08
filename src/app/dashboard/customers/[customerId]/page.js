import * as React from "react";
import RouterLink from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	Timer as TimerIcon,
	WarningDiamond as WarningDiamondIcon,
	XCircle as XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { PropertyList } from "@/components/core/property-list";
import { CustomerEditForm } from "@/components/dashboard/customer/customer-edit-form";

import { getCustomerById } from "../hooks/use-customers";

export const metadata = { title: `Detalle | Clientes | Dashboard | ${appConfig.name}` };

export default async function Page({ params }) {
	const { customerId } = params;
	const customer = await getCustomerById(customerId);

	const mappingIcons = {
		active: { label: "Activo", icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
		inactive: { label: "Inactivo", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
		suspended: { label: "Suspendido", icon: <TimerIcon color="var(--mui-palette-warning-main)" weight="fill" /> },
		prospect: { label: "Prospecto", icon: <WarningDiamondIcon color="var(--mui-palette-info-main)" weight="fill" /> },
	};
	const { label, icon } = mappingIcons[customer.status] ?? { label: "Unknown", icon: null };

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<Stack spacing={3}>
					<div>
						<Link
							color="text.primary"
							component={RouterLink}
							href={paths.dashboard.customers.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Clientes
						</Link>
					</div>
				</Stack>
				<Grid container spacing={4}>
					<Grid
						size={{
							lg: 12,
							xs: 12,
						}}
					>
						<Stack spacing={4}>
							<Card>
								<CardHeader
									subheader={
										<Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", paddingTop: 1 }}>
											<Chip icon={icon} label={label} size="small" variant="outlined" />
										</Stack>
									}
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Perfil"
								/>
								<PropertyList
									divider={<Divider />}
									orientation="vertical"
									sx={{ "--PropertyItem-padding": "12px 24px" }}
								>
									<CustomerEditForm customerToEdit={customer}></CustomerEditForm>
								</PropertyList>
							</Card>
						</Stack>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
