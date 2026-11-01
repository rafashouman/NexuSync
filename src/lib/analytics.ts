import type { PILOT_MODALITIES } from "@/lib/pilot";

export type AnalyticsEvent =
  | { eventName: "page_view" }
  | {
      eventName: "pilot_cta_click" | "pilot_whatsapp_click";
      placement:
        | "header"
        | "hero"
        | "footer"
        | "floating"
        | "success"
        | "sticky_bar";
    }
  | {
      eventName: "marketing_plan_click" | "whatsapp_click";
      plan_id: string;
      section: string;
      destination: "whatsapp";
    }
  | { eventName: "pilot_form_start" | "pilot_lead_save_error" }
  | {
      eventName: "pilot_form_validation_error";
      field: "name" | "whatsapp" | "consent";
    }
  | {
      eventName: "pilot_modality_select";
      modality: (typeof PILOT_MODALITIES)[number];
    }
  | { eventName: "pilot_capital_select"; capitalInsured: number }
  | { eventName: "pilot_faq_open"; faqIndex: number }
  | {
      eventName: "pilot_lead_submitted";
      modality: (typeof PILOT_MODALITIES)[number];
      capitalInsured: number;
    }
  | {
      eventName: "game_start" | "game_end" | "game_high_score";
      appId: "arknoid";
      score?: number;
      durationSeconds?: number;
    }
  | {
      eventName: "miniapp_interaction";
      appId: "image-blend";
      action:
        | "preset"
        | "layer_visibility"
        | "blend_mode"
        | "reset"
        | "copy_css"
        | "background_color"
        | "opacity";
    };

// Analytics de terceiros foi removido; este ponto de extensão não envia nada.
export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  void event;
}
