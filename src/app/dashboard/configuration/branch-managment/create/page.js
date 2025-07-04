import * as React from "react";
import RouterLink from "next/link";
import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { BranchCreateForm } from "@/components/dashboard/configuration/branch-create-form";

export const metadata = { title: `Crear sede | Dashboard | ${appConfig.name}` };

export default async function Page() {
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
							href={paths.dashboard.configuration.branchManagment.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Sedes
						</Link>
					</div>
				</Stack>
				<BranchCreateForm />
			</Stack>
		</Box>
	);
}
