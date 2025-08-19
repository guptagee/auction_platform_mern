import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiTimeLine, RiMoneyDollarCircleLine, RiArrowRightLine, RiPriceTag3Line } from "react-icons/ri";

const Card = ({ 
  imgSrc, 
  title, 
  startingBid, 
  startTime, 
  endTime, 
  id, 
  viewMode = "grid",
  category,
  currentBid,
  description
}) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDifference = new Date(startTime) - now;
    const endDifference = new Date(endTime) - now;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Starts In:",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      timeLeft = {
        type: "Ends In:",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    });
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `(${days} Days) ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Get auction status
  const getAuctionStatus = () => {
    const now = new Date();
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    
    if (now < startTimeDate) return { status: "upcoming", color: "warning", text: "Upcoming" };
    if (now > endTimeDate) return { status: "ended", color: "destructive", text: "Ended" };
    return { status: "active", color: "success", text: "Active" };
  };

  const auctionStatus = getAuctionStatus();

  if (viewMode === "list") {
    return (
      <Link
        to={`/auction/item/${id}`}
        className="block bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="lg:w-48 lg:flex-shrink-0">
            <div className="relative">
              <img
                src={imgSrc || "/imageHolder.jpg"}
                alt={title}
                className="w-full h-32 lg:h-40 object-cover rounded-lg"
              />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white bg-${auctionStatus.color}`}>
                {auctionStatus.text}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {category && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    <RiPriceTag3Line size={12} />
                    {category}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2 py-1 bg-${auctionStatus.color}/10 text-${auctionStatus.color} text-xs font-medium rounded-full`}>
                  {auctionStatus.text}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {title}
              </h3>
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <RiMoneyDollarCircleLine className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-xs text-muted-foreground">Starting Bid</p>
                  <p className="font-semibold text-foreground">${startingBid?.toLocaleString()}</p>
                </div>
              </div>
              
              {currentBid > startingBid && (
                <div className="flex items-center gap-2">
                  <RiMoneyDollarCircleLine className="text-success" size={18} />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Bid</p>
                    <p className="font-semibold text-success">${currentBid?.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <RiTimeLine className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-xs text-muted-foreground">{timeLeft.type}</p>
                  <p className="font-semibold text-foreground">
                    {Object.keys(timeLeft).length > 1 ? formatTimeLeft(timeLeft) : "Time's up!"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Click to view details and place bids
              </div>
              <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                <span className="text-sm font-medium">View Auction</span>
                <RiArrowRightLine size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link
      to={`/auction/item/${id}`}
      className="block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
    >
      {/* Image Container */}
      <div className="relative">
        <img
          src={imgSrc || "/imageHolder.jpg"}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white bg-${auctionStatus.color} shadow-lg`}>
          {auctionStatus.text}
        </div>

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            {category}
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white text-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              View Auction
              <RiArrowRightLine size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RiMoneyDollarCircleLine className="text-muted-foreground" size={16} />
              <span className="text-sm text-muted-foreground">Starting Bid</span>
            </div>
            <span className="font-semibold text-foreground">${startingBid?.toLocaleString()}</span>
          </div>

          {currentBid > startingBid && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiMoneyDollarCircleLine className="text-success" size={16} />
                <span className="text-sm text-muted-foreground">Current Bid</span>
              </div>
              <span className="font-semibold text-success">${currentBid?.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RiTimeLine className="text-muted-foreground" size={16} />
              <span className="text-sm text-muted-foreground">{timeLeft.type}</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {Object.keys(timeLeft).length > 1 ? formatTimeLeft(timeLeft) : "Time's up!"}
            </span>
          </div>
        </div>

        {/* Time remaining bar */}
        {Object.keys(timeLeft).length > 1 && (
          <div className="pt-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  auctionStatus.status === "active" ? "bg-success" : "bg-warning"
                }`}
                style={{
                  width: auctionStatus.status === "active" 
                    ? `${Math.max(0, Math.min(100, ((new Date(endTime) - new Date()) / (new Date(endTime) - new Date(startTime))) * 100))}%`
                    : auctionStatus.status === "upcoming" ? "0%" : "100%"
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default Card;
