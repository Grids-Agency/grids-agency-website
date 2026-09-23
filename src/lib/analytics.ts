export type AnalyticsEventParameters = {
  cta_click: {
    cta_location: string;
    cta_text: string;
  };
  contact_start: {
    form_name: string;
  };
  generate_lead: {
    form_name: string;
  };
  view_project: {
    project_name: string;
  };
  comparison_interaction: {
    section: string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventParameters;

type WindowWithDataLayer = Window & {
  dataLayer?: unknown[];
};

/** Push a typed custom event to the globally installed GTM data layer. */
export function trackEvent<EventName extends AnalyticsEventName>(
  event: EventName,
  parameters: AnalyticsEventParameters[EventName],
): void {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as WindowWithDataLayer;
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.dataLayer.push({ event, ...parameters });
}
