import Spinner from "@/custom-components/Spinner";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "@/store/slices/userSlice";
import { 
  RiUserLine, 
  RiMailLine, 
  RiPhoneLine, 
  RiMapPinLine, 
  RiShieldUserLine,
  RiCalendarLine,
  RiBankLine,
  RiPaypalLine,
  RiMoneyDollarCircleLine,
  RiTrophyLine,
  RiEditLine,
  RiSaveLine,
  RiCloseLine,
  RiCameraLine,
  RiStarLine,
  RiAuctionLine
} from "react-icons/ri";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // State for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
    bankName: user?.paymentMethods?.bankTransfer?.bankName || "",
    bankAccountNumber: user?.paymentMethods?.bankTransfer?.bankAccountNumber || "",
    bankAccountName: user?.paymentMethods?.bankTransfer?.bankAccountName || "",
    upiId: user?.paymentMethods?.upi?.upiId || "",
    paypalEmail: user?.paymentMethods?.paypal?.paypalEmail || ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  // Update editable fields when user data changes
  useEffect(() => {
    if (user) {
      setEditableFields({
        phone: user?.phone || "",
        address: user?.address || "",
        bankName: user?.paymentMethods?.bankTransfer?.bankName || "",
        bankAccountNumber: user?.paymentMethods?.bankTransfer?.bankAccountNumber || "",
        bankAccountName: user?.paymentMethods?.bankTransfer?.bankAccountName || "",
        upiId: user?.paymentMethods?.upi?.upiId || "",
        paypalEmail: user?.paymentMethods?.paypal?.paypalEmail || ""
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Prepare the data to send to the API
      const updateData = {
        phone: editableFields.phone,
        address: editableFields.address,
        bankName: editableFields.bankName,
        bankAccountNumber: editableFields.bankAccountNumber,
        bankAccountName: editableFields.bankAccountName,
        upiId: editableFields.upiId,
        paypalEmail: editableFields.paypalEmail
      };

      // Dispatch the update action
      await dispatch(updateProfile(updateData));
      
      // Close editing mode on success
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Error handling is done in the Redux action
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setEditableFields({
      phone: user?.phone || "",
      address: user?.address || "",
      bankName: user?.paymentMethods?.bankTransfer?.bankName || "",
      bankAccountNumber: user?.paymentMethods?.bankTransfer?.bankAccountNumber || "",
      bankAccountName: user?.paymentMethods?.bankTransfer?.bankAccountName || "",
      upiId: user?.paymentMethods?.upi?.upiId || "",
      paypalEmail: user?.paymentMethods?.paypal?.paypalEmail || ""
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
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
          
          {/* Enhanced Header with Profile Image */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              
              {/* Profile Image Section */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl">
                  <img
                    src={user?.profileImage?.url}
                    alt={user?.userName}
                    className="w-28 h-28 rounded-2xl object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <RiStarLine className="text-white text-sm" />
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {user?.userName}
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                    <RiShieldUserLine className="text-primary" size={20} />
                    <span className="text-primary font-semibold">{user?.role}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl">
                    <RiCalendarLine className="text-accent" size={20} />
                    <span className="text-accent font-semibold">
                      Joined {formatDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg">
                  Welcome to your profile dashboard! Manage your personal information and payment details here.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Personal Details Section */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center">
                    <RiUserLine className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Personal Details</h2>
                    <p className="text-muted-foreground">Your basic account information</p>
                  </div>
                </div>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 bg-primary text-white hover:bg-primary/90 hover:scale-105"
                  >
                    <RiEditLine size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 bg-success text-white hover:bg-success/90 hover:scale-105"
                    >
                      <RiSaveLine size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105"
                    >
                      <RiCloseLine size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username - Read Only */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiUserLine className="text-primary" size={16} />
                    Name
                  </label>
                  <input
                    type="text"
                    value={user?.userName || ""}
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-foreground cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiMailLine className="text-primary" size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-foreground cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                {/* Phone - Editable */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiPhoneLine className="text-primary" size={16} />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editableFields.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                      isEditing 
                        ? "bg-white border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-muted/30 border-border cursor-not-allowed"
                    }`}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                  <p className="text-xs text-muted-foreground">
                    {isEditing ? "Enter your 11-digit phone number" : "Phone number cannot be changed while not editing"}
                  </p>
                </div>

                {/* Address - Editable */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <RiMapPinLine className="text-primary" size={16} />
                    Address
                  </label>
                  <textarea
                    value={editableFields.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 resize-none ${
                      isEditing 
                        ? "bg-white border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-muted/30 border-border cursor-not-allowed"
                    }`}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {isEditing ? "Enter your complete address" : "Address cannot be changed while not editing"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Methods Section - Only for Auctioneers */}
            {user?.role === "Auctioneer" && (
              <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center">
                    <RiMoneyDollarCircleLine className="text-accent text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
                    <p className="text-muted-foreground">Your payment details for receiving commissions</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Bank Transfer Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <RiBankLine className="text-primary" size={20} />
                      Bank Transfer Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Bank Name</label>
                        <input
                          type="text"
                          value={editableFields.bankName}
                          onChange={(e) => handleInputChange("bankName", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                            isEditing 
                              ? "bg-white border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                              : "bg-muted/30 border-border cursor-not-allowed"
                          }`}
                          disabled={!isEditing}
                          placeholder="Enter bank name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Account Number</label>
                        <input
                          type="text"
                          value={editableFields.bankAccountNumber}
                          onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                            isEditing 
                              ? "bg-white border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                              : "bg-muted/30 border-border cursor-not-allowed"
                          }`}
                          disabled={!isEditing}
                          placeholder="Enter account number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Account Holder Name</label>
                        <input
                          type="text"
                          value={editableFields.bankAccountName}
                          onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                            isEditing 
                              ? "bg-white border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                              : "bg-muted/30 border-border cursor-not-allowed"
                          }`}
                          disabled={!isEditing}
                          placeholder="Enter account holder name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Digital Payment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <RiBankLine className="text-accent" size={20} />
                      Digital Payments
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <RiPaypalLine className="text-primary" size={16} />
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={editableFields.upiId}
                          onChange={(e) => handleInputChange("upiId", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                            isEditing 
                              ? "bg-white border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                              : "bg-muted/30 border-border cursor-not-allowed"
                          }`}
                          disabled={!isEditing}
                          placeholder="Enter UPI ID"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <RiPaypalLine className="text-accent" size={16} />
                          PayPal Email
                        </label>
                        <input
                          type="email"
                          value={editableFields.paypalEmail}
                          onChange={(e) => handleInputChange("paypalEmail", e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 ${
                            isEditing 
                              ? "bg-white border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                              : "bg-muted/30 border-border cursor-not-allowed"
                          }`}
                          disabled={!isEditing}
                          placeholder="Enter PayPal email"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Dashboard */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/30 rounded-2xl flex items-center justify-center">
                  <RiTrophyLine className="text-success text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Your Statistics</h2>
                  <p className="text-muted-foreground">Overview of your auction activity</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{user?.auctionsWon || 0}</div>
                  <div className="text-primary/80 text-sm">Auctions Won</div>
                </div>
                
                <div className="bg-gradient-to-br from-accent/10 to-accent/20 border border-accent/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-accent mb-1">{formatCurrency(user?.moneySpent || 0)}</div>
                  <div className="text-accent/80 text-sm">Total Spent</div>
                </div>
                
                {user?.role === "Auctioneer" && (
                  <div className="bg-gradient-to-br from-warning/10 to-warning/20 border border-warning/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-warning mb-1">{formatCurrency(user?.unpaidCommission || 0)}</div>
                    <div className="text-warning/80 text-sm">Unpaid Commission</div>
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-success/10 to-success/20 border border-success/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-success mb-1">{formatDate(user?.createdAt)}</div>
                  <div className="text-success/80 text-sm">Member Since</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;

