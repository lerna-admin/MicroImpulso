import { paths } from "@/paths";

export const ROLES = {
	GERENTE: "gerente",
	ADMIN: "admin",
	AGENTE: "agente",
};

export const rolePages = {
	[ROLES.GERENTE]: [
		paths.dashboard,
		paths.dashboard.overview,
		paths.dashboard.analytics,
		paths.dashboard.reports,
		paths.dashboard.configuration,
		paths.dashboard.requests.list,
		paths.dashboard.customers.list,
		paths.dashboard.employees,
	],
	[ROLES.ADMIN]: [
		paths.dashboard,
		paths.dashboard.customers.list,
		paths.dashboard.employees,
		paths.dashboard.applications,
	],
	[ROLES.AGENTE]: [paths.dashboard, paths.dashboard.chat.base],
};
