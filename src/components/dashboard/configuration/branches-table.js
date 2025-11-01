"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

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

/** Convierte array de indicativos a string CSV (+57,+506). */
function callingCodesToCsv(cc) {
  const arr = normalizeCallingCodes(cc);
  return arr.length ? arr.map((x) => `+${x}`).join(",") : "";
}

export function BranchesTable({ rows = [] }) {
  // Estado local para permitir edición inmediata sin recargar
  const [data, setData] = React.useState(Array.isArray(rows) ? rows : []);
  React.useEffect(() => {
    setData(Array.isArray(rows) ? rows : []);
  }, [rows]);

  // Modal de edición
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, severity: "success", msg: "" });

  const [form, setForm] = React.useState({
    id: null,
    name: "",
    countryName: "",
    countryCode: "",
    callingCodesCsv: "",
    acceptsInbound: true,
    isActive: true,
  });

  const handleEdit = (row) => {
    setForm({
      id: row?.id ?? null,
      name: row?.name ?? "",
      countryName: row?.countryName ?? "",
      countryCode: row?.countryCode ?? "",
      callingCodesCsv: callingCodesToCsv(row?.callingCodes),
      acceptsInbound: !!row?.acceptsInbound,
      isActive: row?.isActive !== false,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (field) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validaciones mínimas
    if (!form.id) {
      setToast({ open: true, severity: "error", msg: "ID de sede inválido." });
      return;
    }
    if (!form.name.trim()) {
      setToast({ open: true, severity: "error", msg: "El nombre es obligatorio." });
      return;
    }
    if (!form.countryCode.trim() || form.countryCode.trim().length !== 2) {
      setToast({ open: true, severity: "error", msg: "El código de país debe ser de 2 letras (ISO 3166-1 alpha-2)." });
      return;
    }

    const payload = {
      name: form.name.trim(),
      countryName: form.countryName.trim(),
      countryCode: form.countryCode.trim().toUpperCase(),
      callingCodes: normalizeCallingCodes(form.callingCodesCsv),
      acceptsInbound: !!form.acceptsInbound,
      isActive: !!form.isActive,
    };

    try {
      setSaving(true);
      const res = await fetch(`/api/branches/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.message || `Error ${res.status}`);
      }

      const updated = await res.json();

      // Reflejar cambios en la tabla
      setData((prev) =>
        prev.map((row) => (row.id === form.id ? { ...row, ...updated } : row))
      );

      setToast({ open: true, severity: "success", msg: "Sede actualizada correctamente." });
      setOpen(false);
    } catch (e) {
      setToast({ open: true, severity: "error", msg: e?.message || "Error al guardar." });
    } finally {
      setSaving(false);
    }
  };

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
    {
      name: "Acciones",
      width: "140px",
      align: "center",
      formatter: (row) => (
        <Button size="small" variant="outlined" onClick={() => handleEdit(row)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <React.Fragment>
      {/* Contenedor con scroll horizontal para evitar cortes */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box sx={{ minWidth: 1200 }}>
          <DataTable columns={columns} rows={data} />
        </Box>
      </Box>

      {(!data || data.length === 0) && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            No se encontraron sedes
          </Typography>
        </Box>
      )}

      {/* Modal Edición */}
      <Dialog open={open} onClose={saving ? undefined : handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Editar sede</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={handleChange("name")}
              fullWidth
              required
            />
            <TextField
              label="País (nombre)"
              value={form.countryName}
              onChange={handleChange("countryName")}
              fullWidth
            />
            <TextField
              label="Código país (ISO 3166-1 alpha-2, ej: CO)"
              value={form.countryCode}
              onChange={handleChange("countryCode")}
              fullWidth
              inputProps={{ maxLength: 2, style: { textTransform: "uppercase" } }}
              helperText="Debe tener 2 letras. Se usa para la bandera y validaciones."
            />
            <TextField
              label="Indicativos (CSV) ej: +57,+506"
              value={form.callingCodesCsv}
              onChange={handleChange("callingCodesCsv")}
              fullWidth
              helperText="Separados por coma. Se normalizan al guardar."
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.acceptsInbound}
                  onChange={handleChange("acceptsInbound")}
                />
              }
              label="Acepta mensajes entrantes"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={handleChange("isActive")}
                />
              }
              label="Sede activa"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} /> : null}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

/** Intenta parsear JSON sin lanzar excepción. */
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
