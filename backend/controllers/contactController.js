import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendContactMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return next(new ErrorHandler("Name, email, subject, and message are required.", 400));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please provide a valid email address.", 400));
  }

  try {
    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_MAIL || 'admin@bidwise.com';
    
    const emailSubject = `New Contact Form Submission: ${subject}`;
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Contact Message</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone has reached out to BidWise</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">📋 Message Information</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              <strong>Subject:</strong> ${subject}<br>
              <strong>Message:</strong><br>
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-top: 0; margin-bottom: 15px;">👤 Sender Information</h3>
            <p style="color: #2d5a2d; line-height: 1.6;">
              <strong>Name:</strong> ${name}<br>
              <strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a><br>
              ${phone ? `<strong>Phone:</strong> ${phone}<br>` : ''}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reply to Sender
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
            This message was sent from the BidWise contact form
          </p>
        </div>
      </div>
    `;

    // Send email to admin
    await sendEmail({
      email: adminEmail,
      subject: emailSubject,
      message: emailMessage
    });

    // Send confirmation email to user
    const userEmailSubject = "Thank you for contacting BidWise!";
    const userEmailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Message Received!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out to BidWise</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}! 👋</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We've received your message and our team will get back to you as soon as possible.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">📝 Your Message Summary</h3>
            <p style="color: #666; line-height: 1.6;">
              <strong>Subject:</strong> ${subject}<br>
              <strong>Message:</strong><br>
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-top: 0; margin-bottom: 15px;">⏰ What Happens Next?</h3>
            <ul style="color: #2d5a2d; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Our team will review your message within 24 hours</li>
              <li>We'll respond via email or phone (if provided)</li>
              <li>For urgent matters, please call our support line</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Visit BidWise
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
            Thank you for choosing BidWise! 🎯
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      email: email,
      subject: userEmailSubject,
      message: userEmailMessage
    });

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully! We'll get back to you soon.",
      data: {
        name,
        email,
        subject,
        messageId: Date.now() // Simple message ID for reference
      }
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return next(new ErrorHandler("Failed to send message. Please try again later.", 500));
  }
});
