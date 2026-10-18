import { openGraphFor } from "@/lib/og/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal-page";
import { LEGAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo Young Business Leaders MX recaba, usa y protege tus datos personales.",
  alternates: { canonical: "/aviso-de-privacidad" },
  openGraph: openGraphFor({ path: "/aviso-de-privacidad", title: "Aviso de privacidad · YBL", description: "Cómo Young Business Leaders MX recaba, usa y protege tus datos personales." }),
};

const mail = <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

export default function AvisoDePrivacidadPage() {
  return (
    <LegalPage
      title="Aviso de privacidad"
      intro={
        <p>
          En {LEGAL.name} ({LEGAL.short}) cuidamos los datos de quienes forman parte de la comunidad. Este aviso explica qué
          datos recabamos en yblmx.org, para qué los usamos, con quién los compartimos y cómo puedes ejercer tus derechos,
          conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
        </p>
      }
      sections={[
        {
          id: "responsable",
          title: "Responsable",
          body: (
            <p>
              El responsable del tratamiento de tus datos es {LEGAL.name} ({LEGAL.short}), comunidad de jóvenes emprendedores
              con sede en {LEGAL.location}. Para cualquier tema de privacidad nuestro medio de contacto es {mail}.
            </p>
          ),
        },
        {
          id: "datos",
          title: "Datos que recabamos",
          body: (
            <>
              <ul>
                <li>
                  <strong>Cuenta:</strong> nombre, correo electrónico y contraseña. La contraseña se guarda cifrada y nadie del
                  equipo puede verla. Si entras con Google, recibimos tu nombre, correo y foto de perfil de Google.
                </li>
                <li>
                  <strong>Perfil de miembro (opcional):</strong> foto, titular, descripción, empresa o proyecto, industria,
                  ciudad, usuario de Instagram, LinkedIn y sitio web. Tú decides qué llenar.
                </li>
                <li>
                  <strong>Registro a eventos:</strong> si eres miembro, el evento queda ligado a tu cuenta. Si te registras sin
                  cuenta, pedimos tu nombre y correo.
                </li>
                <li>
                  <strong>Formulario de contacto:</strong> nombre, correo y el mensaje que nos envías.
                </li>
                <li>
                  <strong>Datos técnicos:</strong> las cookies necesarias para mantener tu sesión y estadísticas agregadas de
                  visitas y rendimiento que no te identifican.
                </li>
              </ul>
              <p>No pedimos datos personales sensibles ni datos financieros o bancarios.</p>
            </>
          ),
        },
        {
          id: "finalidades",
          title: "Para qué los usamos",
          body: (
            <>
              <p>Usamos tus datos únicamente para:</p>
              <ul>
                <li>Crear y administrar tu cuenta y permitirte iniciar sesión.</li>
                <li>Revisar tu solicitud de membresía.</li>
                <li>Mostrar tu perfil en el directorio a otros miembros aprobados.</li>
                <li>Registrar tu asistencia a eventos y avisarte de cambios o cancelaciones.</li>
                <li>Responder los mensajes que nos envías.</li>
                <li>Mantener la seguridad del sitio y prevenir abusos.</li>
              </ul>
              <p>
                No vendemos tus datos ni los usamos para publicidad. Si en el futuro quisiéramos usarlos para otra finalidad,
                como un boletín, te pediremos tu consentimiento antes.
              </p>
            </>
          ),
        },
        {
          id: "quien-ve",
          title: "Quién puede ver tus datos",
          body: (
            <ul>
              <li>
                <strong>Otros miembros aprobados</strong> ven tu perfil del directorio y, si te registras a un evento, tu
                nombre en la lista de miembros que asistirán. Tu correo no se muestra a otros miembros.
              </li>
              <li>
                <strong>El equipo administrador de {LEGAL.short}</strong> ve tu correo, tu solicitud y tus registros para
                operar la comunidad y los eventos.
              </li>
              <li>
                <strong>Visitantes sin cuenta</strong> no ven el directorio ni los datos de ningún miembro.
              </li>
            </ul>
          ),
        },
        {
          id: "proveedores",
          title: "Proveedores y transferencias",
          body: (
            <>
              <p>Para operar el sitio usamos proveedores que procesan datos por nuestra cuenta y bajo nuestras instrucciones:</p>
              <ul>
                <li>
                  <strong>Supabase:</strong> base de datos, autenticación y almacenamiento de fotos.
                </li>
                <li>
                  <strong>Vercel:</strong> alojamiento del sitio y estadísticas agregadas sin cookies.
                </li>
                <li>
                  <strong>Google:</strong> inicio de sesión, solo si eliges entrar con tu cuenta de Google.
                </li>
                <li>
                  <strong>Resend:</strong> envío de correos de la plataforma, como la confirmación de tu cuenta.
                </li>
              </ul>
              <p>
                Sus servidores pueden estar fuera de México. No transferimos tus datos a otros terceros, salvo cuando lo exija
                la ley o lo ordene una autoridad competente.
              </p>
            </>
          ),
        },
        {
          id: "derechos",
          title: "Tus derechos ARCO y cómo revocar tu consentimiento",
          body: (
            <>
              <p>
                Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso, así como revocar tu consentimiento.
                Muchos cambios los puedes hacer tú mismo en <Link href="/comunidad/perfil">Mi perfil</Link>. Para lo demás,
                incluido borrar tu cuenta, escríbenos a {mail} desde el correo de tu cuenta con:
              </p>
              <ul>
                <li>Tu nombre completo.</li>
                <li>El derecho que quieres ejercer y una descripción clara de tu solicitud.</li>
                <li>Una identificación oficial, o la de tu representante y el documento que lo acredite.</li>
              </ul>
              <p>
                Te responderemos en un plazo máximo de 20 días hábiles. Si tu solicitud procede, la haremos efectiva dentro de
                los 15 días hábiles siguientes a nuestra respuesta.
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          body: (
            <p>
              Solo usamos las cookies necesarias para mantener tu sesión iniciada. No usamos cookies de publicidad ni de
              rastreo de terceros. Si las bloqueas en tu navegador, el sitio público funcionará pero no podrás iniciar sesión.
            </p>
          ),
        },
        {
          id: "fotos",
          title: "Fotografías de eventos",
          body: (
            <p>
              En nuestros eventos tomamos fotografías que publicamos en la galería del sitio y en nuestras redes sociales. Si
              apareces en una foto y quieres que la retiremos, escríbenos a {mail} indicando cuál es y la quitaremos.
            </p>
          ),
        },
        {
          id: "conservacion",
          title: "Cuánto tiempo los conservamos",
          body: (
            <p>
              Conservamos tus datos mientras tengas una cuenta activa o el tiempo necesario para atender la finalidad para la
              que nos los diste. Cuando borras tu cuenta eliminamos tu perfil y tus registros, salvo lo que debamos conservar
              por obligación legal.
            </p>
          ),
        },
        {
          id: "menores",
          title: "Menores de edad",
          body: (
            <p>
              La comunidad está dirigida a personas mayores de edad. Si tienes menos de 18 años, necesitas la autorización de
              tu madre, padre o tutor para registrarte.
            </p>
          ),
        },
        {
          id: "cambios",
          title: "Cambios a este aviso",
          body: (
            <p>
              Si cambiamos este aviso publicaremos la nueva versión en esta página con su fecha de actualización. Si el cambio
              es relevante, también lo avisaremos por correo a los miembros.
            </p>
          ),
        },
      ]}
    />
  );
}
