import config from '../../config/config';
import SendEmail from '../../utils/email/send-email';

/**
 * Service function to create a new contactUs and send confirmation emails.
 *
 * @param data - The data to create a new contactUs.
 * @returns {Promise<string>} - A message indicating the result of the operation.
 */
const createContactUs = async (data: { email: string; name: string; [key: string]: any }) => {
  // Prepare email options for user confirmation
  const userEmailOptions = {
    to: data.email, // Send confirmation to the contact's email
    text: `Thank you for reaching out, ${data.name}. We have received your message.`,
    subject: 'Contact Us Confirmation',
    html: `<p>Dear ${data.name},</p><p>Thank you for reaching out to us. We have received your message and will get back to you soon.</p><p>Best regards,</p><p>Ambiance</p>`,
  };

  // Prepare email options for admin
  const adminEmailOptions = {
    to: config.EMAIL_ADMIN, // Admin email
    text: `New contact-us message from ${data.name}. Details: ${JSON.stringify(data)}`,
    subject: 'New Contact Us Message',
    html: `<p>You have a new contact-us message from ${data.name}.</p><p>Details:</p><pre>${JSON.stringify(data, null, 2)}</pre>`,
  };

  // Send the confirmation email to the user
  const userEmailSent = await SendEmail(userEmailOptions);

  // Send the email to the admin
  const adminEmailSent = await SendEmail(adminEmailOptions);

  // Check if emails were sent successfully and throw errors if they weren't
  if (!userEmailSent) {
    throw new Error('Failed to send confirmation email to user');
  }
  if (!adminEmailSent) {
    throw new Error('Failed to send email to admin');
  }

  return "We received your mail, we'll contact with you soon.";
};

export const contactUsServices = {
  createContactUs,
};
