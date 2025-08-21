import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  RiFileTextLine, 
  RiSettingsLine, 
  RiBarChartLine, 
  RiShieldCheckLine,
  RiDownloadLine,
  RiUserLine
} from "react-icons/ri";
import { 
  getAllUsers, 
  getAllPaymentProofs, 
  getMonthlyRevenue 
} from "@/store/slices/superAdminSlice";

const QuickActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentProofs, userCounts } = useSelector((state) => state.superAdmin);

  // Debug icon imports
  console.log("🔍 QuickActions - Available icons:", {
    RiFileTextLine,
    RiSettingsLine,
    RiBarChartLine,
    RiShieldCheckLine,
    RiDownloadLine,
    RiUserLine
  });

  // Create a safe icon component with fallback
  const SafeIcon = ({ icon: Icon, className, size = 16, fallback = "⚡" }) => {
    if (Icon && typeof Icon === 'function') {
      return <Icon className={className} size={size} />;
    }
    return <span className={className}>{fallback}</span>;
  };

  const handleNavigateToTab = (tabName) => {
    try {
      // This will be handled by the parent Dashboard component
      // We'll emit a custom event to communicate with the parent
      const event = new CustomEvent('dashboardTabChange', { detail: { tab: tabName } });
      window.dispatchEvent(event);
      toast.info(`Navigating to ${tabName}...`);
    } catch (error) {
      console.error("Error navigating to tab:", error);
    }
  };

  const handleExportData = () => {
    try {
      // Create and download CSV data
      const csvData = createCSVData();
      downloadCSV(csvData, "auction_platform_data.csv");
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const createCSVData = () => {
    const headers = ["User Type", "Count"];
    const rows = [
      ["Super Admins", userCounts?.superAdmin || 0],
      ["Auctioneers", userCounts?.auctioneers || 0],
      ["Bidders", userCounts?.bidders || 0],
      ["Total Users (Auctioneers + Bidders)", (userCounts?.auctioneers || 0) + (userCounts?.bidders || 0)]
    ];
    
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const actions = [
    {
      title: "Review Payments",
      description: "Check pending payment proofs",
      icon: RiFileTextLine,
      color: "warning",
      action: () => handleNavigateToTab("payments"),
      badge: "Urgent"
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: RiSettingsLine,
      color: "accent",
      action: () => handleNavigateToTab("settings"),
      badge: "Config"
    },
    {
      title: "View Analytics",
      description: "Check platform performance",
      icon: RiBarChartLine,
      color: "info",
      action: () => handleNavigateToTab("analytics"),
      badge: "Insights"
    },
    {
      title: "Export Data",
      description: "Download user data",
      icon: RiDownloadLine,
      color: "accent",
      action: handleExportData,
      badge: "Data"
    }
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Urgent": return "bg-warning text-warning-foreground";
      case "Config": return "bg-accent text-accent-foreground";
      case "Insights": return "bg-info text-info-foreground";
      case "Data": return "bg-accent text-accent-foreground";
      case "System": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case "primary": return "text-primary";
      case "success": return "text-success";
      case "warning": return "text-warning";
      case "accent": return "text-accent";
      case "info": return "text-info";
      case "destructive": return "text-destructive";
      default: return "text-primary";
    }
  };

  const getBgColor = (color) => {
    switch (color) {
      case "primary": return "bg-primary/10 border-primary/20";
      case "success": return "bg-success/10 border-success/20";
      case "warning": return "bg-warning/10 border-warning/20";
      case "accent": return "bg-accent/10 border-accent/20";
      case "info": return "bg-info/10 border-info/20";
      case "destructive": return "bg-destructive/10 border-destructive/20";
      default: return "bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common admin tasks</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-full">
        {actions.map((action, index) => {
          return (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg group ${getBgColor(action.color)} min-w-0`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBgColor(action.color)} flex-shrink-0`}>
                  <SafeIcon 
                    icon={action.icon} 
                    className={`${getIconColor(action.color)} text-xl group-hover:scale-110 transition-transform duration-300`}
                    size={20}
                  />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(action.badge)} flex-shrink-0`}>
                  {action.badge}
                </span>
              </div>
              
              <h4 className="font-semibold text-foreground mb-2 text-left truncate">
                {action.title}
              </h4>
              
              <p className="text-xs text-muted-foreground text-left leading-relaxed line-clamp-2">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <SafeIcon icon={RiBarChartLine} className="text-primary text-xl" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Actions</p>
              <p className="text-2xl font-bold text-foreground">
                {paymentProofs?.filter(proof => proof.status?.toLowerCase() === "pending")?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent/10 to-accent/20 border border-accent/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <SafeIcon icon={RiUserLine} className="text-accent text-xl" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users </p>
              <p className="text-2xl font-bold text-foreground">{(userCounts?.auctioneers || 0) + (userCounts?.bidders || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions; 