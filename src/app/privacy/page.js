import * as React from "react";

export default function PrivacyPolicyPage() {
	return (
		<main
			style={{
				maxWidth: "800px",
				margin: "0 auto",
				padding: "2rem",
				fontFamily: "Arial, sans-serif",
				lineHeight: "1.8",
				color: "#333",
			}}
		>
			<h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Política de Privacidad</h1>

			<p>
				En <strong>MicroImpulso</strong>, estamos comprometidos con la protección de tu privacidad. Esta política
				describe cómo recopilamos, usamos y protegemos la información que compartes con nosotros a través de nuestros
				canales de atención, incluyendo WhatsApp.
			</p>

			<h2 style={{ fontSize: "1.3rem", marginTop: "2rem" }}>1. Datos que recopilamos</h2>
			<p>
				Podemos recopilar información básica como tu nombre, número de teléfono y los mensajes que nos envíes para
				acceder a nuestros servicios financieros.
			</p>

			<h2 style={{ fontSize: "1.3rem", marginTop: "2rem" }}>2. Finalidad del uso</h2>
			<p>
				Utilizamos esta información para ofrecerte una mejor experiencia, responder tus consultas, procesar tus
				solicitudes y brindarte acceso a nuestros productos y servicios financieros.
			</p>

			<h2 style={{ fontSize: "1.3rem", marginTop: "2rem" }}>3. Confidencialidad</h2>
			<p>
				No compartimos tu información personal con terceros, salvo cuando sea estrictamente necesario para la operación
				del servicio o requerido por la ley.
			</p>

			<h2 style={{ fontSize: "1.3rem", marginTop: "2rem" }}>4. Seguridad</h2>
			<p>
				Adoptamos medidas técnicas y organizativas adecuadas para proteger tu información frente a accesos no
				autorizados, pérdida o divulgación indebida.
			</p>

			<h2 style={{ fontSize: "1.3rem", marginTop: "2rem" }}>5. Tus derechos</h2>
			<p>
				Puedes solicitar la corrección o eliminación de tus datos en cualquier momento escribiéndonos a nuestro correo
				de contacto.
			</p>

			<h2 style={{ fontSize: "1.3rem", marginTop: "2rem" }}>6. Contacto</h2>
			<p>
				Si tienes preguntas sobre esta política, puedes escribirnos a: <strong>contacto@microimpulso.com</strong>
			</p>
		</main>
	);
}
