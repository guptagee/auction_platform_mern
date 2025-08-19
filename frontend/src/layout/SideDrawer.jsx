import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  RiHomeLine,
  RiAuctionLine,
  RiUserLine,
  RiSettingsLine,
  RiBarChartLine,
  RiTeamLine,
  RiFileTextLine,
  RiQuestionLine,
  RiInformationLine,
  RiContactsLine,
  RiLogoutBoxRLine,
  RiAddCircleLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { logout } from "@/store/slices/userSlice";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset logout state when user is no longer authenticated
      setIsLoggingOut(false);
      // Close mobile sidebar if open
      setShow(false);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    console.log("Logout button clicked");
    setIsLoggingOut(true);
    
    try {
      await dispatch(logout());
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ to, icon: Icon, children, badge, onClick }) => {
    const isActive = isActiveRoute(to);
    const Component = onClick ? 'button' : Link;
    const props = onClick ? { onClick } : { to };

    return (
      <Component
        {...props}
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group relative ${
          isActive
            ? 'bg-primary text-white shadow-lg'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
      >
        <Icon className={`text-xl ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`} />
        {!collapsed && (
          <>
            <span className="font-medium">{children}</span>
            {badge && (
              <span className="ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </>
        )}
        {isActive && !collapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
        )}
      </Component>
    );
  };

  const NavSection = ({ title, children, className = "" }) => {
    if (collapsed) return <div className={className}>{children}</div>;
    
    return (
      <div className={className}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
          {title}
        </h3>
        {children}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-primary text-white text-2xl p-3 rounded-xl hover:bg-primary/90 shadow-lg transition-all duration-300 lg:hidden z-50"
      >
        {show ? <RiCloseLine /> : <RiMenuLine />}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-sidebar-bg border-r border-border shadow-xl transition-all duration-300 z-40 flex flex-col ${
          show ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-80'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <RiHomeLine className="text-white text-2xl" />
            </div>
            {!collapsed && (
              <h1 className="text-2xl font-bold text-foreground">
                Bid<span className="text-primary">Wise</span>
              </h1>
            )}
          </Link>
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            {collapsed ? <RiArrowRightLine size={20} /> : <RiArrowLeftLine size={20} />}
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation */}
          <NavSection title="Main">
            <div className="space-y-2">
              <NavItem to="/" icon={RiHomeLine}>
                Home
              </NavItem>
              <NavItem to="/auctions" icon={RiAuctionLine}>
                Auctions
              </NavItem>
              <NavItem to="/leaderboard" icon={RiBarChartLine}>
                Leaderboard
              </NavItem>
            </div>
          </NavSection>

          {/* User Actions */}
          {isAuthenticated && user && (
            <NavSection title="My Account">
              <div className="space-y-2">
                {user.role === "Auctioneer" && (
                  <>
                    <NavItem to="/create-auction" icon={RiAddCircleLine}>
                      Create Auction
                    </NavItem>
                    <NavItem to="/view-my-auctions" icon={RiFileTextLine}>
                      My Auctions
                    </NavItem>
                    <NavItem to="/submit-commission" icon={RiTeamLine}>
                      Submit Commission
                    </NavItem>
                  </>
                )}
                
                {user.role === "Super Admin" && (
                  <NavItem to="/dashboard" icon={RiTeamLine}>
                    Admin Dashboard
                  </NavItem>
                )}
                
                <NavItem to="/me" icon={RiUserLine}>
                  Profile
                </NavItem>
              </div>
            </NavSection>
          )}

          {/* Help & Support */}
          <NavSection title="Help & Support">
            <div className="space-y-2">
              <NavItem to="/how-it-works-info" icon={RiQuestionLine}>
                How It Works
              </NavItem>
              <NavItem to="/about" icon={RiInformationLine}>
                About Us
              </NavItem>
              <NavItem to="/contact" icon={RiContactsLine}>
                Contact
              </NavItem>
            </div>
          </NavSection>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 mt-auto">
          {isAuthenticated ? (
            <div className="space-y-3">
              {/* User Profile Summary */}
              {!collapsed && user && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <RiUserLine className="text-white text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user.userName || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium min-h-[48px] ${
                  isLoggingOut 
                    ? 'bg-muted/50 text-muted-foreground cursor-not-allowed' 
                    : 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-white'
                }`}
              >
                <RiLogoutBoxRLine className={`text-xl flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
                {!collapsed && (
                  <span className="flex-shrink-0">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
              >
                <RiUserLine className="text-xl" />
                {!collapsed && "Login"}
              </Link>
              <Link
                to="/sign-up"
                className="w-full flex items-center justify-center gap-2 p-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 font-medium"
              >
                <RiAddCircleLine className="text-xl" />
                {!collapsed && "Sign Up"}
              </Link>
            </div>
          )}
          
          {/* Copyright */}
          {!collapsed && (
            <div className="mt-4 pt-4 border-t border-border/30 text-center">
              <p className="text-xs text-muted-foreground">
                &copy; 2025 BidWise, All rights Reserved.
              </p>
              
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {show && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShow(false)}
        />
      )}
    </>
  );
};

export default SideDrawer;
