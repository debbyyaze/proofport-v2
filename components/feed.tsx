import { ExternalLink, Sparkles } from "lucide-react";
import {
  describePublished,
  formatPublished,
  getPublishedDateTime,
  shortAddress,
  type ShipLog
} from "@/lib/proofport";

type FeedProps = {
  id?: string;
  logs: ShipLog[];
  emptyLabel: string;
  labelledBy?: string;
  onApplaud?: (id: number) => void;
  pendingApplauseId?: number | null;
};

function formatApplauseLabel(applause: number) {
  if (applause === 0) {
    return "No applause yet";
  }

  if (applause === 1) {
    return "1 applause reaction received";
  }

  return `${applause} applause reactions received`;
}

function getProofLinkFallbackCopy(log: ShipLog) {
  if (log.txUrl) {
    return "No public HTTPS proof link was attached. Share the explorer receipt below as the public proof for this entry.";
  }

  return "No public HTTPS proof link or explorer receipt is available yet. Share this public feed entry until a receipt is ready.";
}

function getReceiptFallbackCopy(log: ShipLog) {
  if (log.proofUri) {
    return "Explorer receipt is still pending. Share the public HTTPS proof link above until the wallet-signed receipt is available.";
  }

  return "Explorer receipt is still pending, so share this ProofPort feed entry for now.";
}

export function Feed({
  id,
  logs,
  emptyLabel,
  labelledBy,
  onApplaud,
  pendingApplauseId
}: FeedProps) {
  const countLabel = `${logs.length} public ${logs.length === 1 ? "entry" : "entries"} shown`;

  if (logs.length === 0) {
    return (
      <div
        className="empty-state"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="sr-only" aria-atomic="true">
          {countLabel}
        </p>
        <Sparkles size={24} aria-hidden="true" />
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {countLabel}
      </p>
      <div
        className="feed-list"
        id={id}
        role="list"
        aria-labelledby={labelledBy}
      >
        {logs.map((log) => {
          const isPending = pendingApplauseId === log.id;
          const articleId = `${log.network}-log-${log.id}`;
          const titleId = `${articleId}-title`;
          const metaId = `${articleId}-meta`;
          const proofStatusId = `${articleId}-proof-status`;
          const receiptStatusId = `${articleId}-receipt-status`;
          const applauseId = `${articleId}-applause`;
          const applauseStatusId = `${articleId}-applause-status`;
          const actionsLabelId = `${articleId}-actions-label`;
          const publishedDateTime = getPublishedDateTime(log);
          const publishedLabel =
            log.network === "stacks" ? "Anchor block" : "Published";
          const applauseLabel = formatApplauseLabel(log.applause);
          const describedBy = [
            metaId,
            log.proofUri ? null : proofStatusId,
            log.txUrl ? null : receiptStatusId
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <article
              aria-describedby={describedBy}
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
                  <dt>{publishedLabel}</dt>
                  <dd title={describePublished(log)}>
                    {publishedDateTime ? (
                      <time
                        dateTime={publishedDateTime}
                        aria-label={describePublished(log)}
                      >
                        {formatPublished(log)}
                      </time>
                    ) : (
                      <span aria-label={describePublished(log)}>
                        {formatPublished(log)}
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Applause</dt>
                  <dd id={applauseId} aria-live="polite" aria-atomic="true">
                    <span aria-hidden="true">{log.applause}</span>
                    <span className="sr-only">{applauseLabel}</span>
                  </dd>
                </div>
              </dl>
              <div
                className="log-actions"
                role="group"
                aria-labelledby={actionsLabelId}
              >
                <span className="sr-only" id={actionsLabelId}>
                  Actions for {log.summary}
                </span>
                {log.proofUri ? (
                  <a
                    href={log.proofUri}
                    target="_blank"
                    rel="ugc nofollow noopener noreferrer"
                    title={log.proofUri}
                    aria-label={`Open the public HTTPS proof link for ${log.summary} in a new tab`}
                  >
                    Open public HTTPS proof link (new tab)
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <p className="muted-link" id={proofStatusId} role="note">
                    {getProofLinkFallbackCopy(log)}
                  </p>
                )}
                {log.txUrl ? (
                  <a
                    href={log.txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={log.txUrl}
                    aria-label={`Open the explorer receipt for ${log.summary} in a new tab`}
                  >
                    Open explorer receipt (new tab)
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <p className="muted-link" id={receiptStatusId} role="note">
                    {getReceiptFallbackCopy(log)}
                  </p>
                )}
                {onApplaud ? (
                  <>
                    <button
                      type="button"
                      className="icon-text-button secondary"
                      onClick={() => onApplaud(log.id)}
                      disabled={isPending}
                      aria-busy={isPending}
                      aria-describedby={`${applauseId} ${applauseStatusId}`}
                      aria-label={
                        isPending
                          ? `Sending applause for ${log.summary}. ${applauseLabel}.`
                          : `Applaud ${log.summary}. ${applauseLabel}.`
                      }
                    >
                      <Sparkles size={16} aria-hidden="true" />
                      <span>{isPending ? "Sending applause..." : "Applaud"}</span>
                    </button>
                    <span
                      id={applauseStatusId}
                      className="sr-only"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {isPending ? `Sending applause for ${log.summary}.` : ""}
                    </span>
                  </>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
