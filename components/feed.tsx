import { ExternalLink, Sparkles } from "lucide-react";
import { formatDate, shortAddress, type ShipLog } from "@/lib/proofport";

type FeedProps = {
  logs: ShipLog[];
  emptyLabel: string;
  onApplaud?: (id: number) => void;
  pendingApplauseId?: number | null;
};

export function Feed({
  logs,
  emptyLabel,
  onApplaud,
  pendingApplauseId
}: FeedProps) {
  if (logs.length === 0) {
    return (
      <div className="empty-state">
        <Sparkles size={24} aria-hidden="true" />
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="feed-list">
      {logs.map((log) => (
        <article className="log-card" key={`${log.network}-${log.id}`}>
          <div className="log-head">
            <span className="log-id">#{log.id}</span>
            <span className="log-tag">{log.tag || "proof"}</span>
          </div>
          <h3>{log.summary}</h3>
          <dl className="log-meta">
            <div>
              <dt>Publisher</dt>
              <dd>{shortAddress(log.author)}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{formatDate(log.createdAt)}</dd>
            </div>
            <div>
              <dt>Applause</dt>
              <dd>{log.applause}</dd>
            </div>
          </dl>
          <div className="log-actions">
            {log.proofUri ? (
              <a href={log.proofUri} target="_blank" rel="noreferrer">
                Proof link <ExternalLink size={15} aria-hidden="true" />
              </a>
            ) : (
              <span className="muted-link">No proof link</span>
            )}
            {log.txUrl ? (
              <a href={log.txUrl} target="_blank" rel="noreferrer">
                Explorer receipt <ExternalLink size={15} aria-hidden="true" />
              </a>
            ) : null}
            {onApplaud ? (
              <button
                type="button"
                className="icon-text-button secondary"
                onClick={() => onApplaud(log.id)}
                disabled={pendingApplauseId === log.id}
              >
                <Sparkles size={16} aria-hidden="true" />
                {pendingApplauseId === log.id ? "Sending" : "Applaud"}
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
