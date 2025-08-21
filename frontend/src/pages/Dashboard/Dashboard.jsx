import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
  clearAllSuperAdminSliceErrors
} from "@/store/slices/superAdminSlice";
import { fetchUser } from "@/store/slices/userSlice";
import { 
  RiUserLine, 
  RiMoneyDollarCircleLine, 
  RiFileTextLine, 
  RiArrowUpLine,
  RiRefreshLine,
  RiDashboardLine,
  RiBarChartLine,
  RiSettingsLine,
  RiTimeLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiMoneyRupeeCircleLine
} from "react-icons/ri";
import { toast } from "react-toastify";
import "@/dashboard.css";

import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentGraph from "./sub-components/PaymentGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import UserManagement from "./sub-components/UserManagement";
import AdminSettings from "./sub-components/AdminSettings";
import AnalyticsDashboard from "./sub-components/AnalyticsDashboard";
import QuickActions from "./sub-components/QuickActions";
import Spinner from "@/custom-components/Spinner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    loading, 
    monthlyRevenue, 
    totalAuctioneers, 
    totalBidders, 
    paymentProofs, 
    userCounts,
  } = useSelector((state) => state.superAdmin);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    pendingProofs: 0,
  });

  // Add debugging
  console.log("🔍 Dashboard Debug:");
  console.log("Loading:", loading);
  console.log("Monthly Revenue:", monthlyRevenue);
  console.log("Total Auctioneers:", totalAuctioneers);
  console.log("Total Bidders:", totalBidders);
  console.log("Payment Proofs:", paymentProofs);
  console.log("User Counts:", userCounts);

  // Check for data loading errors
  const hasDataErrors = !userCounts && !paymentProofs && !monthlyRevenue;
  const isDataLoading = loading || hasDataErrors;

  // Add event listener for Quick Actions tab navigation
  useEffect(() => {
    const handleTabChange = (event) => {
      const { tab } = event.detail;
      setActiveTab(tab);
    };

    window.addEventListener('dashboardTabChange', handleTabChange);
    
    return () => {
      window.removeEventListener('dashboardTabChange', handleTabChange);
    };
  }, []);

  // Listen for payment proof updates and refresh revenue data
  useEffect(() => {
    if (paymentProofs && paymentProofs.length > 0) {
      // Check if any payment proofs were recently updated
      const hasRecentUpdates = paymentProofs.some(proof => {
        const updatedAt = new Date(proof.uploadedAt);
        const now = new Date();
        const diffInMinutes = (now - updatedAt) / (1000 * 60);
        return diffInMinutes < 5; // Consider updates from last 5 minutes as recent
      });
      
      if (hasRecentUpdates) {
        console.log("🔄 Payment proofs updated, refreshing revenue data...");
        dispatch(getMonthlyRevenue());
      }
    }
  }, [paymentProofs, dispatch]);

  useEffect(() => {
    // Calculate stats when data changes
    console.log("📊 Calculating stats...");
    console.log("📊 Available data:", { userCounts, monthlyRevenue, paymentProofs });
    
    // Always calculate stats, even with partial data
    const newStats = {
      totalUsers: (userCounts?.auctioneers || 0) + (userCounts?.bidders || 0), // Only Auctioneers + Bidders
      totalRevenue: Array.isArray(monthlyRevenue) && monthlyRevenue.length > 0 
        ? monthlyRevenue.reduce((sum, item) => sum + (Number(item) || 0), 0) 
        : 0,
      pendingProofs: Array.isArray(paymentProofs) && paymentProofs.length > 0
        ? paymentProofs.filter(proof => proof.status?.toLowerCase() === "pending")?.length || 0 
        : 0,
    };
    
    console.log("📈 Calculated stats:", newStats);
    setStats(newStats);
  }, [userCounts, paymentProofs, monthlyRevenue]);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  
  // Add debugging for user state
  console.log("🔍 User State Debug:");
  console.log("User:", user);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Role:", user?.role);
  
  useEffect(() => {
    console.log("🔐 Auth Check:", { isAuthenticated, userRole: user?.role });
    
    // Add a delay to allow user data to load
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        console.log("❌ Not authenticated, redirecting...");
        navigateTo("/");
      } else if (user?.role !== "Super Admin") {
        console.log("❌ Not Super Admin, redirecting...");
        console.log("User role:", user?.role);
        navigateTo("/");
      } else {
        console.log("✅ User authorized as Super Admin");
        // Only dispatch API actions after user is authenticated
        console.log("🚀 Dispatching authenticated actions...");
        
        // Dispatch all API calls with error handling
        Promise.allSettled([
          dispatch(fetchUser()),
          dispatch(getAllUsers()),
          dispatch(getAllPaymentProofs()),
          dispatch(getMonthlyRevenue()),
        ]).then((results) => {
          console.log("📊 API call results:", results);
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.error(`❌ API call ${index} failed:`, result.reason);
            }
          });
        });
        
        dispatch(clearAllSuperAdminSliceErrors());
      }
    }, 1000); // Wait 1 second for user data to load

    return () => clearTimeout(timer);
  }, [isAuthenticated, user?.role, navigateTo, dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'approved': return 'text-success bg-success/10 border-success/20';
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      case 'rejected': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'settled': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'approved': return <RiCheckLine className="text-success" />;
      case 'pending': return <RiTimeLine className="text-warning" />;
      case 'rejected': return <RiCloseLine className="text-destructive" />;
      case 'settled': return <RiCheckLine className="text-primary" />;
      default: return <RiAlertLine className="text-muted-foreground" />;
    }
  };

  const handleRefreshDashboard = () => {
    try {
      console.log("🔄 Refreshing dashboard data...");
      
      // Show loading state
      toast.info("Refreshing dashboard data...");
      
      // Refresh all data
      Promise.allSettled([
        dispatch(fetchUser()),
        dispatch(getAllUsers()),
        dispatch(getAllPaymentProofs()),
        dispatch(getMonthlyRevenue()),
      ]).then((results) => {
        console.log("📊 Refresh results:", results);
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;
        
        if (failureCount === 0) {
          toast.success("Dashboard refreshed successfully!");
        } else if (successCount > 0) {
          toast.warning(`Dashboard partially refreshed (${successCount}/${results.length} successful)`);
        } else {
          toast.error("Failed to refresh dashboard data");
        }
      });
    } catch (error) {
      console.error("❌ Error refreshing dashboard:", error);
      toast.error("Failed to refresh dashboard");
    }
  };

  if (isDataLoading) {
    return (
      <div className="w-full ml-0 m-0 h-screen px-5 pt-20 lg:pl-[320px] flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-muted-foreground mt-4">Loading dashboard data...</p>
          {hasDataErrors && (
            <p className="text-sm text-warning mt-2">Some data may be unavailable</p>
          )}
        </div>
      </div>
    );
  }

  // Add loading state while waiting for user data
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg">
        <section className="py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">Loading User Data...</h1>
                <p className="text-muted-foreground mb-6">Please wait while we verify your authentication...</p>
                <div className="flex justify-center">
                  <Spinner />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  If this takes too long, please try logging in again.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Add fallback for when data is not available
  if (!userCounts && !paymentProofs && !monthlyRevenue) {
    return (
      <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg">
        <section className="py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard Loading...</h1>
                <p className="text-muted-foreground mb-6">Fetching your platform data...</p>
                <div className="flex justify-center">
                  <Spinner />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  If this takes too long, please refresh the page or check your connection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg dashboard-container">
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-dashboard-bg">
        <div className="py-2 flex flex-col justify-start">
          {/* Container for better responsive behavior */}
          <div className="max-w-7xl mx-auto content-container px-6 lg:px-8">
            {/* Welcome Header */}
            <div className="mb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2">
                    Welcome back, {user?.userName || 'admin'}!
                  </h1>
                </div>
                
                {/* Refresh Button */}
                <button
                  onClick={handleRefreshDashboard}
                  className="lg:self-start p-3 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-all duration-300 flex items-center gap-2"
                  title="Refresh Dashboard"
                >
                  <RiRefreshLine className="text-primary text-xl" />
                  <span className="text-primary font-medium lg:hidden">Refresh</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Users Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center">
                    <RiUserLine className="text-primary text-2xl" />
                  </div>
                  <RiArrowUpLine className="text-accent text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{stats.totalUsers}</h3>
                <p className="text-muted-foreground">Total Users</p>
                <div className="mt-3 text-sm text-accent">
                  {userCounts?.auctioneers || 0} Auctioneers•{userCounts?.bidders || 0} Bidders
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/30 rounded-xl flex items-center justify-center">
                    <RiMoneyRupeeCircleLine className="text-success text-2xl" />
                  </div>
                  <RiArrowUpLine className="text-accent text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">₹{stats.totalRevenue}</h3>
                <p className="text-muted-foreground">Total Revenue</p>
                <div className="mt-3 text-sm text-success">
                  Monthly tracking enabled
                </div>
              </div>

              {/* Pending Proofs Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-warning/30 rounded-xl flex items-center justify-center">
                    <RiFileTextLine className="text-warning text-2xl" />
                  </div>
                  <RiArrowUpLine className="text-accent text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{stats.pendingProofs}</h3>
                <p className="text-muted-foreground">Pending Proofs</p>
                <div className="mt-3 text-sm text-warning">
                  {stats.pendingProofs > 0 ? 'Require attention' : 'All clear'}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-card border border-border rounded-2xl p-2 shadow-lg mb-6 overflow-x-auto nav-tabs">
              <div className="flex flex-wrap gap-2 min-w-max">
                {[
                  { id: "overview", label: "Overview", icon: RiDashboardLine },
                  { id: "analytics", label: "Analytics", icon: RiBarChartLine },
                  { id: "users", label: "User Management", icon: RiUserLine },
                  { id: "payments", label: "Payment Proofs", icon: RiFileTextLine },
                  { id: "settings", label: "Settings", icon: RiSettingsLine }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab.id
                          ? "bg-primary text-white shadow-lg"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                    <QuickActions />
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <RiTimeLine className="text-primary" />
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {Array.isArray(paymentProofs) && paymentProofs.length > 0 ? (
                        paymentProofs.slice(0, 5).map((proof, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${proof.status?.toLowerCase() === 'approved' ? 'bg-success' : proof.status?.toLowerCase() === 'pending' ? 'bg-warning' : proof.status?.toLowerCase() === 'rejected' ? 'bg-destructive' : 'bg-primary'}`}></div>
                              <span className="text-sm text-foreground truncate">
                                Payment proof from {proof.userName || 'User'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proof.status)}`}>
                                {proof.status || 'Unknown'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {proof.createdAt ? formatDate(proof.createdAt) : 'Date unknown'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RiFileTextLine className="text-muted-foreground text-2xl" />
                          </div>
                          <p className="text-muted-foreground mb-2">No payment proofs yet</p>
                          <p className="text-sm text-muted-foreground">Payment proofs will appear here when users submit them</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <RiBarChartLine className="text-primary" />
                    Analytics Dashboard
                  </h3>
                  <AnalyticsDashboard />
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <RiUserLine className="text-primary" />
                    User Management
                  </h3>
                  <UserManagement />
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <RiFileTextLine className="text-primary" />
                    Payment Proof Management
                  </h3>
                  <PaymentProofs />
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <RiSettingsLine className="text-primary" />
                    Platform Settings
                  </h3>
                  <AdminSettings />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
