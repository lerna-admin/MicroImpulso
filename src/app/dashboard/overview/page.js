import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { CurrencyCircleDollar as CurrencyIcon } from "@phosphor-icons/react/dist/ssr/CurrencyCircleDollar";
import { GlobeHemisphereWest as GlobeIcon } from "@phosphor-icons/react/dist/ssr/GlobeHemisphereWest";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { getUser } from "@/lib/custom-auth/server";
import { LoanRequestsByBranches } from "@/components/dashboard/analytics/loan-requests-by-branches";
import { AgentsByUndisbursed } from "@/components/dashboard/overview/agents-by-undisbursed";
import { AppLimits } from "@/components/dashboard/overview/app-limits";
import { NextPayments } from "@/components/dashboard/overview/next-payments";
import { LatestRequests } from "@/components/dashboard/overview/latest-requests";
import { LoanRequestsByYear } from "@/components/dashboard/overview/loan-requests-by-year";
import { Summary } from "@/components/dashboard/overview/summary";
import { SuperadminCountriesOverview } from "@/components/dashboard/overview/superadmin-countries-overview";

import {
	getManagerSummary,
	getRequestsStatsBranchesCurrentMonth,
	getRequestsStatsBranchesMonthlyHistory,
	getRequestsStatsClientsSummary,
} from "./hooks/use-stats";
import { getSuperadminOverview } from "./hooks/use-superadmin-overview";

export const metadata = { title: `Resumen | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const {
		data: { user },
	} = await getUser();

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

	const { latestRequests, topAgentsByUndisbursed, upcomingPayments } = await getManagerSummary();
	const latestRequestsFormatted = latestRequests.map((item) => ({
		id: item.id,
		name: item.client.name,
		amount: item.amount,
		status: item.status,
	}));
	
	const topAgentsByUndisbursedFormatted = topAgentsByUndisbursed.map((item) => ({
		id: item.agentId,
		name: item.agentName,
		pendings: item.undisbursedCount,
	}));

	const upcomingPaymentsFormatted = upcomingPayments.map((item) => ({
		id: item.loanRequestId,
		name: item.clientName,
		typePayment: item.type,
		endDateAt: item.endDateAt,
	}));

	const requestsByYear = generateMonthlyOverview(reqStatsMonthHistory);

	const { growth, difference } = calculateFundedGrowth(reqStatsMonthHistory);

	let superSummary = null;
	if (user.role === "SUPERADMIN") {
		const today = dayjs().format("YYYY-MM-DD");
		superSummary = await getSuperadminOverview({ userId: user.id, startDate: dayjs().startOf("month").format("YYYY-MM-DD"), endDate: today });
	}

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
						<Typography variant="h4">
							{user.role === "SUPERADMIN" ? "Resumen Global (Superadmin)" : "Resumen"}
						</Typography>
					</Box>
				</Stack>
				<Grid container spacing={4}>
					{superSummary ? (
						<>
							<Grid
								size={{
									md: 3,
									xs: 12,
								}}
							>
								<Summary
									title="Cartera activa global"
									amount={superSummary.totals.activeLoanAmount}
									diff={0}
									icon={CurrencyIcon}
									trend={"increase"}
									requireTrend={false}
								/>
							</Grid>
							<Grid
								size={{
									md: 3,
									xs: 12,
								}}
							>
								<Summary
									title="Clientes activos (global)"
									amount={superSummary.totals.activeClientsCount}
									diff={0}
									icon={UsersIcon}
									trend={"increase"}
									requireTrend={false}
								/>
							</Grid>
							<Grid
								size={{
									md: 3,
									xs: 12,
								}}
							>
								<Summary
									title="Monto desembolsado (periodo)"
									amount={superSummary.totals.disbursedAmount}
									diff={0}
									icon={CurrencyIcon}
									trend={"increase"}
									requireTrend={false}
								/>
							</Grid>
							<Grid
								size={{
									md: 3,
									xs: 12,
								}}
							>
								<Summary
									title="Tasa de mora global"
									amount={Math.round((superSummary.totals.delinquencyRate || 0) * 100)}
									diff={0}
									icon={GlobeIcon}
									trend={"increase"}
									requireTrend={false}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<SuperadminCountriesOverview data={superSummary.byCountry} />
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<TableContainer component={Paper}>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell>País</TableCell>
												<TableCell align="right">Cartera activa</TableCell>
												<TableCell align="right">Clientes activos</TableCell>
												<TableCell align="right">Préstamos activos</TableCell>
												<TableCell align="right">Desembolsado (período)</TableCell>
												<TableCell align="right">Cobrado (período)</TableCell>
												<TableCell align="right">Mora %</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{superSummary.byCountry.map((row) => (
												<TableRow key={row.countryId ?? row.countryName ?? "unknown"}>
													<TableCell component="th" scope="row">
														{row.countryName ?? "Sin país"}
													</TableCell>
													<TableCell align="right">
														{new Intl.NumberFormat("es-CO", {
															style: "currency",
															currency: "COP",
															minimumFractionDigits: 0,
														}).format(row.activeLoanAmount)}
													</TableCell>
													<TableCell align="right">
														{new Intl.NumberFormat("en-US").format(row.activeClientsCount)}
													</TableCell>
													<TableCell align="right">
														{new Intl.NumberFormat("en-US").format(row.activeLoansCount)}
													</TableCell>
													<TableCell align="right">
														{new Intl.NumberFormat("es-CO", {
															style: "currency",
															currency: "COP",
															minimumFractionDigits: 0,
														}).format(row.disbursedAmount)}
													</TableCell>
													<TableCell align="right">
														{new Intl.NumberFormat("es-CO", {
															style: "currency",
															currency: "COP",
															minimumFractionDigits: 0,
														}).format(row.repaidAmount)}
													</TableCell>
													<TableCell align="right">
														{`${Math.round((row.delinquencyRate || 0) * 100)}%`}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
						</>
					) : null}
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
						<LatestRequests subscriptions={latestRequestsFormatted} />
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<AgentsByUndisbursed agents={topAgentsByUndisbursedFormatted} />
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						<NextPayments payments={upcomingPaymentsFormatted} />
					</Grid>
					<Grid
						size={{
							md: 4,
							xs: 12,
						}}
					>
						{/* <AppLimits usage={70} /> Por ahora se oculta */}
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
