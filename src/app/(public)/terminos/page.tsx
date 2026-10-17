import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal-page";
import { LEGAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Reglas de uso del sitio y de la comunidad Young Business Leaders MX.",
  alternates: { canonical: "/terminos" },
};

const mail = <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

export default function TerminosPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      intro={
        <p>
          Estos términos regulan el uso de yblmx.org y de la comunidad {LEGAL.name} ({LEGAL.short}). Al crear una cuenta o
          registrarte a un evento aceptas estos términos y nuestro <Link href="/aviso-de-privacidad" className="font-medium text-gold-deep underline">aviso de privacidad</Link>.
        </p>
      }
      sections={[
        {
          id: "cuenta",
          title: "Tu cuenta",
          body: (
            <ul>
              <li>Da información verdadera y mantenla actualizada. Una cuenta por persona.</li>
              <li>Cuida tu contraseña. Eres responsable de lo que se haga desde tu cuenta.</li>
              <li>Puedes borrar tu cuenta cuando quieras escribiéndonos a {mail}.</li>
            </ul>
          ),
        },
        {
          id: "membresia",
          title: "Membresía",
          body: (
            <p>
              Cualquier persona puede solicitar unirse, pero el equipo de {LEGAL.short} revisa cada solicitud antes de dar
              acceso al directorio y a los eventos exclusivos. Podemos aprobar o rechazar solicitudes, y suspender o dar de
              baja cuentas que incumplan estos términos.
            </p>
          ),
        },
        {
          id: "convivencia",
          title: "Reglas de la comunidad",
          body: (
            <>
              <p>Esperamos respeto en el sitio y en los eventos. No está permitido:</p>
              <ul>
                <li>Acosar, discriminar, amenazar o faltar al respeto a otras personas.</li>
                <li>Usar el directorio para enviar publicidad masiva, spam o propuestas de venta no solicitadas.</li>
                <li>Copiar, descargar o extraer de forma automatizada los datos de otros miembros.</li>
                <li>Hacerse pasar por otra persona o empresa.</li>
                <li>Publicar en tu perfil contenido ilegal, ofensivo o que infrinja derechos de terceros.</li>
              </ul>
            </>
          ),
        },
        {
          id: "perfil",
          title: "Contenido de tu perfil",
          body: (
            <p>
              Lo que publicas en tu perfil es tuyo y eres responsable de ello. Nos das permiso para mostrarlo a otros miembros
              mientras tu cuenta esté activa. Puedes editarlo o borrarlo en cualquier momento.
            </p>
          ),
        },
        {
          id: "eventos",
          title: "Eventos",
          body: (
            <ul>
              <li>
                Registrarte en el sitio es gratuito. Algunos eventos pueden tener una cuota de recuperación; cuando la haya,
                se indicará en el evento y se paga por fuera del sitio.
              </li>
              <li>Los cupos son limitados. Si un evento se llena, el sitio deja de aceptar registros.</li>
              <li>Podemos cambiar la fecha, el lugar o cancelar un evento; en ese caso avisaremos a las personas registradas.</li>
              <li>Los organizadores pueden negar el acceso o retirar a quien no respete las reglas de la comunidad.</li>
              <li>
                En los eventos se toman fotografías que publicamos en el sitio y en redes. Si quieres que retiremos una foto
                donde apareces, escríbenos.
              </li>
            </ul>
          ),
        },
        {
          id: "propiedad",
          title: "Propiedad intelectual",
          body: (
            <p>
              La marca {LEGAL.short}, su logotipo, los carteles, los textos y las fotografías del sitio pertenecen a {LEGAL.short} o
              a sus autores. Los logotipos de aliados y patrocinadores pertenecen a sus respectivos dueños. No los uses sin
              autorización.
            </p>
          ),
        },
        {
          id: "responsabilidad",
          title: "Responsabilidad",
          body: (
            <>
              <p>
                El sitio se ofrece tal como está. Hacemos lo posible por mantenerlo disponible y seguro, pero no garantizamos
                que funcione sin interrupciones.
              </p>
              <p>
                {LEGAL.short} no es parte de los acuerdos, negocios o colaboraciones que surjan entre miembros, y no responde
                por ellos. Las opiniones de ponentes e invitados son responsabilidad de quien las expresa.
              </p>
            </>
          ),
        },
        {
          id: "cambios",
          title: "Cambios a estos términos",
          body: (
            <p>
              Podemos actualizar estos términos. Publicaremos la nueva versión en esta página con su fecha. Si sigues usando
              el sitio después del cambio, entendemos que aceptas la nueva versión.
            </p>
          ),
        },
        {
          id: "ley",
          title: "Ley aplicable",
          body: (
            <p>
              Estos términos se rigen por las leyes de México. Cualquier controversia se resolverá ante los tribunales
              competentes de Guadalajara, Jalisco.
            </p>
          ),
        },
      ]}
    />
  );
}
