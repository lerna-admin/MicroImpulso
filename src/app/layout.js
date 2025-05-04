import * as React from "react";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import "@/styles/global.css";

import { appConfig } from "@/config/app";
import { AuthStrategy } from "@/lib/auth-strategy";
import { getSettings as getPersistedSettings } from "@/lib/settings";
import { AuthProvider as CustomAuthProvider } from "@/components/auth/custom/auth-context";
import { Analytics } from "@/components/core/analytics";
import { EmotionCacheProvider } from "@/components/core/emotion-cache";
import { I18nProvider } from "@/components/core/i18n-provider";
import { LocalizationProvider } from "@/components/core/localization-provider";
import { Rtl } from "@/components/core/rtl";
import { SettingsProvider } from "@/components/core/settings/settings-context";
import { ThemeProvider } from "@/components/core/theme-provider";
import { Toaster } from "@/components/core/toaster";

export const metadata = { title: appConfig.name };

export const viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: appConfig.themeColor,
};

// Define the AuthProvider based on the selected auth strategy
// Remove this block if you are not using any auth strategy

let AuthProvider = React.Fragment;

if (appConfig.authStrategy === AuthStrategy.AUTH0) {
	AuthProvider = Auth0Provider;
}

if (appConfig.authStrategy === AuthStrategy.CUSTOM) {
	AuthProvider = CustomAuthProvider;
}

export default async function Layout({ children }) {
	const settings = await getPersistedSettings();
	const direction = settings.direction ?? appConfig.direction;
	const language = settings.language ?? appConfig.language;

	return (
		<html dir={direction} lang={language} suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.png" />
			</head>
			<body>
				<InitColorSchemeScript attribute="class" />
				<AuthProvider>
					<Analytics>
						<LocalizationProvider>
							<SettingsProvider settings={settings}>
								<I18nProvider lng={language}>
									<EmotionCacheProvider options={{ key: "mui" }}>
										<Rtl direction={direction}>
											<ThemeProvider>
												{children}
												<Toaster position="bottom-right" />
											</ThemeProvider>
										</Rtl>
									</EmotionCacheProvider>
								</I18nProvider>
							</SettingsProvider>
						</LocalizationProvider>
					</Analytics>
				</AuthProvider>
			</body>
		</html>
	);
}
