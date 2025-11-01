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

/* ======================= Diccionarios de soporte ======================= */
// Nombre → ISO-2
const COUNTRY_NAME_TO_ISO2 = {
  "COLOMBIA": "CO",
  "COSTA RICA": "CR",
  "MÉXICO": "MX",
  "MEXICO": "MX",
  "PERÚ": "PE",
  "PERU": "PE",
  "CHILE": "CL",
  "ARGENTINA": "AR",
  "ECUADOR": "EC",
  "PANAMÁ": "PA",
  "PANAMA": "PA",
  // agrega los que necesites
};

// Indicativo telefónico → ISO-2 (por si solo llega el code)
const PHONE_CODE_TO_ISO2 = {
  "57": "CO",
  "506": "CR",
  "52": "MX",
  "51": "PE",
  "56": "CL",
  "54": "AR",
  "593": "EC",
  "507": "PA",
};

/* ======================= Helpers de normalización ======================= */
const cleanIso2 = (v) => (typeof v === "string" ? v.trim().toUpperCase() : "");
const cleanName = (v) => (typeof v === "string" ? v.trim() : "");
const cleanPhoneCode = (v) =>
  v == null ? "" : String(v).replace(/[^\d]/g, "").trim();

/** Intenta deducir ISO-2 con varias fuentes. Devuelve { iso, source } */
function deriveIso(row) {
  // 1) countryIso2 directo
  let iso = cleanIso2(row?.countryIso2);
  if (iso.length === 2) return { iso, source: "countryIso2" };

  // 2) countryCode (compat)
  iso = cleanIso2(row?.countryCode);
  if (iso.length === 2) return { iso, source: "countryCode" };

  // 3) nombre del país
  const name = cleanName(row?.countryName);
  if (name) {
    const mapped = COUNTRY_NAME_TO_ISO2[name.toUpperCase()];
    if (mapped) return { iso: mapped, source: "countryName" };
  }

  // 4) phoneCountryCode
  const phone = cleanPhoneCode(row?.phoneCountryCode);
  if (phone && PHONE_CODE_TO_ISO2[phone]) {
    return { iso: PHONE_CODE_TO_ISO2[phone], source: "phoneCountryCode" };
  }

  return { iso: "", source: "unknown" };
}

/** Deriva el nombre a mostrar (si viene del backend) o el ISO si no hay nombre */
function deriveDisplayName(row, iso) {
  const name = cleanName(row?.countryName);
  if (name) return name;
  return iso || "—";
}

/** Bandera emoji desde ISO-2 */
function flagFromIso2(code) {
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

/* ======================= Componente ======================= */
export function BranchesTable({ rows = [] }) {
  const [data, setData] = React.useState(Array.isArray(rows) ? rows : []);
  React.useEffect(() => {
    setData(Array.isArray(rows) ? rows : []);
  }, [rows]);

  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, severity: "success", msg: "" });

  const [form, setForm] = React.useState({
    id: null,
    name: "",
    countryIso2: "",
    phoneCountryCode: "",
    acceptsInbound: true,
    // visual
    isActive: true,
  });

  const handleEdit = (row) => {
    const { iso } = deriveIso(row);
    setForm({
      id: row?.id ?? null,
      name: row?.name ?? "",
      countryIso2: iso,
      phoneCountryCode: cleanPhoneCode(row?.phoneCountryCode),
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
    if (!form.id) {
      setToast({ open: true, severity: "error", msg: "ID de sede inválido." });
      return;
    }
    if (!form.name.trim()) {
      setToast({ open: true, severity: "error", msg: "El nombre es obligatorio." });
      return;
    }
    const iso = cleanIso2(form.countryIso2);
    if (iso.length !== 2) {
      setToast({ open: true, severity: "error", msg: "El código de país debe ser ISO-2 (2 letras)." });
      return;
    }
    const phoneCode = cleanPhoneCode(form.phoneCountryCode);
    if (!phoneCode) {
      setToast({ open: true, severity: "error", msg: "El indicativo del país es obligatorio (solo dígitos)." });
      return;
    }

    const payload = {
      name: form.name.trim(),
      countryIso2: iso,
      phoneCountryCode: phoneCode,
      acceptsInbound: !!form.acceptsInbound,
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
      width: "240px",
      formatter: (row) => {
        const { iso, source } = deriveIso(row);
        const display = deriveDisplayName(row, iso);
        const flag = flagFromIso2(iso);
        const debug = `ISO: ${iso || "—"} • Source: ${source}`;
        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Tooltip title={debug}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{flag}</span>
            </Tooltip>
            <Stack>
              <Typography variant="body2">{display}</Typography>
              <Typography variant="caption" color="text.secondary">
                {iso || "—"}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      name: "Indicativo",
      width: "130px",
      align: "center",
      formatter: (row) => (
        <Chip size="small" label={row?.phoneCountryCode ? `+${cleanPhoneCode(row.phoneCountryCode)}` : "—"} />
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
                setForm((prev) => ({ ...prev, phoneCountryCode: cleanPhoneCode(e.target.value) }))
              }
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={form.acceptsInbound} onChange={handleChange("acceptsInbound")} />}
              label="Acepta mensajes entrantes"
            />
            {/* isActive es solo visual */}
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
