# 📧 BidWise Email Configuration Guide

## 🚀 Quick Setup

### 1. **Gmail Setup (Recommended for Development)**

#### **Step 1: Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "2-Step Verification"
3. Enable 2-Step Verification if not already enabled

#### **Step 2: Generate App Password**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Enter "BidWise" as the name
5. Click "Generate"
6. **Copy the 16-character password** (this is your `SMTP_PASSWORD`)

#### **Step 3: Update Config File**
```env
# Email Configuration
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SERVICE = gmail
SMTP_MAIL = your_email@gmail.com
SMTP_PASSWORD = your_16_character_app_password
SMTP_FROM_NAME = BidWise
SMTP_FROM_EMAIL = noreply@bidwise.com
EMAIL_ENABLED = true
```

### 2. **Outlook/Hotmail Setup**

```env
# Email Configuration
SMTP_HOST = smtp-mail.outlook.com
SMTP_PORT = 587
SMTP_SERVICE = outlook
SMTP_MAIL = your_email@outlook.com
SMTP_PASSWORD = your_password
SMTP_FROM_NAME = BidWise
SMTP_FROM_EMAIL = noreply@bidwise.com
EMAIL_ENABLED = true
```

### 3. **Yahoo Mail Setup**

```env
# Email Configuration
SMTP_HOST = smtp.mail.yahoo.com
SMTP_PORT = 587
SMTP_SERVICE = yahoo
SMTP_MAIL = your_email@yahoo.com
SMTP_PASSWORD = your_app_password
SMTP_FROM_NAME = BidWise
SMTP_FROM_EMAIL = noreply@bidwise.com
EMAIL_ENABLED = true
```

## 🔧 Production Email Services

### **1. SendGrid (Recommended for Production)**

#### **Setup:**
1. Create account at [SendGrid](https://sendgrid.com/)
2. Verify your domain
3. Create API key
4. Update config:

```env
# Email Configuration
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_SERVICE = sendgrid
SMTP_MAIL = apikey
SMTP_PASSWORD = your_sendgrid_api_key
SMTP_FROM_NAME = BidWise
SMTP_FROM_EMAIL = noreply@yourdomain.com
EMAIL_ENABLED = true
```

### **2. Amazon SES**

```env
# Email Configuration
SMTP_HOST = email-smtp.us-east-1.amazonaws.com
SMTP_PORT = 587
SMTP_SERVICE = ses
SMTP_MAIL = your_ses_smtp_username
SMTP_PASSWORD = your_ses_smtp_password
SMTP_FROM_NAME = BidWise
SMTP_FROM_EMAIL = noreply@yourdomain.com
EMAIL_ENABLED = true
```

### **3. Mailgun**

```env
# Email Configuration
SMTP_HOST = smtp.mailgun.org
SMTP_PORT = 587
SMTP_SERVICE = mailgun
SMTP_MAIL = postmaster@yourdomain.mailgun.org
SMTP_PASSWORD = your_mailgun_password
SMTP_FROM_NAME = BidWise
SMTP_FROM_EMAIL = noreply@yourdomain.com
EMAIL_ENABLED = true
```

## 📧 Available Email Templates

### **1. Welcome Email**
```javascript
import { sendWelcomeEmail } from '../utils/sendEmail.js';

// Send welcome email when user registers
await sendWelcomeEmail(user.email, user.userName);
```

### **2. Auction Created**
```javascript
import { sendAuctionCreatedEmail } from '../utils/sendEmail.js';

// Send email when auction is created
await sendAuctionCreatedEmail(user.email, auction.title, user.userName);
```

### **3. Bid Placed**
```javascript
import { sendBidPlacedEmail } from '../utils/sendEmail.js';

// Send email when bid is placed
await sendBidPlacedEmail(user.email, auction.title, bidAmount, user.userName);
```

### **4. Auction Won**
```javascript
import { sendAuctionWonEmail } from '../utils/sendEmail.js';

// Send email when user wins auction
await sendAuctionWonEmail(user.email, auction.title, finalPrice, user.userName);
```

### **5. Password Reset**
```javascript
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

// Send password reset email
await sendPasswordResetEmail(user.email, resetLink, user.userName);
```

## 🧪 Testing Email Configuration

### **1. Test Email Function**
```javascript
import { sendEmail } from '../utils/sendEmail.js';

// Test basic email
await sendEmail({
  email: 'test@example.com',
  subject: 'Test Email from BidWise',
  message: 'This is a test email to verify your configuration.'
});
```

### **2. Test Template Email**
```javascript
import { sendWelcomeEmail } from '../utils/sendEmail.js';

// Test welcome email template
await sendWelcomeEmail('test@example.com', 'Test User');
```

## ⚠️ Troubleshooting

### **Common Issues:**

#### **1. "Invalid login" Error**
- ✅ Check if 2FA is enabled
- ✅ Use App Password, not regular password
- ✅ Verify email and password are correct

#### **2. "Connection timeout" Error**
- ✅ Check firewall settings
- ✅ Verify SMTP port (587 or 465)
- ✅ Check internet connection

#### **3. "Authentication failed" Error**
- ✅ Enable "Less secure app access" (Gmail)
- ✅ Use App Password instead of regular password
- ✅ Check if account is locked

#### **4. Emails not sending**
- ✅ Check `EMAIL_ENABLED = true`
- ✅ Verify all environment variables
- ✅ Check console logs for errors
- ✅ Test with simple email first

## 🔒 Security Best Practices

### **1. Environment Variables**
- ✅ Never commit passwords to git
- ✅ Use `.env` files for local development
- ✅ Use secure environment variables in production

### **2. Email Validation**
- ✅ Validate email addresses before sending
- ✅ Implement rate limiting
- ✅ Use SPF, DKIM, and DMARC records

### **3. Production Considerations**
- ✅ Use dedicated email service (SendGrid, SES, Mailgun)
- ✅ Implement email queuing for high volume
- ✅ Monitor delivery rates and bounces
- ✅ Set up proper DNS records

## 📱 Integration Examples

### **1. User Registration**
```javascript
// In userController.js
export const register = catchAsyncErrors(async (req, res, next) => {
  // ... user creation logic ...
  
  // Send welcome email
  await sendWelcomeEmail(user.email, user.userName);
  
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user
  });
});
```

### **2. Auction Creation**
```javascript
// In auctionController.js
export const createAuction = catchAsyncErrors(async (req, res, next) => {
  // ... auction creation logic ...
  
  // Send confirmation email
  await sendAuctionCreatedEmail(req.user.email, auction.title, req.user.userName);
  
  res.status(201).json({
    success: true,
    auction
  });
});
```

### **3. Bid Placement**
```javascript
// In bidController.js
export const placeBid = catchAsyncErrors(async (req, res, next) => {
  // ... bid placement logic ...
  
  // Send bid confirmation email
  await sendBidPlacedEmail(req.user.email, auction.title, bidAmount, req.user.userName);
  
  res.status(200).json({
    success: true,
    bid
  });
});
```

## 🎯 Next Steps

1. **Choose your email service** (Gmail for dev, SendGrid for production)
2. **Update your config file** with proper credentials
3. **Test email functionality** with simple emails
4. **Integrate email templates** into your controllers
5. **Monitor email delivery** and user engagement
6. **Set up email analytics** for better insights

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify your email service credentials
3. Test with a simple email first
4. Check your email service's documentation
5. Ensure all environment variables are set correctly

---

**Happy emailing! 🚀📧**
