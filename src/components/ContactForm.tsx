"use client";

import { useForm, ValidationError } from "@formspree/react";
import { site } from "@/content";

const field =
  "w-full rounded-xl border border-lime-ink/10 bg-white px-4 py-3 text-[14px] text-lime-ink placeholder:text-lime-ink/40 focus:border-lime-ink/40 focus:outline-none";
const fieldError = "mt-1.5 text-[12px] font-medium text-[#7a1c12]";

// Los mensajes se envían a Formspree, que los reenvía a tu correo.
export default function ContactForm() {
  const [state, handleSubmit, reset] = useForm(site.formspreeId, {
    data: { _subject: "Nuevo mensaje desde tu portafolio" },
  });

  if (state.succeeded) {
    return (
      <div role="status" className="mt-8 rounded-2xl bg-lime-ink p-6 text-lime">
        <p className="text-[20px] font-medium tracking-[-0.02em]">¡Mensaje enviado!</p>
        <p className="mt-2 text-[14px] leading-relaxed text-lime/75">
          Gracias por escribir. Te respondo a tu correo lo antes posible.
        </p>
        <button type="button" onClick={reset} className="mono mt-4 text-[12px] text-lime underline underline-offset-4">
          enviar otro mensaje
        </button>
      </div>
    );
  }

  const formError = state.errors?.getFormErrors()?.[0];

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="contact-name" className="sr-only">
          Tu nombre
        </label>
        <input id="contact-name" name="nombre" type="text" required autoComplete="name" placeholder="Tu nombre" className={field} />
        <ValidationError field="nombre" prefix="Nombre" errors={state.errors} className={fieldError} />
      </div>
      <div>
        <label htmlFor="contact-email" className="sr-only">
          Tu correo
        </label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" className={field} />
        <ValidationError field="email" prefix="Correo" errors={state.errors} className={fieldError} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="sr-only">
          Tu mensaje
        </label>
        <textarea
          id="contact-message"
          name="mensaje"
          required
          rows={4}
          placeholder="¿Qué necesitas construir?"
          className={`${field} resize-none`}
        />
        <ValidationError field="mensaje" prefix="Mensaje" errors={state.errors} className={fieldError} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state.submitting}
          className="btn h-11 bg-lime-ink px-6 text-[13px] text-lime hover:bg-black disabled:opacity-60"
        >
          {state.submitting ? "Enviando…" : "Enviar mensaje"}
        </button>
        <a href={site.whatsappHref} target="_blank" rel="noopener" className="mono text-[12px] text-lime-ink/70 underline underline-offset-4 hover:text-lime-ink">
          o escríbeme por WhatsApp
        </a>
      </div>
      {formError && (
        <p role="alert" className={`${fieldError} sm:col-span-2`}>
          No se pudo enviar ({formError.message}). Intenta de nuevo o escríbeme a {site.email}.
        </p>
      )}
    </form>
  );
}
