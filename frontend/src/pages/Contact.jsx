import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiTimeLine,
  RiSendPlaneLine,
  RiCheckLine,
  RiUserLine,
  RiMessage2Line,
  RiAuctionLine,
  RiShieldCheckLine,
  RiCustomerService2Line
} from "react-icons/ri";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.CONTACT_SEND_MESSAGE, formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: RiMailLine,
      title: "Email Us",
      details: "support@bidwise.com",
      description: "Get in touch via email for detailed inquiries"
    },
    {
      icon: RiPhoneLine,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Speak directly with our support team"
    },
    {
      icon: RiTimeLine,
      title: "Response Time",
      details: "Within 24 hours",
      description: "We typically respond within one business day"
    }
  ];

  const commonSubjects = [
    "General Inquiry",
    "Technical Support",
    "Account Issues",
    "Auction Questions",
    "Payment Problems",
    "Feature Request",
    "Partnership",
    "Other"
  ];

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-background via-dashboard-bg to-background">
      <div className="max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <RiMessage2Line className="text-lg" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            We'd Love to
            <span className="text-primary block">Hear from You</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about BidWise? Need help with your account? 
            Want to share feedback? We're here to help and would love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-8 h-fit">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <RiCustomerService2Line className="text-primary" />
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-xl text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      <p className="text-primary font-medium mb-1">{info.details}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <RiShieldCheckLine className="text-primary" />
                  Why Choose BidWise?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <RiCheckLine className="text-green-500 text-sm" />
                    Secure and trusted platform
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckLine className="text-green-500 text-sm" />
                    24/7 customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckLine className="text-green-500 text-sm" />
                    Fast response times
                  </li>
                  <li className="flex items-center gap-2">
                    <RiCheckLine className="text-green-500 text-sm" />
                    Expert auction guidance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <RiSendPlaneLine className="text-primary" />
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <RiUserLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-300 ${
                          focusedField === 'name' 
                            ? 'border-primary focus:ring-2 focus:ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-300 ${
                          focusedField === 'email' 
                            ? 'border-primary focus:ring-2 focus:ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone and Subject Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number <span className="text-muted-foreground text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <RiPhoneLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-300 ${
                          focusedField === 'phone' 
                            ? 'border-primary focus:ring-2 focus:ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                        focusedField === 'subject' 
                          ? 'border-primary focus:ring-2 focus:ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      required
                    >
                      <option value="">Select a subject</option>
                      {commonSubjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <RiMessage2Line className="absolute left-3 top-3 text-muted-foreground" />
                    <textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-300 resize-none ${
                        focusedField === 'message' 
                          ? 'border-primary focus:ring-2 focus:ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimum 10 characters required
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-muted cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <RiSendPlaneLine className="text-lg" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/20 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Need Immediate Help?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              For urgent matters or technical issues, we're here to help you get back to bidding quickly
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiAuctionLine className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Auction Support</h3>
              <p className="text-sm text-muted-foreground">Get help with bidding, selling, or auction management</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiShieldCheckLine className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Account Security</h3>
              <p className="text-sm text-muted-foreground">Report security issues or get account recovery help</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiCustomerService2Line className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">General Support</h3>
              <p className="text-sm text-muted-foreground">Questions about features, policies, or platform usage</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-full">
            <RiCheckLine className="text-primary text-lg" />
            <span className="text-muted-foreground font-medium">
              We typically respond within 24 hours during business days
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
