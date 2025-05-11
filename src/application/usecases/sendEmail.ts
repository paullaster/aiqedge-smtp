import { AppError, EmailEntity } from '../../domain/entities/emailEntity';
import { EmailStorageService } from '../services/emailStorageService';
import { SmtpService } from '../services/smtpService';
import { Email, EmailAttachment, RequestBody } from '../../types';
import { EmailTemplateBuilder } from '@brainspore/shackuz';

export const executeSendEmail = async (
  emailData: RequestBody,
  clientId: string,
  smtpService: SmtpService,
  emailStorageService: EmailStorageService
) => {
  // Validate required fields
  if (!emailData.to || !emailData.from || !emailData.subject || !emailData.body) {
    throw new AppError('Missing required email fields: to, from, subject', 400);
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
        filename = finalFilename;
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
  const html = htmlBuilder(emailData);
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
  const result = await smtpService.send(emailOptions);
  return result;
};


const htmlBuilder = (emailData: RequestBody) => {
  const emailBody = new EmailTemplateBuilder({ appConfig: { title: 'Email Service Prover' } });
  emailBody.addBlock('p', emailData.greetings || 'Greetings,', { fontWeight: 'bold' });
  for (const line of emailData.body) {
    emailBody.addBlock('l', line.line, line.style);
  }
  if (emailData.action) {
    for (const action of emailData.action) {
      emailBody.addBlock('b', action.capton, action.url, action.style);
    }
  }
  if (emailData.regards) {
    emailBody.addBlock('p', emailData.regards.caption);
    emailBody.addBlock('p', emailData.regards.name);
    emailBody.addBlock('p', emailData.regards.signature);
  }
  return emailBody.buildHTML();
}