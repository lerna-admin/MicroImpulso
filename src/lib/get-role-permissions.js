import { dashboardConfig } from "@/config/dashboard";
import { ROLES } from "@/constants/roles";

export function getProtectedRoutes() {
	const routePermissions = {};

	for (const roleSection of dashboardConfig.navItems) {
		const role = roleSection.key;
		const normalizedRoles = [role.toLowerCase()];

		// Extender permisos: lo que ve GERENTE también lo ven ADMIN y SUPERADMIN (y, de momento, MARKETING)
		if (role === ROLES.GERENTE) {
			normalizedRoles.push("admin", "superadmin", "marketing");
		}

		for (const item of roleSection.items) {
			if (item.matcher?.type === "startsWith" && item.matcher.href) {
				const path = item.matcher.href;

				if (!routePermissions[path]) {
					routePermissions[path] = [];
				}

				for (const r of normalizedRoles) {
					if (!routePermissions[path].includes(r)) {
						routePermissions[path].push(r);
					}
				}
			}
		}
	}

	return routePermissions;
}

export function getFirstRolePath(role) {
	// Mapear roles nuevos a un bloque existente del menú
	let effectiveRole = role;

	if (role === "SUPERADMIN" || role === "ADMIN") {
		effectiveRole = ROLES.GERENTE;
	}

	if (role === "MARKETING") {
		// De momento, usar el menú de GERENTE para que tenga acceso a reportes;
		// más adelante se puede crear un bloque específico de marketing.
		effectiveRole = ROLES.GERENTE;
	}

	let section = dashboardConfig.navItems.find((item) => item.key === effectiveRole);

	// Fallback defensivo: si no encontramos sección, usar la primera disponible
	if (!section) {
		section = dashboardConfig.navItems[0];
	}

	const items = section?.items || [];
	if (!items.length) {
		return "/dashboard";
	}

	const first = items[0];
	return first.href ? first.href : first.items?.[0]?.href || "/dashboard";
}
