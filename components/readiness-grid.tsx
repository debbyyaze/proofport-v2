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
        const itemId = item.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const statusLabel = item.ready ? "Ready" : "Pending";
        const labelId = `${itemId}-label`;
        const detailId = `${itemId}-detail`;
        const statusId = `${itemId}-status`;
        return (
          <article
            aria-describedby={`${detailId} ${statusId}`}
            aria-labelledby={labelId}
            className="readiness-card"
            key={item.label}
          >
            <div className="readiness-icon">
              <Icon size={20} aria-hidden="true" />
            </div>
            <div>
              <h3 id={labelId}>{item.label}</h3>
              <p id={detailId}>{item.detail}</p>
            </div>
            <span
              className={item.ready ? "status-badge ready" : "status-badge pending"}
              id={statusId}
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
