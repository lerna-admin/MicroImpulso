import * as React from "react";
import RouterLink from "next/link";
import { getAllBranches } from "@/app/dashboard/requests/hooks/use-branches";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { getUser } from "@/lib/custom-auth/server";
import { getAllConfigParams } from "@/hooks/use-config.js";
import { UserCreateForm } from "@/components/dashboard/users/user-create-form";

export const metadata = { title: `Crear | Usuarios | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const {
		data: { user: userLogged },
	} = await getUser();
	const branches = await getAllBranches();

	const configParams = await getAllConfigParams();

	const rolesAllowed = new Set(["ADMIN", "AGENT", "CENTRAL", "MANAGER"]);

	const roles = configParams.filter(({ key }) => rolesAllowed.has(key));

	const rolesFiltered = roles.filter((role) => {
		if (userLogged.role === "ADMIN") {
			return role.key === "AGENT";
		}
		return role;
	});

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
							href={paths.dashboard.users.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Usuarios
						</Link>
					</div>
				</Stack>
				<UserCreateForm roles={rolesFiltered} branches={branches} userLogged={userLogged} />
			</Stack>
		</Box>
	);
}
