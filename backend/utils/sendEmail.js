import nodeMailer from "nodemailer";

// Email templates
const emailTemplates = {
  welcome: (userName) => ({
    subject: "Welcome to BidWise - Your Auction Journey Begins! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to BidWise!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your premier online auction platform</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}! 👋</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to BidWise! We're excited to have you join our community of passionate collectors, 
            savvy buyers, and trusted sellers.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🚀 What you can do now:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Browse active auctions</li>
              <li>Place bids on items you love</li>
              <li>Create your own auctions</li>
              <li>Track your bidding history</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Start Bidding Now
            </a>
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
            Thank you for choosing BidWise! 🎯
          </p>
        </div>
      </div>
    `
  }),

  auctionCreated: (auctionTitle, userName) => ({
    subject: "🎯 Your Auction is Live on BidWise!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Auction Created Successfully!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Congratulations ${userName}! 🎉</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your auction "<strong>${auctionTitle}</strong>" is now live and visible to all BidWise users!
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📊 Next Steps:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Monitor your auction activity</li>
              <li>Respond to bidder questions</li>
              <li>Track bidding progress</li>
              <li>Prepare for auction completion</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Your Auction
            </a>
          </div>
        </div>
      </div>
    `
  }),

  bidPlaced: (auctionTitle, bidAmount, userName) => ({
    subject: "💰 Your Bid Has Been Placed Successfully!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Bid Placed Successfully!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Great job ${userName}! 🎯</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your bid of <strong>₹${bidAmount}</strong> has been placed on "<strong>${auctionTitle}</strong>".
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📈 Stay Updated:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>You'll be notified if you're outbid</li>
              <li>Track auction progress</li>
              <li>Place higher bids if needed</li>
              <li>Monitor auction end time</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/auctions" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Auction
            </a>
          </div>
        </div>
      </div>
    `
  }),

  auctionWon: (auctionTitle, finalPrice, userName, auctioneerInfo = null) => ({
    subject: "🏆 Congratulations! You Won the Auction!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 You Won!</h1>
          <p style="margin: 10px 0 0 0; font-weight: bold;">Congratulations on winning your auction!</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Amazing job ${userName}! 🏆</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You've successfully won "<strong>${auctionTitle}</strong>" for <strong>₹${finalPrice}</strong>!
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 15px;">📋 Next Steps:</h3>
            <ul style="color: #856404; line-height: 1.6;">
              <li>Complete payment within 24 hours</li>
              <li>Contact the seller for shipping details</li>
              <li>Leave feedback after receiving your item</li>
              <li>Enjoy your new purchase!</li>
            </ul>
          </div>
          
          ${auctioneerInfo && auctioneerInfo.paymentMethods ? `
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">💳 Payment Information</h3>
            <p style="color: #666; margin-bottom: 15px;">Please contact your auctioneer at <strong>${auctioneerInfo.email}</strong> before proceeding with payment.</p>
            
            ${auctioneerInfo.paymentMethods.bankTransfer && (auctioneerInfo.paymentMethods.bankTransfer.bankAccountName || auctioneerInfo.paymentMethods.bankTransfer.bankAccountNumber || auctioneerInfo.paymentMethods.bankTransfer.bankName) ? `
            <div style="margin-bottom: 15px;">
              <h4 style="color: #333; margin-bottom: 8px;">🏦 Bank Transfer</h4>
              <p style="color: #666; margin: 5px 0;">
                <strong>Account Name:</strong> ${auctioneerInfo.paymentMethods.bankTransfer.bankAccountName || 'Not provided'}<br>
                <strong>Account Number:</strong> ${auctioneerInfo.paymentMethods.bankTransfer.bankAccountNumber || 'Not provided'}<br>
                <strong>Bank:</strong> ${auctioneerInfo.paymentMethods.bankTransfer.bankName || 'Not provided'}
              </p>
            </div>
            ` : ''}
            
            ${auctioneerInfo.paymentMethods.upi && auctioneerInfo.paymentMethods.upi.upiId ? `
            <div style="margin-bottom: 15px;">
              <h4 style="color: #333; margin-bottom: 8px;">📱 UPI Payment</h4>
              <p style="color: #666; margin: 5px 0;">
                <strong>UPI ID:</strong> ${auctioneerInfo.paymentMethods.upi.upiId}
              </p>
            </div>
            ` : ''}
            
            ${auctioneerInfo.paymentMethods.paypal && auctioneerInfo.paymentMethods.paypal.paypalEmail ? `
            <div style="margin-bottom: 15px;">
              <h4 style="color: #333; margin-bottom: 8px;">🌐 PayPal</h4>
              <p style="color: #666; margin: 5px 0;">
                <strong>PayPal Email:</strong> ${auctioneerInfo.paymentMethods.paypal.paypalEmail}
              </p>
            </div>
            ` : ''}
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px;">
              <h4 style="color: #856404; margin-top: 0; margin-bottom: 8px;">📦 Cash on Delivery (COD)</h4>
              <p style="color: #856404; margin: 5px 0; font-size: 14px;">
                • 20% upfront payment required before delivery<br>
                • Remaining 80% paid upon delivery<br>
                • Contact auctioneer for COD arrangements
              </p>
            </div>
          </div>
          ` : `
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #2d5a2d; margin-top: 0; margin-bottom: 15px;">📞 Contact Auctioneer for Payment</h3>
            <p style="color: #2d5a2d; line-height: 1.6; margin-bottom: 15px;">
              <strong>Important:</strong> Please contact your auctioneer directly to get their payment details and complete your purchase.
            </p>
            <p style="color: #2d5a2d; line-height: 1.6;">
              They will provide you with their bank account details, UPI ID, or other preferred payment methods.
            </p>
          </div>
          `}
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              <strong>Note:</strong> ${auctioneerInfo && auctioneerInfo.paymentMethods ? 'Complete payment details are provided above.' : 'Payment details will be provided by the auctioneer directly.'}
            </p>
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #ffd700; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    `
  }),

  passwordReset: (resetLink, userName) => ({
    subject: "🔐 Password Reset Request - BidWise",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your BidWise account.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <a href="${resetLink}" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request this password reset, please ignore this email. 
            Your password will remain unchanged.
          </p>
          <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
            This link will expire in 1 hour for security reasons.
          </p>
        </div>
      </div>
    `
  })
};

// Main email sending function
export const sendEmail = async ({ email, subject, message, template, templateData, html }) => {
  // Check if email is enabled
  if (process.env.EMAIL_ENABLED !== 'true') {
    console.log('Email is disabled. Skipping email send.');
    return;
  }

  // Check if email credentials are properly configured
  if (!process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD || 
      process.env.SMTP_MAIL === 'your_email@gmail.com' || 
      process.env.SMTP_PASSWORD === 'your_app_password') {
    console.log('Email not configured. Skipping email send.');
    console.log('Email would have been sent to:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    return;
  }

  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Use template if provided, otherwise use html or message
    let emailSubject = subject;
    let emailContent = message;
    
    if (template && emailTemplates[template]) {
      const templateInfo = emailTemplates[template](...templateData);
      emailSubject = templateInfo.subject;
      emailContent = templateInfo.html;
    } else if (html) {
      // Use provided HTML content
      emailContent = html;
    }
    
    const options = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: emailSubject,
      text: message, // Fallback text version
      html: emailContent,
    };
    
    await transporter.sendMail(options);
    console.log('✅ Email sent successfully to:', email);
    console.log('📧 Subject:', emailSubject);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw error, just log it so the app continues to work
  }
};

// Convenience functions for common email types
export const sendWelcomeEmail = (email, userName) => {
  return sendEmail({
    email,
    template: 'welcome',
    templateData: [userName],
    message: `Welcome to BidWise, ${userName}!`
  });
};

export const sendAuctionCreatedEmail = (email, auctionTitle, userName) => {
  return sendEmail({
    email,
    template: 'auctionCreated',
    templateData: [auctionTitle, userName],
    message: `Your auction "${auctionTitle}" has been created successfully!`
  });
};

export const sendBidPlacedEmail = (email, auctionTitle, bidAmount, userName) => {
  return sendEmail({
    email,
    template: 'bidPlaced',
    templateData: [auctionTitle, bidAmount, userName],
    message: `Your bid of ₹${bidAmount} has been placed successfully!`
  });
};

// Enhanced auction won email with payment information
export const sendAuctionWonEmail = (email, auctionTitle, finalPrice, userName, auctioneerInfo = null) => {
  console.log('🔍 sendAuctionWonEmail called with:', {
    email,
    auctionTitle,
    finalPrice,
    userName,
    hasAuctioneerInfo: !!auctioneerInfo,
    auctioneerEmail: auctioneerInfo?.email,
    auctioneerPaymentMethods: auctioneerInfo?.paymentMethods
  });

  // Use the template with auctioneer info
  return sendEmail({
    email,
    template: 'auctionWon',
    templateData: [auctionTitle, finalPrice, userName, auctioneerInfo],
    message: `Congratulations! You won the auction for ${auctionTitle}!`
  });
};



export const sendPasswordResetEmail = (email, resetLink, userName) => {
  return sendEmail({
    email,
    template: 'passwordReset',
    templateData: [resetLink, userName],
    message: `Password reset requested for your BidWise account.`
  });
};
