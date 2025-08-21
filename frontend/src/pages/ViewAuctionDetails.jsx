import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
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
  RiAuctionLine
} from "react-icons/ri";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  // Calculate auction status and time remaining
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getAuctionStatus = () => {
    const startTime = new Date(auctionDetail?.startTime);
    const endTime = new Date(auctionDetail?.endTime);
    
    if (currentTime < startTime) {
      return { status: "upcoming", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
    } else if (currentTime > endTime) {
      return { status: "ended", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
    } else {
      return { status: "active", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
    }
  };

  const getTimeRemaining = () => {
    if (!auctionDetail?.endTime) return null;
    
    const endTime = new Date(auctionDetail.endTime);
    const timeLeft = endTime - currentTime;
    
    if (timeLeft <= 0) return "Auction ended";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getProgressPercentage = () => {
    if (!auctionDetail?.startTime || !auctionDetail?.endTime) return 0;
    
    const startTime = new Date(auctionDetail.startTime);
    const endTime = new Date(auctionDetail.endTime);
    const totalDuration = endTime - startTime;
    const elapsed = currentTime - startTime;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.min((elapsed / totalDuration) * 100, 100);
  };

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
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
                to="/view-my-auctions"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                <RiAuctionLine className="group-hover:scale-110 transition-transform duration-300" size={16} />
                My Auctions
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
                      <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold ${auctionStatus.bgColor} ${auctionStatus.borderColor} border ${auctionStatus.color} backdrop-blur-sm`}>
                        {auctionStatus.status === "upcoming" && "⏰ Upcoming"}
                        {auctionStatus.status === "active" && "🔥 Live"}
                        {auctionStatus.status === "ended" && "🏁 Ended"}
                      </div>
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
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${auctionStatus.bgColor} ${auctionStatus.borderColor} border`}>
                          <div className={`w-3 h-3 rounded-full ${auctionStatus.status === "upcoming" ? "bg-blue-500" : auctionStatus.status === "active" ? "bg-green-500" : "bg-red-500"}`}></div>
                          <span className={`font-semibold ${auctionStatus.color}`}>
                            {auctionStatus.status === "upcoming" && "Auction hasn't started yet"}
                            {auctionStatus.status === "active" && "Auction is live and accepting bids"}
                            {auctionStatus.status === "ended" && "Auction has ended"}
                          </span>
                        </div>

                        {/* Time Remaining */}
                        {timeRemaining && (
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <RiTimeLine className="text-primary text-xl" />
                              <span className="font-semibold text-foreground">
                                {auctionStatus.status === "upcoming" ? "Starts in:" : auctionStatus.status === "active" ? "Time remaining:" : "Ended:"}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {timeRemaining}
                            </div>
                            
                            {/* Progress Bar */}
                            {auctionStatus.status === "active" && (
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
                          {auctionDetail?.startTime ? new Date(auctionDetail.startTime).toLocaleString() : "Not set"}
                        </p>
                      </div>
                      
                      <div className="bg-muted/30 rounded-xl p-4 border border-border">
                        <div className="flex items-center gap-3 mb-2">
                          <RiCalendarLine className="text-accent text-lg" />
                          <span className="text-sm font-medium text-muted-foreground">End Time</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {auctionDetail?.endTime ? new Date(auctionDetail.endTime).toLocaleString() : "Not set"}
                        </p>
                      </div>
                    </div>
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

            {/* Right Column - Bids Section */}
            <div className="xl:col-span-1">
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
                  {auctionBidders && auctionBidders.length > 0 && 
                   new Date(auctionDetail?.startTime) < currentTime && 
                   new Date(auctionDetail?.endTime) > currentTime ? (
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
                  ) : new Date(auctionDetail?.startTime) > currentTime ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RiTimeLine className="text-blue-600 text-3xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Auction Not Started</h4>
                      <p className="text-muted-foreground">Bids will appear here once the auction begins</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RiTrophyLine className="text-red-600 text-3xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">Auction Ended</h4>
                      <p className="text-muted-foreground">Final results are displayed above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewAuctionDetails;
