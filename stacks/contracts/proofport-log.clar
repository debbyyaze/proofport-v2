;; ProofPort public proof entries for Stacks.

(define-constant ERR_INVALID_INPUT (err u400))
(define-constant ERR_NOT_FOUND (err u404))

(define-data-var total-logs uint u0)

(define-map logs uint
  {
    id: uint,
    author: principal,
    summary: (string-ascii 160),
    proof-uri: (string-ascii 220),
    tag: (string-ascii 32),
    content-hash: (string-ascii 66),
    created-at: uint,
    applause: uint
  }
)

(define-public (create-log
    (summary (string-ascii 160))
    (proof-uri (string-ascii 220))
    (tag (string-ascii 32))
    (content-hash (string-ascii 66))
  )
  (let
    (
      (next-id (+ (var-get total-logs) u1))
      (summary-length (len summary))
    )
    (asserts! (> summary-length u0) ERR_INVALID_INPUT)
    (var-set total-logs next-id)
    (map-set logs next-id
      {
        id: next-id,
        author: tx-sender,
        summary: summary,
        proof-uri: proof-uri,
        tag: tag,
        content-hash: content-hash,
        created-at: stacks-block-height,
        applause: u0
      }
    )
    (print
      {
        event: "log-created",
        id: next-id,
        author: tx-sender,
        tag: tag,
        content-hash: content-hash
      }
    )
    (ok next-id)
  )
)

(define-public (applaud (id uint))
  (match (map-get? logs id)
    proof-entry
      (let
        (
          (next-applause (+ (get applause proof-entry) u1))
          (updated-log
            {
              id: (get id proof-entry),
              author: (get author proof-entry),
              summary: (get summary proof-entry),
              proof-uri: (get proof-uri proof-entry),
              tag: (get tag proof-entry),
              content-hash: (get content-hash proof-entry),
              created-at: (get created-at proof-entry),
              applause: next-applause
            }
          )
        )
        (map-set logs id updated-log)
        (print
          {
            event: "applauded",
            id: id,
            actor: tx-sender,
            applause: next-applause
          }
        )
        (ok next-applause)
      )
    ERR_NOT_FOUND
  )
)

(define-read-only (get-log (id uint))
  (match (map-get? logs id)
    proof-entry (ok proof-entry)
    ERR_NOT_FOUND
  )
)

(define-read-only (get-total-logs)
  (ok (var-get total-logs))
)
