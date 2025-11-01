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

/** Emoji de bandera a partir de ISO-2 */
function flagFromCountryCode(code) {
  if (!code || typeof code !== "string") return "🌐";
  try {
    const cc = code.trim().toUpperCase();
    if (cc.length !== 2) return "🌐";
    const A = 0x1f1e6;
    return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65));
  } catch {
    return "🌐";
  }
}

function fmtDate(value) {
  if (!value) return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format("YYYY-MM-DD HH:mm") : String(value);
}

export function BranchesTable({ rows = [] }) {
  // estado local para reflejar cambios sin recargar
  const [data, setData] = React.useState(Array.isArray(rows) ? rows : []);
  React.useEffect(() => {
    setData(Array.isArray(rows) ? rows : []);
  }, [rows]);

  // modal edición
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, severity: "success", msg: "" });

  // formulario: usar NOMBRES que tu backend espera
  const [form, setForm] = React.useState({
    id: null,
    name: "",
    countryIso2: "",
    phoneCountryCode: "",
    acceptsInbound: true,
    // isActive no existe en la entidad, lo dejamos visual sin enviar
    isActive: true,
  });

  const handleEdit = (row) => {
    setForm({
      id: row?.id ?? null,
      name: row?.name ?? "",
      countryIso2: (row?.countryIso2 || row?.countryCode || "").toUpperCase(),
      phoneCountryCode: String(row?.phoneCountryCode ?? "").replace(/[^\d]/g, ""),
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
    // validaciones mínimas
    if (!form.id) {
      setToast({ open: true, severity: "error", msg: "ID de sede inválido." });
      return;
    }
    if (!form.name.trim()) {
      setToast({ open: true, severity: "error", msg: "El nombre es obligatorio." });
      return;
    }
    const iso = form.countryIso2.trim().toUpperCase();
    if (iso.length !== 2) {
      setToast({
        open: true,
        severity: "error",
        msg: "El código de país debe ser ISO-2 (2 letras).",
      });
      return;
    }
    const phoneCode = String(form.phoneCountryCode).replace(/[^\d]/g, "");
    if (!phoneCode) {
      setToast({
        open: true,
        severity: "error",
        msg: "El indicativo telefónico del país es obligatorio (solo dígitos).",
      });
      return;
    }

    // payload EXACTO que espera tu backend/entidad
    const payload = {
      name: form.name.trim(),
      countryIso2: iso,
      phoneCountryCode: phoneCode,
      acceptsInbound: !!form.acceptsInbound,
      // NO enviar isActive porque tu entidad no lo tiene
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

      // reflejar cambios localmente
      setData((prev) => prev.map((row) => (row.id === form.id ? { ...row, ...updated } : row)));

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
      width: "180px",
      formatter: (row) => {
        const iso = (row?.countryIso2 || row?.countryCode || "").toUpperCase();
        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>{flagFromCountryCode(iso)}</span>
            <Typography variant="body2">{iso || "—"}</Typography>
          </Stack>
        );
      },
    },
    {
      name: "Indicativo",
      width: "130px",
      align: "center",
      formatter: (row) => (
        <Chip size="small" label={row?.phoneCountryCode ? `+${row.phoneCountryCode}` : "—"} />
      ),
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
      {/* Scroll horizontal para evitar cortes */}
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
              label="Código país (ISO-2, ej: CO)"
              value={form.countryIso2}
              onChange={handleChange("countryIso2")}
              fullWidth
              inputProps={{ maxLength: 2, style: { textTransform: "uppercase" } }}
              helperText="Debe tener 2 letras (ISO 3166-1 alpha-2)."
            />
            <TextField
              label="Indicativo del país (solo dígitos, ej: 57)"
              value={form.phoneCountryCode}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phoneCountryCode: e.target.value.replace(/[^\d]/g, "") }))
              }
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch checked={form.acceptsInbound} onChange={handleChange("acceptsInbound")} />
              }
              label="Acepta mensajes entrantes"
            />
            {/* isActive visible si te sirve, pero NO se envía al backend */}
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={handleChange("isActive")} />}
              label="Sede activa (visual)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
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

/** Parseo seguro de JSON en errores */
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
