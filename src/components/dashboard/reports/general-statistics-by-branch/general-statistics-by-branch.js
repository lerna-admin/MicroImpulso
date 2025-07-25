"use client";

import * as React from "react";
import { Stack, Typography } from "@mui/material";

export function GeneralStatisticsByBranch({ data, user }) {
    return (
        <Stack spacing={4}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
                <Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
                    Estadísticas Generales por Sede
                </Typography>
            </Stack>
        </Stack>
    );
}
