// /app/data-deletion/page.tsx
export default function DataDeletionPage() {
  return (
    <main style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.8',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Eliminación de Datos</h1>

      <p>
        En MicroImpulso respetamos tu derecho a la privacidad. Si deseas solicitar la eliminación de tus datos personales
        asociados a nuestra aplicación o servicios financieros, puedes hacerlo escribiéndonos un correo.
      </p>

      <h2 style={{ fontSize: '1.3rem', marginTop: '2rem' }}>¿Cómo solicitar la eliminación de datos?</h2>
      <p>
        Envíanos un mensaje a <strong>contacto@microimpulso.com</strong> con el asunto “Solicitud de eliminación de datos”
        e incluye tu nombre completo y número de teléfono asociado.
      </p>

      <p>
        Procesaremos tu solicitud en un plazo máximo de 5 días hábiles y confirmaremos por el mismo medio cuando se haya completado.
      </p>
    </main>
  );
}
