import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  RiSettingsLine, 
  RiShieldCheckLine, 
  RiMoneyDollarCircleLine, 
  RiSaveLine,
  RiRefreshLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine
} from "react-icons/ri";
import { toast } from "react-toastify";
import { getPlatformSettings, updatePlatformSettings } from "@/store/slices/superAdminSlice";
import { fetchUser } from "@/store/slices/userSlice";

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { 
    platformSettings, 
    securitySettings, 
    settingsLoading, 
    settingsError 
  } = useSelector((state) => state.superAdmin);
  
  const { user, isAuthenticated, loading: userLoading } = useSelector((state) => state.user);
  
  // Initialize local state with Redux values
  const [localSettings, setLocalSettings] = useState({
    commissionRate: 5.0
  });
  const [localSecuritySettings, setLocalSecuritySettings] = useState({
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    enableAuditLog: true
  });

  const [isEditing, setIsEditing] = useState(false);

  console.log("🔍 Component state:", { 
    platformSettings, 
    securitySettings, 
    localSettings, 
    localSecuritySettings 
  });

  // Debug authentication state
  console.log("🔍 AdminSettings Debug:", {
    isAuthenticated,
    user: user ? { id: user._id, role: user.role } : null,
    platformSettings: platformSettings ? Object.keys(platformSettings) : null,
    settingsLoading,
    settingsError
  });

  // Load settings when component mounts
  useEffect(() => {
    if (isAuthenticated && user?.role === "Super Admin") {
      console.log("🔍 Loading platform settings...");
      dispatch(getPlatformSettings());
    }
  }, [dispatch, isAuthenticated, user?.role]);

  // Update local state when Redux state changes
  useEffect(() => {
    console.log("📊 Redux state changed:", { platformSettings, securitySettings });
    if (platformSettings && Object.keys(platformSettings).length > 0) {
      console.log("🔄 Updating local state with:", platformSettings);
      setLocalSettings(platformSettings);
    }
    if (securitySettings && Object.keys(securitySettings).length > 0) {
      console.log("🔄 Updating local security state with:", securitySettings);
      setLocalSecuritySettings(securitySettings);
    }
  }, [platformSettings, securitySettings]);

  const handleSettingChange = (category, key, value) => {
    if (category === 'general') {
      setLocalSettings(prev => ({ ...prev, [key]: value }));
    } else if (category === 'security') {
      setLocalSecuritySettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    try {
      console.log("💾 Saving settings:", { localSettings, localSecuritySettings });
      await dispatch(updatePlatformSettings(localSettings, localSecuritySettings));
      console.log("✅ Settings saved successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error saving settings:", error);
    }
  };

  const handleReset = () => {
    setLocalSettings({
      commissionRate: 5.0
    });
    setLocalSecuritySettings({
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      enableAuditLog: true
    });
    toast.info("Settings reset to defaults");
  };

  const handleCancel = () => {
    // Reset to current Redux state
    setLocalSettings(platformSettings);
    setLocalSecuritySettings(securitySettings);
    setIsEditing(false);
  };

  const SettingCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-card border border-border rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
          <Icon className="text-primary text-xl" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );

  const SettingRow = ({ label, children, description, required = false }) => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3 border-b border-border/50 last:border-b-0">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {label}
          {required && <span className="text-destructive text-xs">*</span>}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  if (settingsLoading && !isEditing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Show loading state if user authentication is being checked
  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error and no settings loaded
  if (settingsError && (platformSettings === null || Object.keys(platformSettings).length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiAlertLine className="text-destructive text-2xl" />
          </div>
          <p className="text-destructive mb-2">Failed to load settings</p>
          <p className="text-sm text-muted-foreground mb-4">{settingsError}</p>
          <button
            onClick={() => dispatch(getPlatformSettings())}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiAlertLine className="text-warning text-2xl" />
          </div>
          <p className="text-warning mb-2">Authentication Required</p>
          <p className="text-sm text-muted-foreground">Please log in to access platform settings</p>
        </div>
      </div>
    );
  }

  // Show message if user is not Super Admin
  if (user && user.role && user.role !== "Super Admin") {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiAlertLine className="text-destructive text-2xl" />
          </div>
          <p className="text-destructive mb-2">Access Denied</p>
          <p className="text-sm text-muted-foreground">Only Super Admin users can access platform settings</p>
        </div>
      </div>
    );
  }

  // Show message if user object is not fully loaded
  if (isAuthenticated && (!user || !user.role)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiAlertLine className="text-warning text-2xl" />
          </div>
          <p className="text-warning mb-2">Loading User Data</p>
          <p className="text-sm text-muted-foreground">Please wait while we load your user information</p>
          <button
            onClick={() => dispatch(fetchUser())}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
          >
            Refresh User Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Platform Settings</h2>
          <p className="text-muted-foreground">Configure essential platform settings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={settingsLoading}
            className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <RiRefreshLine size={16} />
            Reset
          </button>
          <button
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            disabled={settingsLoading}
            className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <RiEditLine size={16} />
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={settingsLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <RiSaveLine size={16} />
              {settingsLoading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {settingsError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <RiAlertLine size={20} />
            <span className="font-medium">Error:</span>
          </div>
          <p className="text-sm text-destructive mt-2">
            {settingsError}
          </p>
          <div className="mt-3">
            <button
              onClick={() => dispatch(getPlatformSettings())}
              className="px-3 py-1 bg-destructive text-white text-sm rounded hover:bg-destructive/90 transition-all duration-200 mr-2"
            >
              Retry
            </button>
            <button
              onClick={() => dispatch(fetchUser())}
              className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-all duration-200"
            >
              Refresh Session
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <SettingCard title="General Settings" icon={RiSettingsLine}>
          <div className="space-y-0">
            <SettingRow 
              label="Commission Rate (%)" 
              description="Percentage of commission charged on successful auctions"
              required
            >
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={localSettings.commissionRate}
                onChange={(e) => handleSettingChange('general', 'commissionRate', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="w-20 px-3 py-1 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-muted/50"
              />
            </SettingRow>
          </div>
        </SettingCard>

        {/* Security Settings */}
        <SettingCard title="Security Settings" icon={RiShieldCheckLine}>
          <div className="space-y-0">
            <SettingRow 
              label="Session Timeout (hours)" 
              description="How long before user sessions expire"
              required
            >
              <input
                type="number"
                min="1"
                max="168"
                value={localSecuritySettings.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value) || 1)}
                disabled={!isEditing}
                className="w-20 px-3 py-1 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-muted/50"
              />
            </SettingRow>

            <SettingRow 
              label="Max Login Attempts" 
              description="Maximum failed login attempts before lockout"
              required
            >
              <input
                type="number"
                min="3"
                max="10"
                value={localSecuritySettings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value) || 3)}
                disabled={!isEditing}
                className="w-20 px-3 py-1 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-muted/50"
              />
            </SettingRow>

            <SettingRow 
              label="Password Min Length" 
              description="Minimum characters required for passwords"
              required
            >
              <input
                type="number"
                min="6"
                max="32"
                value={localSecuritySettings.passwordMinLength}
                onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value) || 6)}
                disabled={!isEditing}
                className="w-20 px-3 py-1 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-muted/50"
              />
            </SettingRow>

            <SettingRow 
              label="Enable Audit Log" 
              description="Log all admin actions for security"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSecuritySettings.enableAuditLog}
                  onChange={(e) => handleSettingChange('security', 'enableAuditLog', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-50"></div>
              </label>
            </SettingRow>
          </div>
        </SettingCard>
      </div>

      {/* Current Settings Summary */}
      <SettingCard title="Current Settings Summary" icon={RiMoneyDollarCircleLine} className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Commission Rate</h4>
            <p className="text-lg font-semibold text-foreground">{localSettings.commissionRate}%</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Session Timeout</h4>
            <p className="text-lg font-semibold text-foreground">{localSecuritySettings.sessionTimeout} hours</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Max Login Attempts</h4>
            <p className="text-lg font-semibold text-foreground">{localSecuritySettings.maxLoginAttempts}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Password Min Length</h4>
            <p className="text-lg font-semibold text-foreground">{localSecuritySettings.passwordMinLength} characters</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Audit Log</h4>
            <p className="text-lg font-semibold text-foreground">{localSecuritySettings.enableAuditLog ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </SettingCard>

      {/* Save Reminder */}
      {isEditing && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <RiAlertLine size={20} />
            <span className="font-medium">Remember to save your changes!</span>
          </div>
          <p className="text-sm text-primary mt-2">
            Your changes are not saved until you click the "Save Changes" button.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminSettings; 