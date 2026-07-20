import { CheckCircle2, CircleDashed, type LucideIcon } from "lucide-react";

type ReadinessItem = {
  label: string;
  detail: string;
  ready: boolean;
  icon: LucideIcon;
};

export function ReadinessGrid({ items }: { items: ReadinessItem[] }) {
  return (
    <section className="readiness-grid" aria-label="Project readiness">
      {items.map((item) => {
        const Icon = item.icon;
        const statusLabel = item.ready ? "Ready" : "Pending";
        return (
          <article className="readiness-card" key={item.label}>
            <div className="readiness-icon">
              <Icon size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </div>
            <span
              aria-label={`${item.label} status: ${statusLabel}`}
              className={item.ready ? "status-badge ready" : "status-badge pending"}
            >
              {item.ready ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <CircleDashed size={18} aria-hidden="true" />
              )}
              <span>{statusLabel}</span>
            </span>
          </article>
        );
      })}
    </section>
  );
}
