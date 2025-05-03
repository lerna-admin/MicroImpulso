import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ListChecks as ListChecksIcon } from "@phosphor-icons/react/dist/ssr/ListChecks";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { Warning as WarningIcon } from "@phosphor-icons/react/dist/ssr/Warning";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { AppChat } from "@/components/dashboard/overview/app-chat";
import { AppLimits } from "@/components/dashboard/overview/app-limits";
import { AppUsage } from "@/components/dashboard/overview/app-usage";
import { Events } from "@/components/dashboard/overview/events";
import { Subscriptions } from "@/components/dashboard/overview/subscriptions";
import { Summary } from "@/components/dashboard/overview/summary";

export const metadata = { title: `Resumen | Dashboard | ${appConfig.name}` };

export default function Page() {
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
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Resumen</Typography>
					</Box>
				</Stack>
				<Grid container spacing={4}>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Summary amount={67} diff={15} icon={ListChecksIcon} title="No pagados" trend="up" />
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Summary amount={67} diff={5} icon={UsersIcon} title="Mora > 15" trend="down" />
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Summary amount={0} diff={12} icon={WarningIcon} title="Creditos Rechazados" trend="up" />
					</Grid>
					<Grid
						size={{
							md: 8,
							xs: 12,
						}}
					>
						<AppUsage
							data={[
								{ name: "Ene", v1: 36, v2: 19 },
								{ name: "Feb", v1: 45, v2: 23 },
								{ name: "Mar", v1: 26, v2: 12 },
								{ name: "Abr", v1: 39, v2: 20 },
								{ name: "May", v1: 26, v2: 12 },
								{ name: "Jun", v1: 42, v2: 31 },
								{ name: "Jul", v1: 38, v2: 19 },
								{ name: "Ago", v1: 39, v2: 20 },
								{ name: "Sep", v1: 37, v2: 18 },
								{ name: "Oct", v1: 41, v2: 22 },
								{ name: "Nov", v1: 45, v2: 24 },
								{ name: "Dec", v1: 23, v2: 17 },
							]}
						/>
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Subscriptions
							subscriptions={[
								{
									id: "cav",
									title: "Carlos Alonso Villa",
									icon: "/assets/avatar-default.png",
									costs: "$500.000",
									billingCycle: "",
									status: "aprobado",
								},
								{
									id: "jg",
									title: "Jose Gomez",
									icon: "/assets/avatar-default.png",
									costs: "$1.500.000",
									billingCycle: "",
									status: "pendiente",
								},
								{
									id: "fb",
									title: "Fabio Belalcazar",
									icon: "/assets/avatar-default.png",
									costs: "$200.000",
									billingCycle: "",
									status: "cancelado",
								},
								{
									id: "tm",
									title: "Thomas Miller",
									icon: "/assets/avatar-default.png",
									costs: "$300.000",
									billingCycle: "",
									status: "aprobado",
								},
								{
									id: "jp",
									title: "Joel Pastrana",
									icon: "/assets/avatar-default.png",
									costs: "$700.000",
									billingCycle: "",
									status: "aprobado",
								},
							]}
						/>
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<AppChat
							messages={[
								{
									id: "MSG-001",
									content: "",
									author: { name: "Alcides Antonio", avatar: "/assets/avatar-default.png" },
									createdAt: dayjs().subtract(2, "minute").toDate(),
									pendings: 13,
								},
								{
									id: "MSG-002",
									content: "",
									author: { name: "Marcus Finn", avatar: "/assets/avatar-default.png" },
									createdAt: dayjs().subtract(56, "minute").toDate(),
									pendings: 3,
								},
								{
									id: "MSG-003",
									content: "",
									author: { name: "Carson Darrin", avatar: "/assets/avatar-default.png" },
									createdAt: dayjs().subtract(3, "hour").subtract(23, "minute").toDate(),
									pendings: 8,
								},
								{
									id: "MSG-004",
									content: "",
									author: { name: "Fran Perez", avatar: "/assets/avatar-default.png" },
									createdAt: dayjs().subtract(8, "hour").subtract(6, "minute").toDate(),
									pendings: 1,
								},
								{
									id: "MSG-005",
									content: "",
									author: { name: "Jie Yan", avatar: "/assets/avatar-default.png" },
									createdAt: dayjs().subtract(10, "hour").subtract(18, "minute").toDate(),
									pendings: 5,
								},
							]}
						/>
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Events
							events={[
								{
									id: "EV-004",
									title: "Carlos Alonso Villa",
									description: "Bisemanal",
									createdAt: dayjs(new Date(2025, 3, 21)),
								},
								{
									id: "EV-003",
									title: "Jose Gomez",
									description: "5 - 20",
									createdAt: dayjs(new Date(2025, 4, 5)),
								},
								{
									id: "EV-002",
									title: "Fabio Belalcazar",
									description: "10 - 25",
									createdAt: dayjs(new Date(2025, 5, 10)),
								},
								{
									id: "EV-001",
									title: "Thomas Miller",
									description: "15 - 30",
									createdAt: dayjs(new Date(2025, 5, 15)),
								},
							]}
						/>
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<AppLimits usage={70} />
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
