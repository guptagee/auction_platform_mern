import Spinner from "@/custom-components/Spinner";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  RiTrophyLine, 
  RiMedalLine, 
  RiStarLine, 
  RiSearchLine,
  RiFilter3Line,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiAuctionLine,
  RiFireLine
} from "react-icons/ri";

const Leaderboard = () => {
  const { loading, leaderboard } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("moneySpent");

  // Filter and sort leaderboard
  const filteredLeaderboard = useMemo(() => {
    let filtered = leaderboard;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Create a copy of the filtered array before sorting
    const sortedArray = [...filtered];
    
    // Sort by selected criteria
    sortedArray.sort((a, b) => {
      if (sortBy === "moneySpent") {
        return b.moneySpent - a.moneySpent;
      } else if (sortBy === "auctionsWon") {
        return b.auctionsWon - a.auctionsWon;
      }
      return 0;
    });

    return sortedArray.slice(0, 100); // Top 100 users
  }, [leaderboard, searchTerm, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (leaderboard.length === 0) return { totalUsers: 0, totalSpent: 0, totalWon: 0, avgSpent: 0 };
    
    const totalUsers = leaderboard.length;
    const totalSpent = leaderboard.reduce((sum, user) => sum + user.moneySpent, 0);
    const totalWon = leaderboard.reduce((sum, user) => sum + user.auctionsWon, 0);
    const avgSpent = totalSpent / totalUsers;

    return { totalUsers, totalSpent, totalWon, avgSpent };
  }, [leaderboard]);

  const getRankIcon = (index) => {
    if (index === 0) return <RiStarLine className="text-yellow-500 text-2xl" />;
    if (index === 1) return <RiMedalLine className="text-gray-400 text-2xl" />;
    if (index === 2) return <RiMedalLine className="text-orange-500 text-2xl" />;
    return <RiStarLine className="text-blue-500 text-lg" />;
  };

  const getRankColor = (index) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (index === 1) return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    if (index === 2) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    if (index < 10) return "bg-gradient-to-r from-blue-500 to-blue-700 text-white";
    if (index < 25) return "bg-gradient-to-r from-green-500 to-green-700 text-white";
    return "bg-gradient-to-r from-purple-500 to-purple-700 text-white";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
                    <RiTrophyLine className="text-white text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <RiStarLine className="text-white text-sm" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
                    Bidders Leaderboard
                  </h1>
                  <p className="text-muted-foreground text-xl">
                    Discover the top bidders and auction champions
                  </p>
                </div>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary/20 to-primary/30 backdrop-blur-sm rounded-2xl p-4 border border-primary/30 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stats.totalUsers}</div>
                  <div className="text-primary/80 text-sm">Total Bidders</div>
                </div>
                <div className="bg-gradient-to-r from-success/20 to-success/30 backdrop-blur-sm rounded-2xl p-4 border border-success/30 text-center">
                  <div className="text-2xl font-bold text-success mb-1">{formatCurrency(stats.totalSpent)}</div>
                  <div className="text-success/80 text-sm">Total Spent</div>
                </div>
                <div className="bg-gradient-to-r from-accent/20 to-accent/30 backdrop-blur-sm rounded-2xl p-4 border border-accent/30 text-center">
                  <div className="text-2xl font-bold text-accent mb-1">{stats.totalWon}</div>
                  <div className="text-accent/80 text-sm">Auctions Won</div>
                </div>
                <div className="bg-gradient-to-r from-warning/20 to-warning/30 backdrop-blur-sm rounded-2xl p-4 border border-warning/30 text-center">
                  <div className="text-2xl font-bold text-warning mb-1">{formatCurrency(stats.avgSpent)}</div>
                  <div className="text-warning/80 text-sm">Average Spent</div>
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
                  placeholder="Search bidders by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3">
                <RiFilter3Line className="text-muted-foreground" size={20} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground appearance-none cursor-pointer"
                >
                  <option value="moneySpent">Sort by Money Spent</option>
                  <option value="auctionsWon">Sort by Auctions Won</option>
                </select>
              </div>

              {/* Results Summary */}
              <div className="text-right">
                <p className="text-muted-foreground text-sm">
                  Showing {filteredLeaderboard.length} of {leaderboard.length} bidders
                </p>
                {searchTerm && (
                  <p className="text-primary text-sm font-medium">
                    Search results for "{searchTerm}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Leaderboard Table */}
          <div className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
                    <th className="py-4 px-6 text-left font-semibold text-foreground">Rank</th>
                    <th className="py-4 px-6 text-left font-semibold text-foreground">Bidder</th>
                    <th className="py-4 px-6 text-left font-semibold text-foreground">Money Spent</th>
                    <th className="py-4 px-6 text-left font-semibold text-foreground">Auctions Won</th>
                    <th className="py-4 px-6 text-left font-semibold text-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-b border-border hover:bg-muted/30 transition-all duration-300 group"
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(index)}`}>
                            {index + 1}
                          </div>
                          <div className="hidden sm:block">
                            {getRankIcon(index)}
                          </div>
                        </div>
                      </td>

                      {/* Bidder Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={user.profileImage?.url || "/imageHolder.jpg"}
                              alt={user.userName}
                              className="h-12 w-12 object-cover rounded-full border-2 border-border group-hover:border-primary/50 transition-all duration-300"
                            />
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <RiStarLine className="text-white text-xs" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                              {user.userName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Rank #{index + 1}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Money Spent Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <RiMoneyDollarCircleLine className="text-success text-lg" />
                          <span className="font-semibold text-foreground">
                            {formatCurrency(user.moneySpent)}
                          </span>
                        </div>
                      </td>

                      {/* Auctions Won Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <RiAuctionLine className="text-accent text-lg" />
                          <span className="font-semibold text-foreground">
                            {user.auctionsWon}
                          </span>
                        </div>
                      </td>

                      {/* Performance Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <RiStarLine className="text-primary text-lg" />
                          <div className="flex items-center gap-1">
                            {index < 10 && <RiFireLine className="text-orange-500 text-sm" />}
                            <span className="text-sm text-muted-foreground">
                              {index < 10 ? "Top Performer" : index < 25 ? "Good" : "Rising"}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-muted/30 to-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiTrophyLine className="text-muted-foreground text-4xl" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {searchTerm ? "No bidders found" : "No leaderboard data"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "The leaderboard will populate as bidders participate in auctions."
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
