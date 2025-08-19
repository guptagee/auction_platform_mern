import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUser, deleteUser, getUserActivityLogs } from "@/store/slices/superAdminSlice";
import { 
  RiUserLine, 
  RiMailLine, 
  RiPhoneLine, 
  RiMapPinLine, 
  RiCalendarLine, 
  RiShieldUserLine,
  RiSearchLine,
  RiFilter3Line,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiAuctionLine,
  RiMoneyDollarCircleLine,
  RiTrophyLine,
  RiStarLine,
  RiCloseLine,
  RiSaveLine,
  RiHistoryLine
} from "react-icons/ri";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { 
    totalAuctioneers, 
    totalBidders, 
    userCounts,
    superAdminUsers,
    auctioneerUsers,
    bidderUsers,
    loading,
    userActivityLogs,
    userActivityPagination
  } = useSelector((state) => state.superAdmin);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  // State for modals and actions
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log("🔍 UserManagement Debug:");
  console.log("userCounts:", userCounts);
  console.log("superAdminUsers:", superAdminUsers);
  console.log("auctioneerUsers:", auctioneerUsers);
  console.log("bidderUsers:", bidderUsers);
  console.log("totalAuctioneers (monthly):", totalAuctioneers);
  console.log("totalBidders (monthly):", totalBidders);

  // Use actual user counts for display
  const actualAuctioneersCount = userCounts?.auctioneers || 0;
  const actualBiddersCount = userCounts?.bidders || 0;
  const totalUsersCount = userCounts?.total || 0;

  // Use actual user objects for display
  const allUsers = [
    ...(superAdminUsers || []).map(user => ({ ...user, role: "Super Admin" })),
    ...(auctioneerUsers || []).map(user => ({ ...user, role: "Auctioneer" })),
    ...(bidderUsers || []).map(user => ({ ...user, role: "Bidder" }))
  ];

  console.log("📊 All users for display:", allUsers);

  // Action handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      userName: user.userName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || ""
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleViewActivity = async (user) => {
    try {
      setSelectedUser(user);
      setShowActivityModal(true);
      // Fetch user activity logs
      await dispatch(getUserActivityLogs(user._id));
    } catch (error) {
      console.error("Error fetching user activity:", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Validate form
      if (!editForm.userName.trim() || !editForm.email.trim()) {
        toast.error("Username and email are required");
        return;
      }

      // Check if role is being changed
      if (editForm.role !== selectedUser.role) {
        const confirmRoleChange = window.confirm(
          `Are you sure you want to change this user's role from "${selectedUser.role}" to "${editForm.role}"? This will affect their permissions.`
        );
        if (!confirmRoleChange) {
          return;
        }
      }

      setIsLoading(true);
      
      // Call the real API to update user
      await dispatch(updateUser(selectedUser._id, editForm));
      
      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating user:", error);
      // Error is already handled by the Redux action
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      
      // Call the real API to delete user
      await dispatch(deleteUser(selectedUser._id));
      
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      // Error is already handled by the Redux action
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.userName || "").localeCompare(b.userName || "");
      case "role":
        return (a.role || "").localeCompare(b.role || "");
      case "date":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "activity":
        return (b.auctionsWon || 0) - (a.auctionsWon || 0);
      default:
        return 0;
    }
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Super Admin": return "bg-red-500";
      case "Auctioneer": return "bg-blue-500";
      case "Bidder": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <RiUserLine className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{totalUsersCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/20 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <RiAuctionLine className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Auctioneers</p>
              <p className="text-2xl font-bold text-foreground">{actualAuctioneersCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500/10 to-green-500/20 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <RiTrophyLine className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bidders</p>
              <p className="text-2xl font-bold text-foreground">{actualBiddersCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative min-w-0">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="Auctioneer">Auctioneers</option>
            <option value="Bidder">Bidders</option>
            <option value="Super Admin">Super Admins</option>
          </select>
          
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="role">Sort by Role</option>
            <option value="date">Sort by Date</option>
            <option value="activity">Sort by Activity</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-0">
                  User
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-0">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-0">
                  Contact
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-0">
                  Stats
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-0">
                  Joined
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-0">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedUsers.map((user, index) => (
                <tr key={user._id || index} className="hover:bg-muted/30 transition-colors duration-200">
                  {/* User Info */}
                  <td className="px-4 lg:px-6 py-4 min-w-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profileImage?.url || "https://via.placeholder.com/40"}
                          alt={user.userName}
                        />
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">
                          {user.userName || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {user.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Role */}
                  <td className="px-4 lg:px-6 py-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getRoleColor(user.role)} flex-shrink-0`}></div>
                      <span className="text-sm font-medium text-foreground truncate">
                        {user.role || "N/A"}
                      </span>
                    </div>
                  </td>
                  
                  {/* Contact */}
                  <td className="px-4 lg:px-6 py-4 min-w-0">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <RiPhoneLine size={14} className="flex-shrink-0" />
                        <span className="truncate">{user.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RiMapPinLine size={14} className="flex-shrink-0" />
                        <span className="truncate max-w-24 lg:max-w-32">
                          {user.address || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Stats */}
                  <td className="px-4 lg:px-6 py-4 min-w-0">
                    <div className="text-sm text-muted-foreground">
                      {user.role === "Bidder" ? (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <RiTrophyLine size={14} className="flex-shrink-0" />
                            <span className="truncate">Won: {user.auctionsWon || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RiMoneyDollarCircleLine size={14} className="flex-shrink-0" />
                            <span className="truncate">Spent: {formatCurrency(user.moneySpent || 0)}</span>
                          </div>
                        </>
                      ) : user.role === "Auctioneer" ? (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <RiAuctionLine size={14} className="flex-shrink-0" />
                            <span className="truncate">Auctions: {user.auctionsCreated || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RiMoneyDollarCircleLine size={14} className="flex-shrink-0" />
                            <span className="truncate">Commission: {formatCurrency(user.unpaidCommission || 0)}</span>
                          </div>
                        </>
                      ) : (
                        <span>Admin</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Joined Date */}
                  <td className="px-4 lg:px-6 py-4 min-w-0 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <RiCalendarLine size={14} className="flex-shrink-0" />
                      <span className="truncate">{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 lg:px-6 py-4 min-w-0 text-sm font-medium">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="text-primary hover:text-primary/80 transition-colors p-1 rounded hover:bg-primary/10 flex-shrink-0"
                        title="View User Details"
                      >
                        <RiEyeLine size={16} />
                      </button>
                      <button 
                        onClick={() => handleViewActivity(user)}
                        className="text-info hover:text-info/80 transition-colors p-1 rounded hover:bg-info/10 flex-shrink-0"
                        title="View User Activity"
                      >
                        <RiHistoryLine size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-accent hover:text-accent/80 transition-colors p-1 rounded hover:bg-accent/10 flex-shrink-0"
                        title="Edit User"
                      >
                        <RiEditLine size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded hover:bg-destructive/10 flex-shrink-0"
                        title="Delete User"
                      >
                        <RiDeleteBinLine size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <RiUserLine className="text-4xl text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm || roleFilter !== "all" 
                ? "Try adjusting your search or filters"
                : "No users have been registered yet"
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {sortedUsers.length} of {allUsers.length} users
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">User Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                <p className="text-foreground">{selectedUser.userName || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <p className="text-foreground">{selectedUser.email || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <p className="text-foreground">{selectedUser.phone || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)} text-white`}>
                  {selectedUser.role || "N/A"}
                </span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
                <p className="text-foreground">{selectedUser.address || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Joined Date</label>
                <p className="text-foreground">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">User ID</label>
                <p className="text-foreground text-xs font-mono">{selectedUser._id || "N/A"}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Bidder">Bidder</option>
                  <option value="Auctioneer">Auctioneer</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <RiSaveLine size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Delete User</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="font-medium text-foreground">{selectedUser.userName || "Unknown User"}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">Role: {selectedUser.role}</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Modal */}
      {showActivityModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                User Activity Logs - {selectedUser.userName}
              </h3>
              <button
                onClick={() => setShowActivityModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">User:</span>
                  <p className="text-foreground">{selectedUser.userName}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <p className="text-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Role:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)} text-white`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Joined:</span>
                  <p className="text-foreground">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Activity Logs Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Performed By
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-muted-foreground">Loading activity logs...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {userActivityLogs?.length > 0 ? (
                          userActivityLogs.map((log, index) => (
                            <tr key={log._id || index} className="hover:bg-muted/30 transition-colors duration-200">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  log.action.includes('DELETE') || log.action.includes('SUSPEND') 
                                    ? 'bg-red-100 text-red-800' 
                                    : log.action.includes('UPDATE') || log.action.includes('CHANGED')
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {log.action.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground">
                                {log.description}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                {log.performedBy?.userName || 'System'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  log.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                  log.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                  log.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {log.severity}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                {log.formattedTimestamp || new Date(log.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                              No activity logs found for this user.
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {userActivityPagination && userActivityPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing page {userActivityPagination.currentPage} of {userActivityPagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewActivity(selectedUser, { page: userActivityPagination.currentPage - 1 })}
                    disabled={!userActivityPagination.hasPrevPage}
                    className="px-3 py-1 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleViewActivity(selectedUser, { page: userActivityPagination.currentPage + 1 })}
                    disabled={!userActivityPagination.hasNextPage}
                    className="px-3 py-1 border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowActivityModal(false)}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 