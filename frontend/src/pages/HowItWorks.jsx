import React from "react";
import {
  RiUserAddLine,
  RiAuctionLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiFileTextLine,
  RiRefreshLine,
  RiArrowRightLine,
  RiCheckLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiTeamLine,
  RiStarLine
} from "react-icons/ri";

const HowItWorks = () => {
  const steps = [
    {
      icon: RiUserAddLine,
      title: "User Registration",
      description: "Create your account as either a Bidder or Auctioneer to start your auction journey.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: RiAuctionLine,
      title: "Role Selection",
      description: "Choose your role - Bidders can participate in auctions, Auctioneers can create and manage listings.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: RiMailLine,
      title: "Winning Bid Notification",
      description: "Get instant email notifications when you win, with complete payment instructions and auctioneer contact details.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: RiMoneyDollarCircleLine,
      title: "Commission Payment",
      description: "Auctioneers pay a 5% commission on successful sales to support platform maintenance and development.",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      icon: RiFileTextLine,
      title: "Proof of Payment",
      description: "Submit payment proof for verification. Once approved, your commission status is automatically updated.",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: RiRefreshLine,
      title: "Reposting Items",
      description: "If a bidder doesn't pay, auctioneers can repost items at no additional cost to maximize success.",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ];

  const features = [
    {
      icon: RiShieldCheckLine,
      title: "Secure Platform",
      description: "Advanced security measures protect your data and transactions"
    },
    {
      icon: RiTimeLine,
      title: "24/7 Access",
      description: "Bid and manage auctions anytime, anywhere with our mobile-friendly platform"
    },
    {
      icon: RiTeamLine,
      title: "Community Driven",
      description: "Join thousands of passionate collectors and sellers in our growing community"
    },
    {
      icon: RiStarLine,
      title: "Premium Experience",
      description: "Professional tools and features designed for serious auction enthusiasts"
    }
  ];

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-background via-dashboard-bg to-background">
      <div className="max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <RiAuctionLine className="text-lg" />
            How BidWise Works
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Simple Steps to
            <span className="text-primary block">Auction Success</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how easy it is to buy, sell, and participate in auctions on BidWise. 
            Our streamlined process ensures a smooth experience for everyone.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Auction Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to get started with your auction journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:shadow-xl ${step.bgColor} ${step.borderColor} hover:border-primary/50`}
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                {/* Arrow for connection */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-primary opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                    <RiArrowRightLine className="text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose BidWise?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the advantages that make us the preferred auction platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-2xl text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who are already enjoying the BidWise experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiUserAddLine className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">1. Sign Up</h3>
              <p className="text-sm text-muted-foreground">Create your account in minutes</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiAuctionLine className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">2. Choose Role</h3>
              <p className="text-sm text-muted-foreground">Bidder or Auctioneer</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiCheckLine className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">3. Start Bidding</h3>
              <p className="text-sm text-muted-foreground">Begin your auction journey</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-full">
            <RiStarLine className="text-primary text-lg" />
            <span className="text-muted-foreground font-medium">
              Have questions? Our support team is here to help you succeed!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
