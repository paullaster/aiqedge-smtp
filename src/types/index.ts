import { Model } from 'sequelize';
import type { ModelStatic, Optional } from 'sequelize';

export interface Email {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  inReplyTo?: string;
  references?: string | string[];
  attachments?: Array<EmailAttachment>;
  headers?: { [key: string]: string };
  priority?: 'high' | 'normal' | 'low';
}
export interface EmailAttachment {
  filename?: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
  encoding?: string;
  cid?: string;
}

export interface RequestBody {
  greetings?: string,
  to: string | string[];
  from: string;
  subject: string;
  body?: BodyOfRequestTypes[];
  html?: string;
  actions?: ActionOfRequestTypes[];
  regards?: EmailRegardsType
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    mimetype: string;
    ext?: string;
  }>;
}

export interface BodyOfRequestTypes {
  line: string,
  style?: Record<string, any>,
}

export interface ActionOfRequestTypes {
  caption: string,
  url: string,
  style?: Record<string, any>,
}

export interface EmailRegardsType {
  caption: string;
  name?: string;
  signature?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export type Rotation = 'daily' | 'size'

export type Environments = 'development' | 'test' | 'staging' | 'production'

export interface EmailAttributes {
  id: number;
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  attachments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmailCreationAttributes extends Optional<EmailAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export interface ModelTypes {
  Email: ModelStatic<Model<EmailAttributes, EmailCreationAttributes>>;
}

export type EmailProviders = 'nodemailer';

export interface ILogger {
  log(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
}

type SmtpAuth = {
  user: string;
  pass: string;
};

export type SmtpConfigShape = {
  host: string;
  port: number;
  secure: boolean;
  auth: SmtpAuth;
};

export type EmailPayload = {
  emailOptions: Email,
  smtpConfig: SmtpConfigShape,
}

export interface SMTPConfig {
  from: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
}

export type SMTPClient = {
  name: string;
  config: SMTPConfig;
}

export type SMTPClientWithId = SMTPClient & { id: string };