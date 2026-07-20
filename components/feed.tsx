import { ExternalLink, Sparkles } from "lucide-react";
import {
  describePublished,
  formatPublished,
  getPublishedDateTime,
  shortAddress,
  type ShipLog
} from "@/lib/proofport";

type FeedProps = {
  logs: ShipLog[];
  emptyLabel: string;
  labelledBy?: string;
  onApplaud?: (id: number) => void;
  pendingApplauseId?: number | null;
};

export function Feed({
  logs,
  emptyLabel,
  labelledBy,
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
    <div className="feed-list" role="list" aria-labelledby={labelledBy}>
      {logs.map((log) => {
        const isPending = pendingApplauseId === log.id;
        const articleId = `${log.network}-log-${log.id}`;
        const titleId = `${articleId}-title`;
        const metaId = `${articleId}-meta`;
        const applauseId = `${articleId}-applause`;
        const publishedDateTime = getPublishedDateTime(log);

        return (
          <article
            aria-describedby={metaId}
            aria-labelledby={titleId}
            className="log-card"
            key={`${log.network}-${log.id}`}
            role="listitem"
          >
            <div className="log-head">
              <span aria-label={`Entry number ${log.id}`} className="log-id">
                #{log.id}
              </span>
              <span
                aria-label={`Tag ${log.tag || "proof"}`}
                className="log-tag"
              >
                {log.tag || "proof"}
              </span>
            </div>
            <h3 id={titleId}>{log.summary}</h3>
            <dl className="log-meta" id={metaId}>
              <div>
                <dt>Publisher</dt>
                <dd aria-label={log.author} title={log.author}>
                  {shortAddress(log.author)}
                </dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd title={describePublished(log)}>
                  {publishedDateTime ? (
                    <time dateTime={publishedDateTime}>{formatPublished(log)}</time>
                  ) : (
                    formatPublished(log)
                  )}
                </dd>
              </div>
              <div>
                <dt>Applause</dt>
                <dd id={applauseId} aria-live="polite" aria-atomic="true">
                  {log.applause}
                </dd>
              </div>
            </dl>
            <div className="log-actions">
              {log.proofUri ? (
                <a
                  aria-label={`Open proof link for ${log.summary} in a new tab`}
                  href={log.proofUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={log.proofUri}
                >
                  Open proof link
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              ) : (
                <span className="muted-link">
                  {log.txUrl
                    ? "No proof link attached. Use the explorer receipt below to verify."
                    : "No proof link attached."}
                </span>
              )}
              {log.txUrl ? (
                <a
                  aria-label={`Open explorer receipt for ${log.summary} in a new tab`}
                  href={log.txUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={log.txUrl}
                >
                  Open explorer receipt
                  <span className="sr-only"> (opens in a new tab)</span>
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
                  aria-describedby={applauseId}
                  aria-label={
                    isPending
                      ? `Sending applause for ${log.summary}. Current applause ${log.applause}`
                      : `Applaud ${log.summary}. Current applause ${log.applause}`
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
