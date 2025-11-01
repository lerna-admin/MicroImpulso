// MicroImpulso/src/app/dashboard/configuration/branch-managment/page.jsx
import * as React from "react";
import { Alert, Card, Chip, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { BranchesTable } from "@/components/dashboard/configuration/branches-table";
import { getAllBranches } from "./hooks/use-branches";

export const metadata = { title: `Gestión de sedes | Dashboard | ${appConfig.name}` };

export default async function Page() {
  let data = [];
  let error = null;

  try {
    data = await getAllBranches();
  } catch (e) {
    error = e?.message ?? "Error al cargar las sedes.";
  }

  const total = data?.length ?? 0;
  const aceptaEntrantes = Array.isArray(data)
    ? data.filter((d) => d.acceptsInbound).length
    : 0;

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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ alignItems: "flex-start" }}
        >
          <Box sx={{ flex: "1 1 auto" }}>
            <Typography variant="h4">Gestión de sedes</Typography>
            <Typography variant="body2" color="text.secondary">
              Administra la configuración de las sedes y visualiza país, indicativo,
              administrador y más.
            </Typography>
          </Box>

          {/* Resumen rápido */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            <Chip color="primary" variant="outlined" label={`Total: ${total}`} />
            <Chip
              color="success"
              variant="outlined"
              label={`Aceptan entrantes: ${aceptaEntrantes}`}
            />
          </Stack>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Card>
          {total === 0 ? (
            <Box p={4}>
              <Typography variant="subtitle1" gutterBottom>
                No hay sedes para mostrar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cuando registres sedes en el sistema aparecerán aquí con su información.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Tip: asegúrate de que el endpoint <code>/branches</code> incluya{" "}
                <i>administrator</i> y <i>agents</i> en las relaciones.
              </Typography>
            </Box>
          ) : (
            <BranchesTable rows={data} />
          )}
        </Card>
      </Stack>
    </Box>
  );
}
