import SmtpController from '../src/interfaces/controllers/smtpController';
import { SmtpService } from '../src/application/services/smtpService';
import { ISmtpProvider } from '../src/domain/repositories/smtpRepository';

// Mock Express request/response for controller tests
const mockRequest = (body = {}) => ({ body } as any);
const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('SmtpController', () => {
  let smtpController: SmtpController;
  let smtpService: SmtpService;
  let smtpProvider: ISmtpProvider;

  beforeEach(() => {
    smtpProvider = {
      sendMail: jest.fn().mockResolvedValue({ success: true, message: 'Email sent successfully' })
    };
    smtpService = new SmtpService(smtpProvider);
    smtpController = new SmtpController(smtpService);
  });

  test('should send an email successfully', async () => {
    const emailData = {
      to: 'test@example.com',
      from: 'sender@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };
    const req = mockRequest(emailData);
    const res = mockResponse();

    await smtpController.sendEmail(req, res);

    expect(smtpProvider.sendMail).toHaveBeenCalledWith(emailData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email sent successfully', result: { success: true, message: 'Email sent successfully' } });
  });

  test('should handle errors when sending an email', async () => {
    (smtpProvider.sendMail as jest.Mock).mockRejectedValueOnce(new Error('Send failed'));
    const emailData = {
      to: 'test@example.com',
      from: 'sender@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };
    const req = mockRequest(emailData);
    const res = mockResponse();

    await smtpController.sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error sending email', error: 'Send failed' });
  });
});