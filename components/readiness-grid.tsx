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
              className={item.ready ? "status-dot ready" : "status-dot pending"}
              aria-label={item.ready ? "Ready" : "Pending"}
            >
              {item.ready ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <CircleDashed size={18} aria-hidden="true" />
              )}
            </span>
          </article>
        );
      })}
    </section>
  );
}
