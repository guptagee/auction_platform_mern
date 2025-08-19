import CardTwo from "@/custom-components/CardTwo";
import Spinner from "@/custom-components/Spinner";
import { getMyAuctionItems } from "@/store/slices/auctionSlice";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  RiAuctionFill, 
  RiSearchLine, 
  RiFilter3Line, 
  RiAddLine, 
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiTrophyLine,
  RiFireLine,
  RiStarLine,
  RiGridLine,
  RiListUnordered
} from "react-icons/ri";

const ViewMyAuctions = () => {
  const { myAuctions, loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // State for filtering and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
    }
    dispatch(getMyAuctionItems());
  }, [dispatch, isAuthenticated]);

  // Calculate auction statuses and filter auctions
  const filteredAuctions = useMemo(() => {
    let filtered = myAuctions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(auction => {
        const startTime = new Date(auction.startTime);
        const endTime = new Date(auction.endTime);
        
        if (statusFilter === "upcoming") return now < startTime;
        if (statusFilter === "active") return now >= startTime && now <= endTime;
        if (statusFilter === "ended") return now > endTime;
        return true;
      });
    }

    return filtered;
  }, [myAuctions, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const total = myAuctions.length;
    const upcoming = myAuctions.filter(auction => new Date(auction.startTime) > now).length;
    const active = myAuctions.filter(auction => {
      const startTime = new Date(auction.startTime);
      const endTime = new Date(auction.endTime);
      return now >= startTime && now <= endTime;
    }).length;
    const ended = myAuctions.filter(auction => new Date(auction.endTime) < now).length;

    return { total, upcoming, active, ended };
  }, [myAuctions]);

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "text-blue-600 bg-blue-50 border-blue-200";
      case "active": return "text-green-600 bg-green-50 border-green-200";
      case "ended": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "upcoming": return <RiTimeLine className="text-blue-600" />;
      case "active": return <RiFireLine className="text-green-600" />;
      case "ended": return <RiTrophyLine className="text-red-600" />;
      default: return <RiStarLine className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full ml-0 m-0 h-screen px-5 pt-20 lg:pl-[320px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg">
      {/* Beautiful Header Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Header with Gradient Background */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-2xl">
                    <RiAuctionFill className="text-white text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <RiStarLine className="text-white text-sm" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
                    My Auctions
                  </h1>
                  <p className="text-muted-foreground text-xl">
                    Manage and monitor all your auction listings
                  </p>
                </div>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-500/80 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/20 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
                  <div className="text-white/80 text-sm">Total Auctions</div>
                </div>
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-300/30 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stats.upcoming}</div>
                  <div className="text-blue-600/80 text-sm">Upcoming</div>
                </div>
                <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-300/30 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{stats.active}</div>
                  <div className="text-green-600/80 text-sm">Active</div>
                </div>
                <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-300/30 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">{stats.ended}</div>
                  <div className="text-red-600/80 text-sm">Ended</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search your auctions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-3">
                <RiFilter3Line className="text-muted-foreground" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-primary text-white shadow-lg" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <RiGridLine size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list" 
                      ? "bg-primary text-white shadow-lg" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <RiListUnordered size={20} />
                </button>
              </div>

              {/* Create New Auction Button */}
              <button
                onClick={() => navigateTo("/create-auction")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <RiAddLine size={20} />
                Create Auction
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredAuctions.length} of {myAuctions.length} auctions
              </p>
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Search results for:</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    "{searchTerm}"
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Auctions Grid/List */}
          {filteredAuctions.length > 0 ? (
            <div className={`${
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }`}>
              {filteredAuctions.map((auction) => {
                const now = new Date();
                const startTime = new Date(auction.startTime);
                const endTime = new Date(auction.endTime);
                
                let status = "upcoming";
                if (now >= startTime && now <= endTime) status = "active";
                else if (now > endTime) status = "ended";

                return (
                  <div key={auction._id} className="group">
                    <CardTwo
                      title={auction.title}
                      startingBid={auction.startingBid}
                      endTime={auction.endTime}
                      startTime={auction.startTime}
                      imgSrc={auction.image?.url}
                      id={auction._id}
                      viewMode={viewMode}
                    />
                    
                    {/* Status Badge */}
                    <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className="capitalize">{status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-muted/30 to-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiAuctionFill className="text-muted-foreground text-4xl" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {searchTerm || statusFilter !== "all" ? "No auctions found" : "No auctions yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Start your auction journey by creating your first auction item. It's easy and takes just a few minutes!"
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <button
                  onClick={() => navigateTo("/create-auction")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <RiAddLine size={20} />
                  Create Your First Auction
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewMyAuctions;
