"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";

dayjs.locale("es");

/** Convierte un código de país (alpha-2) en bandera emoji. */
function flagFromCountryCode(code) {
  if (!code || typeof code !== "string") return "🌐";
  try {
    const cc = code.trim().toUpperCase();
    if (cc.length !== 2) return "🌐";
    const A = 0x1f1e6; // base regional indicator
    return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65));
  } catch {
    return "🌐";
  }
}

/** Formatea fecha segura. */
function fmtDate(value) {
  if (!value) return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format("YYYY-MM-DD HH:mm") : String(value);
}

/** Normaliza callingCodes a array de strings sin '+' duplicado. */
function normalizeCallingCodes(cc) {
  if (Array.isArray(cc)) return cc.map((v) => String(v).replace(/^\+/, "")).filter(Boolean);
  if (typeof cc === "string" && cc.trim().length) {
    return cc.split(",").map((v) => v.trim().replace(/^\+/, "")).filter(Boolean);
  }
  return [];
}

export function BranchesTable({ rows = [] }) {
  const columns = [
    {
      name: "#",
      width: "60px",
      align: "center",
      formatter: (row) => (
        <Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
          <Typography color="text.secondary" variant="body2">
            {row?.id ?? "—"}
          </Typography>
        </Stack>
      ),
    },
    {
      name: "Nombre",
      width: "220px",
      formatter: (row) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="subtitle2">{row?.name ?? "—"}</Typography>
        </Stack>
      ),
    },
    {
      name: "País",
      width: "220px",
      formatter: (row) => {
        const code = row?.countryCode;
        const name = row?.countryName;
        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>{flagFromCountryCode(code)}</span>
            <Stack>
              <Typography variant="body2">{name || "—"}</Typography>
              <Typography variant="caption" color="text.secondary">
                {code || "—"}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      name: "Indicativos",
      width: "260px",
      formatter: (row) => {
        const list = normalizeCallingCodes(row?.callingCodes);
        return list.length ? (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
            {list.map((cc, i) => (
              <Chip key={`${cc}-${i}`} size="small" label={`+${cc}`} />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="body2">—</Typography>
        );
      },
    },
    {
      name: "Entrantes",
      width: "120px",
      align: "center",
      formatter: (row) => (
        <Chip
          size="small"
          color={row?.acceptsInbound ? "success" : "default"}
          variant={row?.acceptsInbound ? "filled" : "outlined"}
          label={row?.acceptsInbound ? "Sí" : "No"}
        />
      ),
    },
    {
      name: "Estado",
      width: "120px",
      align: "center",
      formatter: (row) => (
        <Chip
          size="small"
          color={row?.isActive === false ? "default" : "primary"}
          variant={row?.isActive === false ? "outlined" : "filled"}
          label={row?.isActive === false ? "Inactiva" : "Activa"}
        />
      ),
    },
    {
      name: "Administrador",
      width: "220px",
      formatter: (row) => {
        const adminName = row?.administrator?.name || "—";
        const adminEmail = row?.administrator?.email || "";
        const content = <Typography variant="body2">{adminName}</Typography>;
        return adminEmail ? <Tooltip title={adminEmail}>{content}</Tooltip> : content;
      },
    },
    {
      name: "Agentes",
      width: "100px",
      align: "right",
      formatter: (row) => {
        const count = Array.isArray(row?.agents) ? row.agents.length : (row?.agentsCount ?? 0);
        return <Typography variant="body2">{count}</Typography>;
      },
    },
    {
      name: "Creada",
      width: "160px",
      align: "center",
      formatter: (row) => (
        <Typography color="inherit" variant="body2">
          {fmtDate(row?.createdAt)}
        </Typography>
      ),
    },
    {
      name: "Actualizada",
      width: "160px",
      align: "center",
      formatter: (row) => (
        <Typography color="inherit" variant="body2">
          {fmtDate(row?.updatedAt)}
        </Typography>
      ),
    },
  ];

  return (
    <React.Fragment>
      <DataTable columns={columns} rows={Array.isArray(rows) ? rows : []} />
      {(!rows || rows.length === 0) && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            No se encontraron sedes
          </Typography>
        </Box>
      )}
    </React.Fragment>
  );
}
