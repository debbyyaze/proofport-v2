import { ExternalLink, Sparkles } from "lucide-react";
import { formatPublished, shortAddress, type ShipLog } from "@/lib/proofport";

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
      <div className="empty-state" role="status" aria-live="polite">
        <Sparkles size={24} aria-hidden="true" />
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="feed-list">
      {logs.map((log) => {
        const isPending = pendingApplauseId === log.id;
        const articleId = `${log.network}-log-${log.id}`;
        const titleId = `${articleId}-title`;
        const metaId = `${articleId}-meta`;

        return (
          <article
            aria-describedby={metaId}
            aria-labelledby={titleId}
            className="log-card"
            key={`${log.network}-${log.id}`}
          >
            <div className="log-head">
              <span className="log-id">#{log.id}</span>
              <span className="log-tag">{log.tag || "proof"}</span>
            </div>
            <h3 id={titleId}>{log.summary}</h3>
            <dl className="log-meta" id={metaId}>
              <div>
                <dt>Publisher</dt>
                <dd title={log.author}>{shortAddress(log.author)}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{formatPublished(log)}</dd>
              </div>
              <div>
                <dt>Applause</dt>
                <dd>{log.applause}</dd>
              </div>
            </dl>
            <div className="log-actions">
              {log.proofUri ? (
                <a
                  href={log.proofUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={log.proofUri}
                  aria-label={`Proof link for ${log.network} log #${log.id} (opens in a new tab)`}
                >
                  Proof link
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              ) : (
                <span className="muted-link">No proof link added</span>
              )}
              {log.txUrl ? (
                <a
                  href={log.txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={log.txUrl}
                  aria-label={`Explorer receipt for ${log.network} log #${log.id} (opens in a new tab)`}
                >
                  Explorer receipt
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              ) : null}
              {onApplaud ? (
                <button
                  type="button"
                  className="icon-text-button secondary"
                  onClick={() => onApplaud(log.id)}
                  disabled={isPending}
                  aria-busy={isPending}
                  aria-label={
                    isPending
                      ? `Sending applause for ${log.summary}`
                      : `Applaud ${log.summary}`
                  }
                >
                  <Sparkles size={16} aria-hidden="true" />
                  <span>{isPending ? "Sending..." : "Applaud"}</span>
                  {isPending ? (
                    <span className="sr-only" aria-live="polite">
                      Sending applause now
                    </span>
                  ) : null}
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
