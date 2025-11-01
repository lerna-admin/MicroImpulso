// MicroImpulso/src/app/dashboard/configuration/branch-managment/create/page.js

import * as React from "react";
import RouterLink from "next/link";
import { Link, Card, Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { BranchCreateForm } from "@/components/dashboard/configuration/branch-create-form";

export const metadata = { title: `Crear sede | Dashboard | ${appConfig.name}` };

/** Diccionario de países (puedes ampliar libremente). */
const COUNTRIES = [
  {
    iso2: "CO",
    name: "Colombia",
    callingCodes: ["+57"],
    timezones: ["America/Bogota"],
    samplePrefixes: ["+57"],
  },
  {
    iso2: "CR",
    name: "Costa Rica",
    callingCodes: ["+506"],
    timezones: ["America/Costa_Rica"],
    samplePrefixes: ["+506"],
  },
  {
    iso2: "MX",
    name: "México",
    callingCodes: ["+52"],
    timezones: ["America/Mexico_City", "America/Monterrey", "America/Tijuana"],
    samplePrefixes: ["+52"],
  },
  {
    iso2: "PE",
    name: "Perú",
    callingCodes: ["+51"],
    timezones: ["America/Lima"],
    samplePrefixes: ["+51"],
  },
  {
    iso2: "CL",
    name: "Chile",
    callingCodes: ["+56"],
    timezones: ["America/Santiago"],
    samplePrefixes: ["+56"],
  },
  {
    iso2: "US",
    name: "Estados Unidos",
    callingCodes: ["+1"],
    timezones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"],
    samplePrefixes: ["+1"],
  },
];

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

          <Typography variant="h4">Crear sede</Typography>

          <Card sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              El país define <b>indicativo</b>, <b>prefijos sugeridos</b> y <b>zona horaria</b> por defecto (puedes editarlos).
            </Alert>
            {/* Pasamos el diccionario de países al formulario */}
            <BranchCreateForm countries={COUNTRIES} />
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
