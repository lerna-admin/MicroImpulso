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
import { LoanRequestsByBranches } from "@/components/dashboard/analytics/loan-requests-by-branches";
import { AppChat } from "@/components/dashboard/overview/app-chat";
import { AppLimits } from "@/components/dashboard/overview/app-limits";
import { Events } from "@/components/dashboard/overview/events";
import { LoanRequestsByYear } from "@/components/dashboard/overview/loan-requests-by-year";
import { Subscriptions } from "@/components/dashboard/overview/subscriptions";
import { Summary } from "@/components/dashboard/overview/summary";

import {
	getRequestsStatsBranchesCurrentMonth,
	getRequestsStatsBranchesMonthlyHistory,
	getRequestsStatsClientsSummary,
} from "./hooks/use-stats";

export const metadata = { title: `Resumen | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const reqStatsBranchesCurMonth = await getRequestsStatsBranchesCurrentMonth();
	const reqStatsMonthHistory = await getRequestsStatsBranchesMonthlyHistory();
	const { notPaid, critical, lateOver15 } = await getRequestsStatsClientsSummary();

	const requestsByBranches = reqStatsBranchesCurMonth.map((branch) => {
		return {
			name: branch.branchName,
			v1: branch.totalRequests,
			v2: branch.statusCounts.funded === undefined ? 0 : branch.statusCounts["funded"],
		};
	});

	const requestsByYear = generateMonthlyOverview(reqStatsMonthHistory);

	const { growth, difference } = calculateFundedGrowth(reqStatsMonthHistory);

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
						<Summary
							title="No pagados"
							amount={notPaid.count}
							diff={notPaid.variation.percentage}
							icon={UsersIcon}
							trend={notPaid.variation.type}
						/>
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Summary
							title="Mora > 15"
							amount={lateOver15.count}
							diff={lateOver15.variation.percentage}
							icon={UsersIcon}
							trend={lateOver15.variation.type}
						/>
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<Summary
							title="Criticos"
							amount={critical.count}
							diff={critical.variation.percentage}
							icon={UsersIcon}
							trend={critical.variation.type}
						/>
					</Grid>
					<Grid
						size={{
							md: 6,
							xs: 12,
						}}
					>
						<LoanRequestsByBranches data={requestsByBranches} />
					</Grid>
					<Grid
						size={{
							md: 6,
							xs: 12,
						}}
					>
						<LoanRequestsByYear data={requestsByYear} growth={growth} difference={difference} />
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

const generateMonthlyOverview = (data) => {
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const currentYear = new Date().getFullYear().toString();
	const previousYear = (new Date().getFullYear() - 1).toString();

	const result = monthNames.map((monthName, index) => {
		const monthNumber = (index + 1).toString().padStart(2, "0");

		const dataPrevYear = data.find((d) => d.month === `${previousYear}-${monthNumber}`);
		const dataCurrYear = data.find((d) => d.month === `${currentYear}-${monthNumber}`);

		const fundedCurrentYear = dataCurrYear?.data?.reduce((sum, item) => sum + (item.statusCounts?.funded || 0), 0) || 0;
		const fundedPreviousYear =
			dataPrevYear?.data?.reduce((sum, item) => sum + (item.statusCounts?.funded || 0), 0) || 0;

		return {
			name: monthName,
			v1: fundedCurrentYear,
			v2: fundedPreviousYear,
		};
	});

	return result;
};

const calculateFundedGrowth = (data) => {
	let totalPreviousYear = 0;
	let totalCurrentYear = 0;

	for (const month of data) {
		const year = month.month.split("-")[0];
		const fundedThisMonth = month.data.reduce((sum, item) => sum + (item.statusCounts?.funded || 0), 0);

		if (year === "2024") {
			totalPreviousYear += fundedThisMonth;
		} else if (year === "2025") {
			totalCurrentYear += fundedThisMonth;
		}
	}

	const difference = totalCurrentYear - totalPreviousYear;

	let growth = 0;
	if (totalPreviousYear > 0) {
		growth = (difference / totalPreviousYear) * 100;
	} else if (totalCurrentYear > 0) {
		growth = 100;
	}

	return {
		difference,
		growth: Math.round(growth),
	};
};
