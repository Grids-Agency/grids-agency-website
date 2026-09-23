"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import emailjs from "@emailjs/browser";
import { MetalButton } from "@/components/spectrumui/metal-button";
import { trackEvent } from "@/lib/analytics";

const steps = ["name", "company", "build", "budget", "email", "notes"] as const;
const services = ["website", "app", "admin", "automation", "ai", "unsure", "other"] as const;
const budgets = ["small", "medium", "large", "enterprise", "scale", "discuss"] as const;
const inputClass = "w-full rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 py-3 text-base text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-tertiary md:text-lg";
const buttonStyle = {
  className: "h-11 gap-3 rounded-none px-5 text-xs cursor-pointer",
  wrapperClassName: "rounded-none",
} as const;

export default function ProjectQuestionnaire({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const t = useTranslations("Connect.Questionnaire");
  const contact = useTranslations("Connect");
  const reduced = useReducedMotion();
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({ name: "", company: "", email: "", notes: "", budget: "", other: "", build: [] as string[] });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const sending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const current = steps[step];
  const final = step === steps.length - 1;
  const validation = (() => {
    if (current === "name" && !draft.name.trim()) return t("nameRequired");
    if (current === "build" && !draft.build.length) return t("required");
    if (current === "build" && draft.build.includes("other") && !draft.other.trim()) return t("otherRequired");
    if (current === "budget" && !draft.budget) return t("required");
    if (current === "email") {
      if (!draft.email.trim()) return t("emailRequired");
      if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(draft.email.trim())) return t("emailInvalid");
    }
    if (final && !consent) return t("consentRequired");
    return "";
  })();
  const feedback = touched && validation ? validation : error;
  const summary = () => [
    `${t("name.title")}: ${draft.name}`,
    `${t("company.title")}: ${draft.company || "—"}`,
    `${t("build.title")}: ${draft.build.map(value => value === "other" ? `${t("services.other")}: ${draft.other.trim()}` : t(`services.${value}`)).join(", ")}`,
    `${t("budget.title")}: ${t(`budgets.${draft.budget}`)}`,
    `${t("email.title")}: ${draft.email}`,
    `${t("notes.title")}: ${draft.notes || "—"}`,
  ].join("\n\n");

  const advance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;
    if (validation) {
      setTouched(true);
      return;
    }
    setError("");
    if (!final) { setTouched(false); setStep(step + 1); return; }
    const service = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const template = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!service || !template || !publicKey) { setError(t("unavailable")); return; }
    sending.current = true;
    setStatus("sending");
    try {
      await emailjs.send(service, template, {
        to_email: "kyle@gridsagency.com",
        to_name: "Kyle",
        reply_to: draft.email.trim(),
        from_name: draft.name.trim(),
        subject: `${t("emailSubject")} — ${draft.name.trim()}`,
        firstName: draft.name.trim(), lastName: "", email: draft.email.trim(), phone: "",
        company: draft.company.trim(), message: summary(), terms: consent ? "on" : "",
      }, { publicKey });
      trackEvent("generate_lead", { form_name: "project_inquiry" });
      setStatus("success");
      onSuccess();
    } catch {
      setStatus("idle");
      setError(t("sendError"));
    } finally {
      sending.current = false;
    }
  };

  return (
    <form noValidate onSubmit={advance} onKeyDown={event => {
      if (event.key === "Enter" && event.target instanceof HTMLInputElement && ["text", "email"].includes(event.target.type)) {
        event.preventDefault();
        event.currentTarget.requestSubmit();
      }
    }} className="relative isolate flex min-h-[calc(100svh-112px)] w-full flex-col items-center px-5 pt-12 pb-28 sm:px-8 md:min-h-[calc(100svh-72px)] md:px-10 md:pt-16 md:pb-12">
      <div className="flex w-full flex-1 items-center justify-center py-10 md:py-16">
        <motion.div
          layout="position"
          transition={{ layout: { duration: reduced ? 0 : 0.9, ease: [0.4, 0, 0.2, 1] } }}
          className="w-full max-w-2xl text-center"
        >
            <h1 ref={heading} tabIndex={-1} id="question-title" className="relative overflow-hidden py-1 text-[clamp(26px,3vw,44px)] leading-tight font-medium tracking-[-0.05em] text-balance outline-none [perspective:800px]">
              <span className="sr-only">{t(status === "success" ? "successTitle" : `${current}.title`)}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={status === "success" ? "success" : current}
                  aria-hidden="true"
                  initial={{ y: reduced ? 0 : "110%", rotateX: reduced ? 0 : -55 }}
                  animate={{ y: 0, rotateX: 0 }}
                  exit={{ y: reduced ? 0 : "-110%", rotateX: reduced ? 0 : 55 }}
                  transition={{ duration: reduced ? 0 : 0.9, ease: [0.4, 0, 0.2, 1] }}
                  onAnimationComplete={() => heading.current?.focus({ preventScroll: true })}
                  className="block w-full origin-center [backface-visibility:hidden]"
                >
                  {t(status === "success" ? "successTitle" : `${current}.title`)}
                </motion.span>
              </AnimatePresence>
            </h1>
            <motion.div
              key={status === "success" ? "success-answer" : `answer-${current}`}
              initial={{ opacity: reduced ? 1 : 0, clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="-mx-1 px-1 pb-1"
            >
            {status === "success" ? (
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-foreground/60">{t("successDescription")}</p>
            ) : (
              <fieldset disabled={status === "sending"} aria-describedby="question-error" onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) setTouched(true);
              }} className="mx-auto mt-10 w-full max-w-lg border-0 p-0">
                <legend className="sr-only">{t(`${current}.title`)}</legend>
                {(current === "name" || current === "company" || current === "email") && (
                  <input
                    key={current} aria-labelledby="question-title" aria-describedby="question-error" aria-invalid={touched && Boolean(validation)}
                    name={current} type={current === "email" ? "email" : "text"}
                    autoComplete={current === "company" ? "organization" : current}
                    required={current !== "company"} maxLength={current === "email" ? 254 : 120}
                    placeholder={t(`${current}.placeholder`)} value={draft[current]}
                    onChange={event => { setDraft({ ...draft, [current]: event.target.value }); setError(""); }}
                    className={`${inputClass} max-w-sm`}
                  />
                )}
                {current === "build" && (
                  <>
                    <p className="mb-5 text-xs text-foreground/50">{t("multiple")}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {services.map((value, index) => <motion.button initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.26 + index * 0.06, ease: [0.4, 0, 0.2, 1] }} key={value} type="button" aria-pressed={draft.build.includes(value)} onClick={() => { setDraft({ ...draft, build: draft.build.includes(value) ? draft.build.filter(item => item !== value) : [...draft.build, value] }); setError(""); }} className="flex min-h-14 cursor-pointer items-center justify-between last:col-span-2 gap-2 border border-foreground/15 bg-background/50 px-4 py-3 text-left text-sm transition-colors hover:border-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background">{t(`services.${value}`)}{draft.build.includes(value) && <Check size={14} className="shrink-0" aria-hidden="true" />}</motion.button>)}
                    </div>
                    <AnimatePresence initial={false}>
                      {draft.build.includes("other") && (
                        <motion.div key="other-details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden text-left">
                          <label htmlFor="project-other" className="mt-6 block text-xs text-foreground/60">{t("otherLabel")}</label>
                          <input id="project-other" name="other" type="text" required maxLength={500} value={draft.other} placeholder={t("otherPlaceholder")} aria-describedby="question-error" aria-invalid={touched && !draft.other.trim()} onChange={event => { setDraft({ ...draft, other: event.target.value }); setError(""); }} className={inputClass} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
                {current === "budget" && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {budgets.map((value, index) => <motion.label initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.26 + index * 0.06, ease: [0.4, 0, 0.2, 1] }} key={value} className="flex min-h-14 cursor-pointer items-center gap-3 border border-foreground/15 bg-background/50 px-4 py-3 text-left text-sm transition-colors hover:border-foreground/50 has-checked:border-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-tertiary"><input type="radio" name="budget" value={value} required checked={draft.budget === value} onChange={() => { setDraft({ ...draft, budget: value }); setError(""); }} className="size-3.5 accent-current" />{t(`budgets.${value}`)}</motion.label>)}
                  </div>
                )}
                {current === "notes" && (
                  <>
                    <div className="group/note relative p-2 text-left">
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-foreground/25 transition-colors duration-500 group-focus-within/note:text-foreground/70">
                        <span className="absolute top-0 left-0 size-5 border-t border-l" />
                        <span className="absolute top-0 right-0 size-5 border-t border-r" />
                        <span className="absolute bottom-0 left-0 size-5 border-b border-l" />
                        <span className="absolute right-0 bottom-0 size-5 border-r border-b" />
                      </div>
                      <div className="relative border border-foreground/10 bg-background/70 shadow-[inset_0_1px_0_#ffffff08] backdrop-blur-sm transition-[border-color,background-color] duration-500 group-focus-within/note:border-foreground/25 group-focus-within/note:bg-background/90">
                        <textarea
                          id="project-notes" aria-labelledby="question-title"
                          name="notes" rows={5} maxLength={5000} value={draft.notes}
                          onChange={event => setDraft({ ...draft, notes: event.target.value })}
                          placeholder={t("notes.placeholder")}
                          className="block max-h-96 min-h-48 w-full resize-y rounded-none border-0 bg-transparent px-5 py-5 text-left text-base leading-[1.9] text-foreground caret-tertiary outline-none placeholder:text-foreground/30 sm:px-6"
                        />
                      </div>
                    </div>
                    <label className="mt-6 flex cursor-pointer items-start gap-3 text-left text-xs leading-relaxed text-foreground/60"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-current" />{contact("Form.terms")}</label>
                  </>
                )}
              </fieldset>
            )}
            </motion.div>
        </motion.div>
      </div>
      <div className="w-full max-w-lg text-center">
        <div id="question-error" role="alert" className="mb-5 min-h-5 text-xs text-foreground/70">
          <AnimatePresence mode="wait" initial={false}>
            {feedback && (
              <motion.div
                key={feedback}
                initial={{ opacity: 0, filter: reduced ? "blur(0px)" : "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: reduced ? "blur(0px)" : "blur(4px)" }}
                transition={{ duration: reduced ? 0 : 0.35, ease: "easeInOut" }}
              >
                <p>{feedback}</p>
                {final && error && !validation && <a className="mt-2 inline-block underline underline-offset-4" href={`mailto:${contact("Cards.emailValue")}?subject=${encodeURIComponent(t("emailSubject"))}&body=${encodeURIComponent(summary())}`}>{t("emailFallback")}</a>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {status === "success" ? <MetalButton {...buttonStyle} disabled={closing} onClick={() => { setClosing(true); onClose(); }}>{t("done")}</MetalButton> : (
          <nav aria-label={t("navigation")} className="flex items-center justify-center gap-3">
            <MetalButton {...buttonStyle} disabled={status === "sending"} onClick={() => { setError(""); setTouched(false); if (step === 0) onClose(); else setStep(step - 1); }}><ArrowLeft size={14} aria-hidden="true" />{t("back")}</MetalButton>
            <span aria-live="polite" aria-atomic="true" className="min-w-16 font-mono text-xs tabular-nums text-foreground/50">{step + 1} / {steps.length}</span>
            <MetalButton {...buttonStyle} type="submit" aria-describedby="question-error" disabled={status === "sending" || Boolean(validation)}>{t(status === "sending" ? "sending" : final ? "send" : "next")}<ArrowRight size={14} aria-hidden="true" /></MetalButton>
          </nav>
        )}
      </div>
    </form>
  );
}
