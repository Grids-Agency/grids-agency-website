"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

// September 2026 starts on Tuesday; the demo selects Thursday the 24th.
const calendar = Array.from({ length: 35 }, (_, index) => index >= 1 && index <= 30 ? index : null);

export default function BookingAppPreview() {
  const t = useTranslations("Possibilities.applications.demo");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let sequence: gsap.core.Timeline;
    const context = gsap.context(() => {
      sequence = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
      sequence
        .set("[data-book-date], [data-book-time], [data-book-ready], [data-book-saved], [data-book-confirmation]", { autoAlpha: 0 })
        .set("[data-book-empty], [data-book-submit]", { autoAlpha: 1 })
        .set("[data-book-times]", { opacity: 0.35 })
        .set("[data-book-cursor]", { autoAlpha: 1, attr: { transform: "translate(205 118)" } })
        .set("[data-book-pointer]", { attr: { transform: "scale(1)" } })
        .set("[data-book-confirmation]", { attr: { transform: "translate(0 10)" } })
        .to("[data-book-cursor]", { attr: { transform: "translate(140 250)" }, duration: 0.85, ease: "power2.inOut" }, 0.8)
        .to("[data-book-pointer]", { attr: { transform: "scale(0.8)" }, duration: 0.12, repeat: 1, yoyo: true }, 1.7)
        .to("[data-book-date]", { autoAlpha: 1, duration: 0.2 }, 1.82)
        .to("[data-book-times]", { opacity: 1, duration: 0.3 }, 1.9)
        .to("[data-book-cursor]", { attr: { transform: "translate(317 225)" }, duration: 0.8, ease: "power2.inOut" }, 2.35)
        .to("[data-book-pointer]", { attr: { transform: "scale(0.8)" }, duration: 0.12, repeat: 1, yoyo: true }, 3.25)
        .to("[data-book-time], [data-book-ready]", { autoAlpha: 1, duration: 0.25 }, 3.37)
        .to("[data-book-cursor]", { attr: { transform: "translate(199 317)" }, duration: 0.8, ease: "power2.inOut" }, 3.85)
        .to("[data-book-pointer]", { attr: { transform: "scale(0.8)" }, duration: 0.12, repeat: 1, yoyo: true }, 4.75)
        .to("[data-book-submit]", { autoAlpha: 0, duration: 0.2 }, 4.9)
        .to("[data-book-saved]", { autoAlpha: 1, duration: 0.25 }, 4.95)
        .to("[data-book-cursor]", { autoAlpha: 0, duration: 0.3 }, 5.05)
        .to("[data-book-empty]", { autoAlpha: 0, duration: 0.25 }, 5.25)
        .to("[data-book-confirmation]", { autoAlpha: 1, attr: { transform: "translate(0 0)" }, duration: 0.65, ease: "power3.out" }, 5.45)
        .to("[data-book-date], [data-book-time], [data-book-ready], [data-book-saved], [data-book-confirmation]", { autoAlpha: 0, duration: 0.5 }, 9)
        .to("[data-book-empty], [data-book-submit]", { autoAlpha: 1, duration: 0.5 }, 9.15)
        .to("[data-book-times]", { opacity: 0.35, duration: 0.5 }, 9.15);
    }, element);
    const syncPlayback = () => {
      if (media.matches) sequence.pause(7);
      else if (visible && !document.hidden) sequence.play();
      else sequence.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.2 });
    observer.observe(element);
    media.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      context.revert();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="flex h-full items-center justify-center px-5 py-3 md:px-7">
      <svg viewBox="0 0 600 380" className="h-full max-h-[360px] w-full max-w-[600px] overflow-visible [font-family:var(--font-geist-sans),Arial,sans-serif]" fill="none">
        {/* Desktop booking surface: restrained navigation, clear selection states. */}
        <rect x="12" y="39" width="420" height="324" rx="12" fill="#000" opacity="0.08" />
        <rect x="12" y="32" width="420" height="324" rx="12" fill="#fff" stroke="#dedfe3" />
        <path d="M12 73H432" stroke="#ededef" />
        <path d="M35 44h8v8h-8zm10 0h8v8h-8zm-10 10h8v8h-8z" fill="#202126" />
        <text x="62" y="57" fill="#202126" fontSize="12" fontWeight="600" letterSpacing="-0.4">FORMA</text>
        <text x="206" y="56" fill="#8a8b93" fontSize="9">{t("webNav")}</text>
        <circle cx="368" cy="53" r="10" fill="#f2f2f4" />
        <path d="M365 50h6m-6 3h6m-6 3h6" stroke="#92939c" strokeWidth="1" />
        <text x="38" y="104" fill="#222329" fontSize="20" fontWeight="600" letterSpacing="-0.7">{t("heading")}</text>
        <g stroke="#999aa3" strokeWidth="1.1">
          <circle cx="43" cy="119" r="4" /><path d="M43 116v3l2 1" />
        </g>
        <text x="53" y="122" fill="#80818c" fontSize="9">{t("subtitle")}</text>
        <text x="38" y="150" fill="#34353e" fontSize="11" fontWeight="600">{t("month")}</text>
        <rect x="207" y="137" width="18" height="18" rx="4" stroke="#e8e8ec" />
        <rect x="229" y="137" width="18" height="18" rx="4" stroke="#e8e8ec" />
        <path d="m218 143-3 3 3 3m18-6 3 3-3 3" stroke="#70717b" strokeWidth="1.1" />
        {Array.from({ length: 7 }, (_, day) => (
          <text key={day} x={50 + day * 30} y="169" textAnchor="middle" fill="#9b9ca5" fontSize="8">{t(`weekday${day}`)}</text>
        ))}
        {calendar.map((day, index) => day && (
          <text key={day} x={50 + index % 7 * 30} y={188 + Math.floor(index / 7) * 22} textAnchor="middle" fill={index % 7 >= 5 ? "#c5c6cd" : "#454651"} fontSize="10" fontWeight="500">{day}</text>
        ))}
        <g data-book-date className="invisible opacity-0">
          <rect x="127" y="239" width="26" height="24" rx="6" fill="#3862f5" />
          <text x="140" y="254" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">24</text>
        </g>
        <path d="M260 140V283" stroke="#ededef" />
        <g data-book-times opacity="0.35">
          <text x="278" y="150" fill="#777984" fontSize="9">{t("available")}</text>
          {["10:00", "14:00", "16:30"].map((time, index) => (
            <g key={time}>
              <rect x="278" y={176 + index * 35} width="87" height="26" rx="5" fill="#fff" stroke="#e5e5ea" />
              <text x="321.5" y={193 + index * 35} textAnchor="middle" fill="#555661" fontSize="10" fontWeight="500">{time}</text>
            </g>
          ))}
          <g data-book-time className="invisible opacity-0">
            <rect x="278" y="211" width="87" height="26" rx="5" fill="#f0f4ff" stroke="#3862f5" />
            <text x="316" y="228" textAnchor="middle" fill="#3862f5" fontSize="10" fontWeight="600">14:00</text>
            <path d="m343 223 2 2 4-4" stroke="#3862f5" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </g>
        <path d="M38 291H365" stroke="#ededf0" />
        <rect x="38" y="301" width="327" height="31" rx="5" fill="#f1f1f4" />
        <rect data-book-ready x="38" y="301" width="327" height="31" rx="5" fill="#222329" className="invisible opacity-0" />
        <g data-book-submit>
          <text x="201" y="321" textAnchor="middle" fill="#9b9ca5" fontSize="10" fontWeight="500">{t("reserve")}</text>
          <text data-book-ready x="201" y="321" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="500" className="invisible opacity-0">{t("reserve")}</text>
        </g>
        <g data-book-saved className="invisible opacity-0">
          <text x="201" y="321" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="500">✓ {t("reserved")}</text>
        </g>
        {/* Thin graphite device rim; the appointment is the focus of the app. */}
        <rect x="394" y="14" width="194" height="354" rx="29" fill="#000" opacity="0.14" />
        <rect x="393" y="7" width="196" height="357" rx="29" fill="#1b1c20" stroke="#60616a" strokeWidth="1" />
        <rect x="397" y="11" width="188" height="349" rx="25" fill="#fcfcfd" />
        <rect x="469" y="18" width="46" height="12" rx="6" fill="#1b1c20" />
        <text x="411" y="30" fill="#3b3d47" fontSize="7" fontWeight="600">9:41</text>
        <path d="M548 24v5m3-7v7m3-9v9" stroke="#3b3d47" strokeWidth="1.5" />
        <rect x="562" y="23" width="10" height="5" rx="1.5" stroke="#3b3d47" />
        <path d="M564 25h6" stroke="#3b3d47" strokeWidth="2" />
        <path d="M413 46h5v5h-5zm7 0h5v5h-5zm-7 7h5v5h-5z" fill="#33343d" />
        <text x="433" y="56" fill="#33343d" fontSize="9" fontWeight="600" letterSpacing="0.5">FORMA</text>
        <circle cx="562" cy="52" r="9" fill="#ededf1" />
        <circle cx="562" cy="50" r="2.3" stroke="#93959f" /><path d="M558 56c0-5 8-5 8 0" stroke="#93959f" />
        <text x="413" y="91" fill="#24252d" fontSize="21" fontWeight="600" letterSpacing="-0.8">{t("myBookings")}</text>
        <text x="413" y="112" fill="#777984" fontSize="9">{t("upcoming")}</text>
        <path d="M413 119H571" stroke="#e8e8ed" />
        <path d="M413 119H456" stroke="#24252d" strokeWidth="1.5" />
        <g data-book-empty>
          <rect x="413" y="133" width="158" height="176" rx="10" fill="#f6f6f8" />
          <rect x="477" y="170" width="30" height="29" rx="7" fill="#fff" stroke="#e0e1e7" />
          <path d="M477 180h30m-23-14v9m16-9v9m-16 11h5m6 0h5m-16 5h5" stroke="#b4b6c0" strokeWidth="1.3" />
          <text x="492" y="225" textAnchor="middle" fill="#656773" fontSize="9" fontWeight="500">{t("empty")}</text>
          <text x="492" y="243" textAnchor="middle" fill="#a0a2ad" fontSize="8">{t("emptyHint")}</text>
          <path d="M453 264h78" stroke="#e1e2e8" />
        </g>
        <g data-book-confirmation className="invisible opacity-0">
          <rect x="413" y="133" width="158" height="164" rx="10" fill="#fff" stroke="#e4e5eb" />
          <circle cx="427" cy="150" r="4" fill="#3862f5" />
          <path d="m425 150 1.5 1.5 2.5-3" stroke="#fff" strokeWidth="0.9" />
          <text x="437" y="153" fill="#3862f5" fontSize="8" fontWeight="500">{t("confirmed")}</text>
          <text x="425" y="178" fill="#292b35" fontSize="12" fontWeight="600" letterSpacing="-0.3">{t("service")}</text>
          <text x="422" y="224" fill="#252730" fontSize="43" fontWeight="500" letterSpacing="-2">24</text>
          <text x="485" y="201" fill="#5a5d69" fontSize="10" fontWeight="500">{t("shortMonth")}</text>
          <text x="485" y="218" fill="#999ba5" fontSize="9">{t("dayLabel")}</text>
          <path d="M425 238H559" stroke="#ededef" />
          <circle cx="430" cy="255" r="4" stroke="#999ba6" /><path d="M430 252v3l2 1" stroke="#999ba6" />
          <text x="442" y="258" fill="#555866" fontSize="10">14:00 – 14:30</text>
          <rect x="426" y="272" width="8" height="6" rx="1.5" stroke="#999ba6" /><path d="m434 274 3-2v6l-3-2" stroke="#999ba6" />
          <text x="442" y="278" fill="#9395a0" fontSize="8">{t("meetingType")}</text>
          <rect x="413" y="308" width="158" height="25" rx="6" fill="#22242c" />
          <text x="426" y="324" fill="#fff" fontSize="9" fontWeight="500">{t("viewDetails")}</text>
          <path d="M547 320h11m-4-4 4 4-4 4" stroke="#fff" strokeWidth="1.1" />
        </g>
        <rect x="465" y="350" width="54" height="3" rx="2" fill="#1e2028" opacity="0.75" />
        <g data-book-cursor transform="translate(205 118)">
          <g data-book-pointer>
            <path d="M2 3v20l5.5-5 4 8 3-1.5-4-8 7-.5Z" fill="#000" opacity="0.15" transform="translate(1 1)" />
            <path d="M2 2v20l5.5-5 4 8 3-1.5-4-8 7-.5Z" fill="#fff" stroke="#24252e" strokeWidth="1.4" strokeLinejoin="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
