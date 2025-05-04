"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { signInWithApi } from "@/lib/custom-auth/actions";
import { useAuth } from "@/components/auth/custom/auth-context";
import { DynamicLogo } from "@/components/core/logo";

const schema = zod.object({
  document: zod.string().min(1, { message: "Usuario es obligatorio." }),
  password: zod.string().min(1, { message: "Contraseña es obligatoria." }),
});

const defaultValues = { document: "", password: "" };

export function SignInForm() {
  const router = useRouter();
  const auth = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values) => {
      console.log("submit", values);
      setIsPending(true);

      const { data, error } = await signInWithApi(values);
      console.log("data:", data);

      if (error) {
        setError("root", { type: "server", message: error });
        setIsPending(false);
        return;
      }

      auth.setUser(data?.user || null); // Puedes ajustar esto si devuelves un usuario
      router.push("/dashboard"); // Redirige al dashboard
    },
    [auth, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader
          subheader={
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ display: "inline-flex", textDecoration: "none" }}>
                <DynamicLogo colorDark="light" colorLight="dark" height={73} width={73} />
                <Typography variant="body2" fontWeight="bold" fontSize={23}>
                  Microimpulso
                </Typography>
              </Box>
            </div>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Controller
                  control={control}
                  name="document"
                  render={({ field }) => (
                    <FormControl>
                      <InputLabel>Documento</InputLabel>
                      <OutlinedInput {...field} label="Documento" />
                      {errors.document && <FormHelperText>{errors.document.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.password)}>
                      <InputLabel>Contraseña</InputLabel>
                      <OutlinedInput
                        {...field}
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          showPassword ? (
                            <EyeIcon
                              cursor="pointer"
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <EyeSlashIcon
                              cursor="pointer"
                              onClick={() => setShowPassword(true)}
                            />
                          )
                        }
                      />
                      {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                <Button disabled={isPending} type="submit" variant="contained">
                  Iniciar sesión
                </Button>
              </Stack>
            </form>
            <div>
              <Link variant="subtitle2">¿Olvidaste la contraseña?</Link>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
