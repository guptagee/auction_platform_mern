import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  RiArrowRightLine, 
  RiTimeLine, 
  RiMoneyRupeeCircleLine, 
  RiUserLine, 
  RiTrophyLine,
  RiCalendarLine,
  RiStarLine,
  RiImageLine,
  RiFileTextLine,
  RiHomeLine,
  RiAuctionLine,
  RiAuctionFill,
  RiFireLine,
  RiCheckLine,
  RiAlertLine
} from "react-icons/ri";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBid = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setBidError("Please enter a valid bid amount");
      return;
    }
    
    if (parseFloat(amount) <= parseFloat(auctionDetail?.startingBid)) {
      setBidError(`Bid must be higher than starting bid (Rs. ${auctionDetail?.startingBid})`);
      return;
    }

    setBidError("");
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
    setAmount("");
  };

  // Calculate auction status and time remaining
  const getAuctionStatus = () => {
    if (!auctionDetail?.startTime || !auctionDetail?.endTime) return null;
    
    try {
      const startTime = new Date(auctionDetail.startTime);
      const endTime = new Date(auctionDetail.endTime);
      
      // Validate dates
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error('Invalid auction dates:', { startTime: auctionDetail.startTime, endTime: auctionDetail.endTime });
        return {
          status: "error",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: RiAlertLine,
          text: "Invalid auction dates"
        };
      }
      
      if (currentTime < startTime) {
        return { 
          status: "upcoming", 
          color: "text-blue-600", 
          bgColor: "bg-blue-50", 
          borderColor: "border-blue-200",
          icon: RiTimeLine,
          text: "Auction hasn't started yet"
        };
      } else if (currentTime > endTime) {
        return { 
          status: "ended", 
          color: "text-red-600", 
          bgColor: "bg-red-50", 
          borderColor: "border-red-200",
          icon: RiTrophyLine,
          text: "Auction has ended"
        };
      } else {
        return { 
          status: "active", 
          color: "text-green-600", 
          bgColor: "bg-green-50", 
          borderColor: "border-green-200",
          icon: RiFireLine,
          text: "Auction is live and accepting bids"
        };
      }
    } catch (error) {
      console.error('Error calculating auction status:', error);
      return {
        status: "error",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: RiAlertLine,
        text: "Error calculating auction status"
      };
    }
  };

  const getTimeRemaining = () => {
    if (!auctionDetail?.startTime || !auctionDetail?.endTime) return null;
    
    try {
      const startTime = new Date(auctionDetail.startTime);
      const endTime = new Date(auctionDetail.endTime);
      
      // Validate dates
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error('Invalid auction dates for time calculation:', { startTime: auctionDetail.startTime, endTime: auctionDetail.endTime });
        return "Invalid dates";
      }
      
      // If auction hasn't started, show time until start
      if (currentTime < startTime) {
        const timeUntilStart = startTime - currentTime;
        const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
      }
      
      // If auction is active, show time remaining
      if (currentTime >= startTime && currentTime <= endTime) {
        const timeLeft = endTime - currentTime;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
      }
      
      // If auction has ended
      return "Auction ended";
    } catch (error) {
      console.error('Error calculating time remaining:', error);
      return "Error calculating time";
    }
  };

  const getProgressPercentage = () => {
    if (!auctionDetail?.startTime || !auctionDetail?.endTime) return 0;
    
    try {
      const startTime = new Date(auctionDetail.startTime);
      const endTime = new Date(auctionDetail.endTime);
      
      // Validate dates
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error('Invalid auction dates for progress calculation:', { startTime: auctionDetail.startTime, endTime: auctionDetail.endTime });
        return 0;
      }
      
      const totalDuration = endTime - startTime;
      const elapsed = currentTime - startTime;
      
      if (elapsed <= 0) return 0;
      if (elapsed >= totalDuration) return 100;
      
      return Math.min((elapsed / totalDuration) * 100, 100);
    } catch (error) {
      console.error('Error calculating progress percentage:', error);
      return 0;
    }
  };

  // Helper function to check auction timing consistently
  const isAuctionActive = () => {
    if (!auctionDetail?.startTime || !auctionDetail?.endTime) return false;
    
    try {
      const startTime = new Date(auctionDetail.startTime);
      const endTime = new Date(auctionDetail.endTime);
      
      // Validate dates
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return false;
      }
      
      return currentTime >= startTime && currentTime <= endTime;
    } catch (error) {
      console.error('Error checking if auction is active:', error);
      return false;
    }
  };

  const isAuctionUpcoming = () => {
    if (!auctionDetail?.startTime) return false;
    
    try {
      const startTime = new Date(auctionDetail.startTime);
      
      // Validate date
      if (isNaN(startTime.getTime())) {
        return false;
      }
      
      return currentTime < startTime;
    } catch (error) {
      console.error('Error checking if auction is upcoming:', error);
      return false;
    }
  };

  const isAuctionEnded = () => {
    if (!auctionDetail?.endTime) return false;
    
    try {
      const endTime = new Date(auctionDetail.endTime);
      
      // Validate date
      if (isNaN(endTime.getTime())) {
        return false;
      }
      
      return currentTime > endTime;
    } catch (error) {
      console.error('Error checking if auction is ended:', error);
      return false;
    }
  };

  // Helper function to format dates consistently
  const formatAuctionTime = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";
      
      // Format with timezone info
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Invalid date";
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="w-full ml-0 m-0 h-screen px-5 pt-20 lg:pl-[320px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const auctionStatus = getAuctionStatus();
  const timeRemaining = getTimeRemaining();
  const progressPercentage = getProgressPercentage();
  const StatusIcon = auctionStatus?.icon || RiTimeLine;

  return (
    <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg">
      {/* Beautiful Header Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Breadcrumb Navigation */}
          <nav className="mb-8">
            <div className="flex items-center gap-3 text-sm">
              <Link
                to="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                <RiHomeLine className="group-hover:scale-110 transition-transform duration-300" size={16} />
                Home
              </Link>
              <RiArrowRightLine className="text-muted-foreground" size={16} />
              <Link
                to="/auctions"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                <RiAuctionLine className="group-hover:scale-110 transition-transform duration-300" size={16} />
                Auctions
              </Link>
              <RiArrowRightLine className="text-muted-foreground" size={16} />
              <span className="text-foreground font-medium truncate max-w-xs">
                {auctionDetail?.title}
              </span>
            </div>
          </nav>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Item Details */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Item Image and Basic Info Card */}
              <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row gap-8">
                  
                  {/* Enhanced Image Section */}
                  <div className="lg:w-80 lg:h-80 w-full aspect-square">
                    <div className="relative w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl overflow-hidden border-2 border-border hover:border-primary/30 transition-all duration-300 group">
                      <img
                        src={auctionDetail?.image?.url}
                        alt={auctionDetail?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Status Badge */}
                      {auctionStatus && (
                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold ${auctionStatus.bgColor} ${auctionStatus.borderColor} border ${auctionStatus.color} backdrop-blur-sm flex items-center gap-2`}>
                          <StatusIcon size={14} />
                          {auctionStatus.status === "upcoming" && "⏰ Upcoming"}
                          {auctionStatus.status === "active" && "🔥 Live"}
                          {auctionStatus.status === "ended" && "🏁 Ended"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Item Info */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                        {auctionDetail?.title}
                      </h1>
                      
                      {/* Status and Time Info */}
                      <div className="space-y-4">
                        {/* Auction Status Card */}
                        {auctionStatus && (
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${auctionStatus.bgColor} ${auctionStatus.borderColor} border`}>
                            <div className={`w-3 h-3 rounded-full ${auctionStatus.status === "upcoming" ? "bg-blue-500" : auctionStatus.status === "active" ? "bg-green-500" : "bg-red-500"}`}></div>
                            <span className={`font-semibold ${auctionStatus.color}`}>
                              {auctionStatus.text}
                            </span>
                          </div>
                        )}

                        {/* Time Remaining */}
                        {timeRemaining && (
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <RiTimeLine className="text-primary text-xl" />
                              <span className="font-semibold text-foreground">
                                {auctionStatus?.status === "upcoming" ? "Starts in:" : auctionStatus?.status === "active" ? "Time remaining:" : "Ended:"}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {timeRemaining}
                            </div>
                            
                            {/* Show appropriate message based on status */}
                            {auctionStatus?.status === "upcoming" && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Auction will begin automatically at the scheduled start time
                              </p>
                            )}
                            {auctionStatus?.status === "active" && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Place your bids before time runs out!
                              </p>
                            )}
                            {auctionStatus?.status === "ended" && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Final results are being calculated
                              </p>
                            )}
                            
                            {/* Progress Bar */}
                            {auctionStatus?.status === "active" && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                  <span>Progress</span>
                                  <span>{Math.round(progressPercentage)}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Item Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <RiStarLine className="text-warning text-lg" />
                          <span className="text-sm font-medium text-muted-foreground">Condition</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">
                          {auctionDetail?.condition}
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <RiMoneyRupeeCircleLine className="text-success text-lg" />
                          <span className="text-sm font-medium text-muted-foreground">Starting Bid</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">
                          Rs. {auctionDetail?.startingBid}
                        </p>
                      </div>
                    </div>

                    {/* Auction Timing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <RiCalendarLine className="text-primary text-lg" />
                          <span className="text-sm font-medium text-muted-foreground">Start Time</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatAuctionTime(auctionDetail?.startTime)}
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <RiCalendarLine className="text-accent text-lg" />
                          <span className="text-sm font-medium text-muted-foreground">End Time</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatAuctionTime(auctionDetail?.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Debug Timing Info - Remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <RiTimeLine className="text-yellow-600 text-lg" />
                          <span className="text-sm font-medium text-yellow-700">Debug Info</span>
                        </div>
                        <div className="text-xs text-yellow-700 space-y-1">
                          <p>Current Time: {currentTime.toLocaleString()}</p>
                          <p>Start Time: {formatAuctionTime(auctionDetail?.startTime)}</p>
                          <p>End Time: {formatAuctionTime(auctionDetail?.endTime)}</p>
                          <p>Status: {auctionStatus?.status || 'Unknown'}</p>
                          <p>Time Remaining: {timeRemaining || 'N/A'}</p>
                          <p>Progress: {Math.round(progressPercentage)}%</p>
                          <p>Raw Start: {auctionDetail?.startTime || 'N/A'}</p>
                          <p>Raw End: {auctionDetail?.endTime || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Description Section */}
              <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center">
                    <RiFileTextLine className="text-accent text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Item Description</h2>
                    <p className="text-muted-foreground">Detailed information about the auction item</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {auctionDetail?.description ? (
                    auctionDetail.description.split(". ").map((element, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl border border-border hover:border-accent/30 transition-all duration-300">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-foreground leading-relaxed">{element}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <RiFileTextLine className="text-4xl mx-auto mb-4 opacity-50" />
                      <p>No description available for this item</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Bids Section & Bidding Interface */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Enhanced Bids Section */}
              <div className="bg-card border border-border rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 sticky top-24">
                
                {/* Enhanced Bids Header */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border rounded-t-3xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center">
                      <RiTrophyLine className="text-primary text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Live Bids</h3>
                      <p className="text-muted-foreground">
                        {auctionBidders?.length || 0} bid{auctionBidders?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Bids Content */}
                <div className="p-6">
                  {auctionBidders && auctionBidders.length > 0 && isAuctionActive() ? (
                    <div className="space-y-4">
                      {auctionBidders.map((bidder, index) => (
                        <div
                          key={index}
                          className={`group p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                            index === 0 
                              ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg" 
                              : index === 1 
                              ? "bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200" 
                              : index === 2 
                              ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200"
                              : "bg-muted/30 border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Position Badge */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                index === 0 ? "bg-gradient-to-r from-yellow-500 to-orange-500" 
                                : index === 1 ? "bg-gradient-to-r from-gray-500 to-blue-500" 
                                : index === 2 ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                                : "bg-muted"
                              }`}>
                                {index === 0 ? "1st" : index === 1 ? "2nd" : index === 2 ? "3rd" : `${index + 1}th`}
                              </div>
                              
                              {/* Bidder Info */}
                              <div className="flex items-center gap-3">
                                <img
                                  src={bidder.profileImage}
                                  alt={bidder.userName}
                                  className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                />
                                <div>
                                  <p className="font-semibold text-foreground">{bidder.userName}</p>
                                  <p className="text-sm text-muted-foreground">Bidder</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Bid Amount */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">Rs. {bidder.amount}</p>
                              <p className="text-xs text-muted-foreground">Bid placed</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isAuctionUpcoming() ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RiTimeLine className="text-blue-600 text-3xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Auction Not Started</h4>
                      <p className="text-muted-foreground">Bids will appear here once the auction begins</p>
                    </div>
                  ) : isAuctionEnded() ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RiTrophyLine className="text-red-600 text-3xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Auction Ended</h4>
                      <p className="text-muted-foreground">Final results are displayed above</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RiTimeLine className="text-gray-600 text-3xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Loading Auction</h4>
                      <p className="text-muted-foreground">Please wait while we load the auction details</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Bidding Interface */}
              {isAuctionActive() && (
                <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-6 shadow-xl border border-primary/20">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <RiAuctionFill className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Place Your Bid</h3>
                    <p className="text-white/80">Enter an amount higher than the current highest bid</p>
                  </div>

                  <div className="space-y-4">
                    {/* Bid Input */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <RiMoneyRupeeCircleLine className="text-white/80 text-xl" />
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setBidError("");
                        }}
                        placeholder="Enter bid amount"
                        className="w-full pl-12 pr-4 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white transition-all duration-300"
                        min={auctionDetail?.startingBid}
                        step="0.01"
                      />
                    </div>

                    {/* Error Message */}
                    {bidError && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <RiAlertLine className="text-red-400 text-lg" />
                        <span className="text-red-200 text-sm">{bidError}</span>
                      </div>
                    )}

                    {/* Current Highest Bid Info */}
                    {auctionBidders && auctionBidders.length > 0 && (
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <p className="text-white/80 text-sm">Current Highest Bid</p>
                        <p className="text-white text-xl font-bold">Rs. {auctionBidders[0]?.amount}</p>
                      </div>
                    )}

                    {/* Bid Button */}
                    <button
                      onClick={handleBid}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="w-full py-4 bg-white text-primary font-bold text-lg rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      <RiAuctionFill className="group-hover:scale-110 transition-transform duration-300" />
                      Place Bid
                    </button>
                  </div>
                </div>
              )}

              {/* Auction Status Messages */}
              {isAuctionUpcoming() && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <RiTimeLine className="text-white text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Auction Not Started</h3>
                  <p className="text-white/80">Bidding will begin when the auction starts</p>
                </div>
              )}

              {isAuctionEnded() && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <RiTrophyLine className="text-white text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Auction Ended</h3>
                  <p className="text-white/80">This auction is no longer accepting bids</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuctionItem;
