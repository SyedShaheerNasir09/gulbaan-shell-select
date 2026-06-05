/**
 * Tiny analytics helper that forwards events to GA4 (gtag) and Microsoft Clarity
 * if they are loaded. Safe to call anywhere (no-ops on the server / when unset).
 */
type Params = Record<string, unknown>;

interface AnalyticsWindow extends Window {
  gtag?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }
  if (typeof w.clarity === "function") {
    try {
      w.clarity("event", event);
    } catch {
      /* ignore */
    }
  }
}

export const analytics = {
  viewItem: (name: string, category?: string) =>
    track("view_item", { item_name: name, item_category: category }),
  viewCategory: (name: string) =>
    track("view_item_list", { item_list_name: name }),
  search: (term: string) => track("search", { search_term: term }),
  selectPromotion: (name: string) =>
    track("select_promotion", { promotion_name: name }),
  findStore: () => track("find_store", {}),
};
