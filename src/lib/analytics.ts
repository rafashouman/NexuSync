import type { PILOT_MODALITIES } from "@/lib/pilot";
import type { QuoteSection } from "@/lib/quote";

/** Service categories of the home search simulator; free text is never sent, only "outro". */
export type HomeSearchCategory = "hamburgueria" | "loja de roupas" | "dentista" | "pizzaria" | "eletricista" | "advogado" | "pet shop" | "barbearia" | "outro";

export type AnalyticsEvent =
  | { eventName: "page_view" }
  | {
      eventName: "quote_whatsapp_click" | "quote_interest_select";
      interest: string;
      section: QuoteSection;
    }
  | {
      eventName: "quote_form_start";
      section: QuoteSection;
    }
  | {
      eventName: "contact_submit_success";
      interest: string;
      section: QuoteSection;
    }
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
      destination: "whatsapp" | "form";
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
  | { eventName: "home_search_simulated"; category: HomeSearchCategory; input: "chip" | "typed" }
  | { eventName: "home_video_play" | "home_method_complete" | "design_video_play" }
  | {
      eventName: "game_start" | "game_end" | "game_high_score";
      appId: "arknoid";
      score?: number;
      durationSeconds?: number;
    }
  | {
      /** CPA calculator: only the action is sent, never the numbers typed. */
      eventName: "cpa_calculator_interaction";
      action: "mode_site" | "mode_whatsapp" | "goal_target" | "add_product" | "copy_summary" | "whatsapp_click";
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

export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const { eventName, ...params } = event;
  window.gtag("event", eventName, params);
}
