export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EmailEntity {
  id?: number;
  /** Required: Recipient(s) */
  to: string | string[];
  /** Required: Sender */
  from: string;
  /** Required: Subject */
  subject: string;
  /** Required: Plain text body */
  // Optional fields
  html?: string; // html body
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  inReplyTo?: string;
  references?: string | string[];
  attachments?: Array<{
    filename?: string;
    content?: string | Buffer;
    path?: string;
    href?: string;
    contentType?: string;
    contentDisposition?: string;
    cid?: string;
    encoding?: string;
    headers?: { [key: string]: string };
    raw?: string | Buffer;
  }>;
  headers?: { [key: string]: string };
  priority?: 'high' | 'normal' | 'low';

  constructor({
    id,
    to,
    from,
    subject,
    html,
    cc,
    bcc,
    replyTo,
    inReplyTo,
    references,
    attachments,
    headers,
    priority
  }: {
    id?: number;
    to: string | string[];
    from: string;
    subject: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    inReplyTo?: string;
    references?: string | string[];
    attachments?: Array<{
      filename?: string;
      content?: string | Buffer;
      path?: string;
      href?: string;
      contentType?: string;
      contentDisposition?: string;
      cid?: string;
      encoding?: string;
      headers?: { [key: string]: string };
      raw?: string | Buffer;
    }>;
    headers?: { [key: string]: string };
    priority?: 'high' | 'normal' | 'low';
  }) {
    this.id = id;
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.html = html;
    this.cc = cc;
    this.bcc = bcc;
    this.replyTo = replyTo;
    this.inReplyTo = inReplyTo;
    this.references = references;
    this.attachments = attachments;
    this.headers = headers;
    this.priority = priority;
  }
}