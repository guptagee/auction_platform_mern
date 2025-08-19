// API Configuration
export const API_BASE_URL = "http://localhost:5001";

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USER_REGISTER: `${API_BASE_URL}/api/v1/user/register`,
  USER_LOGIN: `${API_BASE_URL}/api/v1/user/login`,
  USER_LOGOUT: `${API_BASE_URL}/api/v1/user/logout`,
  USER_PROFILE: `${API_BASE_URL}/api/v1/user/me`,
  USER_UPDATE_PROFILE: `${API_BASE_URL}/api/v1/user/update`,
  USER_LEADERBOARD: `${API_BASE_URL}/api/v1/user/leaderboard`,
  
  // Auction endpoints
  AUCTION_ALL_ITEMS: `${API_BASE_URL}/api/v1/auctionitem/allitems`,
  AUCTION_MY_ITEMS: `${API_BASE_URL}/api/v1/auctionitem/myitems`,
  AUCTION_CREATE: `${API_BASE_URL}/api/v1/auctionitem/create`,
  AUCTION_DETAILS: (id) => `${API_BASE_URL}/api/v1/auctionitem/auction/${id}`,
  AUCTION_REPUBLISH: (id) => `${API_BASE_URL}/api/v1/auctionitem/item/republish/${id}`,
  AUCTION_DELETE: (id) => `${API_BASE_URL}/api/v1/auctionitem/delete/${id}`,
  
  // Bid endpoints
  BID_PLACE: (id) => `${API_BASE_URL}/api/v1/bid/place/${id}`,
  
  // Commission endpoints
  COMMISSION_PROOF: `${API_BASE_URL}/api/v1/commission/proof`,
  
  // Super Admin endpoints
  SUPER_ADMIN_MONTHLY_INCOME: `${API_BASE_URL}/api/v1/superadmin/monthlyincome`,
  SUPER_ADMIN_ALL_USERS: `${API_BASE_URL}/api/v1/superadmin/users/getall`,
  SUPER_ADMIN_ALL_PAYMENT_PROOFS: `${API_BASE_URL}/api/v1/superadmin/paymentproofs/getall`,
  SUPER_ADMIN_DELETE_PAYMENT_PROOF: (id) => `${API_BASE_URL}/api/v1/superadmin/paymentproof/delete/${id}`,
  SUPER_ADMIN_GET_PAYMENT_PROOF: (id) => `${API_BASE_URL}/api/v1/superadmin/paymentproof/${id}`,
  SUPER_ADMIN_UPDATE_PAYMENT_PROOF_STATUS: (id) => `${API_BASE_URL}/api/v1/superadmin/paymentproof/status/update/${id}`,
  SUPER_ADMIN_DELETE_AUCTION_ITEM: (id) => `${API_BASE_URL}/api/v1/superadmin/auctionitem/delete/${id}`,
  
  // User Management endpoints
  SUPER_ADMIN_UPDATE_USER: (id) => `${API_BASE_URL}/api/v1/superadmin/users/update/${id}`,
  SUPER_ADMIN_DELETE_USER: (id) => `${API_BASE_URL}/api/v1/superadmin/users/delete/${id}`,
  SUPER_ADMIN_GET_USER_ACTIVITY: (id) => `${API_BASE_URL}/api/v1/superadmin/users/activity/${id}`,
  SUPER_ADMIN_CREATE_ACTIVITY_LOG: `${API_BASE_URL}/api/v1/superadmin/users/activity/log`,
  
  // Platform Settings endpoints
  SUPER_ADMIN_GET_SETTINGS: `${API_BASE_URL}/api/v1/superadmin/settings`,
  SUPER_ADMIN_UPDATE_SETTINGS: `${API_BASE_URL}/api/v1/superadmin/settings`,
  
  // Contact endpoints
  CONTACT_SEND_MESSAGE: `${API_BASE_URL}/api/v1/contact/send`,
  
  // Active Auctions endpoint
  SUPER_ADMIN_ACTIVE_AUCTIONS: `${API_BASE_URL}/api/v1/superadmin/auctions/active`,
}; 