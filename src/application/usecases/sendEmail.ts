import { AppError, EmailEntity } from '../../domain/entities/emailEntity.ts';
import { EmailStorageService } from '../services/emailStorageService.ts';
import { SmtpService } from '../services/smtpService.ts';
import { EmailTemplateBuilder } from '@brainspore/shackuz';
import type { Email, EmailAttachment, EmailPayload, RequestBody, SmtpConfigShape } from '../../types/index.ts';

export const executeSendEmail = async (
  emailData: RequestBody,
  clientId: string,
  smtpService: SmtpService,
  emailStorageService: EmailStorageService,
  smtpConfig: SmtpConfigShape
) => {
  const requiredParams = [
    { value: emailData, name: 'emailData' },
    { value: clientId, name: 'clientId' },
    { value: smtpService, name: 'smtpService' },
    { value: emailStorageService, name: 'emailStorageService' },
    { value: smtpConfig, name: 'smtpConfig' }
  ];
  for (const { value, name } of requiredParams) {
    if (value === undefined || value === null) {
      throw new AppError(`Missing required parameter: ${name}`, 400);
    }
  }
  // Validate required fields
  const content = emailData.html || emailData.body;
  const requiredFields = [
    { field: emailData.to, name: 'to' },
    { field: emailData.from, name: 'from' },
    { field: emailData.subject, name: 'subject' }
  ];
  for (const { field, name } of requiredFields) {
    if (!field) {
      throw new AppError(`Missing required email field: ${name}`, 400);
    }
  }
  if (content === undefined || content === null) {
    throw new AppError('Missing required email body', 400);
  }
  // Validate attachments if present
  if (emailData.attachments && !Array.isArray(emailData.attachments)) {
    throw new AppError('Attachments must be an array', 400);
  }
  let processedAttachments: EmailAttachment[] = [];
  if (emailData.attachments) {
    if (!clientId) {
      throw new AppError('Missing clientId in route parameters', 400);
    }
    processedAttachments = await Promise.all(emailData.attachments.map(async (att) => {
      if (!att.filename && !att.content) {
        throw new AppError('Each attachment must have at least a filename, path, or content', 400);
      }
      let filePath, filename, mimetype = '';
      if (att.content) {
        const { path, finalFilename, ext } = await emailStorageService.saveAttachmentFromBase64({
          base64Content: att.content,
          filename: att.filename,
          clientId,
          mimetype: att.mimetype
        });
        filePath = path;
        filename = finalFilename.split("_").slice(2).join('_');
        mimetype = ext
      }

      return {
        filename: filename,
        path: filePath,
        contentType: mimetype,
      };
    }));
    delete emailData.attachments
  }
  // Save email to DB
  let html: string = "";
  if (emailData.html) {
    html = emailData.html;
  } else {
    html = htmlBuilder(emailData);
  }
  const emailOptions: Email = {
    to: emailData.to,
    from: emailData.from,
    subject: emailData.subject,
    html: html,
    cc: emailData.cc,
    bcc: emailData.bcc,
    replyTo: emailData.replyTo,
    attachments: processedAttachments,
  }
  const emailEntity = new EmailEntity(emailOptions);
  await emailStorageService.saveEmail(emailEntity);
  // Send email (enqueue for background sending)
  const email: EmailPayload = {
    emailOptions,
    smtpConfig,
  };
  const result = await smtpService.send(email);
  return result;
};


const htmlBuilder = (emailData: RequestBody) => {
  const emailBody = new EmailTemplateBuilder({ appConfig: { title: 'Email Service Prover' } });
  emailBody.addBlock('p', emailData.greetings || 'Greetings,', { fontWeight: 'bold' });
  if ('body' in emailData && Array.isArray(emailData.body)) {
    for (const line of emailData.body) {
      emailBody.addBlock('p', line.line, line.style);
    }
  }
  if (emailData.actions) {
    for (const action of emailData.actions) {
      emailBody.addBlock('b', action.caption, action.url, action.style);
    }
  }
  if (emailData.regards) {
    emailBody.addBlock('d')
    emailBody.addBlock('p', emailData.regards.caption);
    emailBody.addBlock('p', emailData.regards.name);
    emailBody.addBlock('p', emailData.regards.signature);
  }
  return emailBody.buildHTML();
}