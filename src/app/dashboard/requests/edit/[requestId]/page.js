import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { getUser } from "@/lib/custom-auth/server";
import { RequestEditForm } from "@/components/dashboard/request/request-edit-form";

import { getRequestById } from "../../hooks/use-requests";

export const metadata = { title: `Editar | Solicitud | Dashboard | ${appConfig.name}` };

export default async function Page({ params }) {
	const { requestId } = params;
	const { id, amount, paymentDay, type, endDateAt, client, agent } = await getRequestById(requestId);

	const {
		data: { user },
	} = await getUser();
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
							href={paths.dashboard.requests.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Solicitudes
						</Link>
					</div>
				</Stack>
				<RequestEditForm user={user} dataRequest={{ id, amount, paymentDay, type, endDateAt, client, agent }} />
			</Stack>
		</Box>
	);
}
