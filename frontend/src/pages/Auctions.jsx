import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  RiAuctionFill, 
  RiSearchLine, 
  RiFilter3Line, 
  RiGridLine, 
  RiListUnordered,
  RiTimeLine,
  RiMoneyRupeeCircleLine,
  RiFireLine
} from "react-icons/ri";

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Filter and search auctions
  const filteredAuctions = useMemo(() => {
    let filtered = allAuctions.filter(auction => {
      const matchesSearch = auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auction.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || auction.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort auctions
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-low":
        filtered.sort((a, b) => a.startingBid - b.startingBid);
        break;
      case "price-high":
        filtered.sort((a, b) => b.startingBid - a.startingBid);
        break;
      case "ending-soon":
        filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        break;
      default:
        break;
    }

    return filtered;
  }, [allAuctions, searchTerm, selectedCategory, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allAuctions.map(auction => auction.category))];
    return uniqueCategories.filter(Boolean);
  }, [allAuctions]);

  // Get auction statistics
  const stats = useMemo(() => {
    const now = new Date();
    const activeAuctions = allAuctions.filter(auction => 
      new Date(auction.startTime) <= now && new Date(auction.endTime) > now
    );
    const upcomingAuctions = allAuctions.filter(auction => 
      new Date(auction.startTime) > now
    );
    const totalValue = allAuctions.reduce((sum, auction) => sum + (auction.startingBid || 0), 0);

    return {
      total: allAuctions.length,
      active: activeAuctions.length,
      upcoming: upcomingAuctions.length,
      totalValue: totalValue.toLocaleString()
    };
  }, [allAuctions]);

  if (loading) {
    return (
      <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg to-background">
        {/* Header Section */}
        <section className="py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <RiAuctionFill className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    Live Auctions
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Discover unique items and place your bids
                  </p>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-primary text-white shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <RiGridLine size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-primary text-white shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <RiListUnordered size={20} />
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <RiAuctionFill className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Auctions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <RiFireLine className="text-success text-xl" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <RiTimeLine className="text-warning text-xl" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <RiMoneyRupeeCircleLine className="text-accent text-xl" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">₹{stats.totalValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="ending-soon">Ending Soon</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-center lg:justify-end">
                <span className="text-muted-foreground">
                  {filteredAuctions.length} of {allAuctions.length} auctions
                </span>
              </div>
            </div>
          </div>

          {/* Auctions Grid/List */}
          <section className="mb-8">
            {filteredAuctions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiAuctionFill className="text-muted-foreground text-4xl" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No auctions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredAuctions.map((element) => (
                  <Card
                    key={element._id}
                    title={element.title}
                    startTime={element.startTime}
                    endTime={element.endTime}
                    imgSrc={element.image?.url}
                    startingBid={element.startingBid}
                    id={element._id}
                    viewMode={viewMode}
                    category={element.category}
                    currentBid={element.currentBid}
                    description={element.description}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </article>
    </>
  );
};

export default Auctions;
