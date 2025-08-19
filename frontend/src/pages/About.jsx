import React from "react";
import {
  RiAuctionLine,
  RiShieldCheckLine,
  RiTeamLine,
  RiLightbulbLine,
  RiHeartLine,
  RiStarLine,
  RiCheckLine,
  RiArrowRightLine
} from "react-icons/ri";

const About = () => {
  const values = [
    {
      id: 1,
      title: "Trust & Security",
      description: "We prioritize the security and trust of our users with advanced encryption and secure payment systems.",
      icon: RiShieldCheckLine,
      color: "text-blue-600"
    },
    {
      id: 2,
      title: "Innovation",
      description: "Cutting-edge technology and features that provide a seamless and efficient auction experience.",
      icon: RiLightbulbLine,
      color: "text-yellow-600"
    },
    {
      id: 3,
      title: "Community",
      description: "A vibrant community of buyers and sellers who share a passion for exceptional items and fair deals.",
      icon: RiTeamLine,
      color: "text-green-600"
    },
    {
      id: 4,
      title: "Excellence",
      description: "Committed to providing exceptional customer support and resources for the best auction experience.",
      icon: RiStarLine,
      color: "text-purple-600"
    },
  ];

  const stats = [
    { number: "100+", label: "Active Users" },
    { number: "1K+", label: "Auctions Completed" },
    { number: "₹200K+", label: "Total Value" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  const features = [
    "Secure Payment Processing",
    "Real-time Bidding",
    "Advanced Search & Filters",
    "24/7 Customer Support",
    "Less Commission",
    "Bid History Tracking"
  ];

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-background via-dashboard-bg to-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <RiAuctionLine className="text-lg" />
            About BidWise
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            New 
            <span className="text-primary block">Online Auctions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            BidWise is the premier online auction platform that connects passionate collectors,
            savvy buyers, and trusted sellers in a secure, transparent, and engaging marketplace.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              To democratize the auction experience by providing a platform that's accessible,
              transparent, and enjoyable for everyone. We believe that everyone should have the
              opportunity to discover unique treasures and participate in the excitement of bidding.
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span>Learn More</span>
              <RiArrowRightLine className="text-lg" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-3xl border border-primary/20">
            <div className="text-center">
              <RiHeartLine className="text-6xl text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Built with Love</h3>
              <p className="text-muted-foreground">
                Every feature is designed with our users in mind
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape the BidWise experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.id} className="group p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                <div className={`w-12 h-12 ${value.color} bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
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
              Experience the difference with our cutting-edge features and user-centric design
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all duration-300">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <RiCheckLine className="text-primary text-lg" />
                </div>
                <span className="text-foreground font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-3xl border border-primary/20">
            <div className="text-center">
              <RiAuctionLine className="text-6xl text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Journey</h3>
              <p className="text-muted-foreground">
                From concept to reality, building the future of auctions
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              BidWise was born from a vision to make auctions accessible to everyone.
              Founded by passionate developers and auction enthusiasts, we've created a
              platform that combines cutting-edge technology with the timeless excitement
              of bidding.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we're proud to serve thousands of users who trust us with their
              valuable items and bidding experiences. Our commitment to innovation and
              user satisfaction drives us forward every day.
            </p>
          </div>
        </div>


        {/* Footer Note */}
        <div className="text-center pb-12">
          <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-full">
            <RiStarLine className="text-primary text-lg" />
            <span className="text-muted-foreground font-medium">
              Thank you for choosing BidWise. We look forward to being part of your auction journey!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
