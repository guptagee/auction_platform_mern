import { register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { 
  RiAuctionFill, 
  RiUserLine, 
  RiMailLine, 
  RiLockLine, 
  RiPhoneLine, 
  RiMapPinLine, 
  RiBankCardLine, 
  RiPaypalLine,
  RiImageLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiStarLine
} from "react-icons/ri";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  // Focus states for better UX
  const [focusedField, setFocusedField] = useState("");
  
  // Error states for validation
  const [errors, setErrors] = useState({});

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const validateField = (field, value) => {
    switch (field) {
      case 'userName':
        return value.length >= 3 ? "" : "Username must be at least 3 characters";
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? "" : "Please enter a valid email address";
      case 'phone':
        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(value) ? "" : "Phone number must be exactly 11 digits";
      case 'address':
        return value.length >= 10 ? "" : "Address must be at least 10 characters";
      case 'password':
        return value.length >= 8 ? "" : "Password must be at least 8 characters";
      case 'role':
        return value ? "" : "Please select a role";
      case 'bankName':
        return role === "Auctioneer" && !value ? "Bank name is required for auctioneers" : "";
      case 'bankAccountNumber':
        return role === "Auctioneer" && !value ? "Bank account number is required for auctioneers" : "";
      case 'bankAccountName':
        return role === "Auctioneer" && !value ? "Bank account holder name is required for auctioneers" : "";
      case 'upiId':
        return role === "Auctioneer" && !value ? "UPI ID is required for auctioneers" : "";
      case 'paypalEmail':
        return role === "Auctioneer" && !value ? "PayPal email is required for auctioneers" : "";
      default:
        return "";
    }
  };

  const handleFieldChange = (field, value) => {
    // Update the field value
    switch (field) {
      case 'userName': setUserName(value); break;
      case 'email': setEmail(value); break;
      case 'phone': setPhone(value); break;
      case 'address': setAddress(value); break;
      case 'role': setRole(value); break;
      case 'password': setPassword(value); break;
      case 'bankAccountName': setBankAccountName(value); break;
      case 'bankAccountNumber': setBankAccountNumber(value); break;
      case 'bankName': setBankName(value); break;
      case 'upiId': setUpiId(value); break;
      case 'paypalEmail': setPaypalEmail(value); break;
      default: break;
    }

    // Validate and update errors
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    const fields = ['userName', 'email', 'phone', 'address', 'role', 'password'];
    if (role === "Auctioneer") {
      fields.push('bankName', 'bankAccountNumber', 'bankAccountName', 'upiId', 'paypalEmail');
    }
    
    fields.forEach(field => {
      const value = eval(field); // Get field value dynamically
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profileImage", profileImage);
    role === "Auctioneer" &&
      (formData.append("bankAccountName", bankAccountName),
      formData.append("bankAccountNumber", bankAccountNumber),
      formData.append("bankName", bankName),
      formData.append("upiId", upiId),
      formData.append("paypalEmail", paypalEmail));
    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, loading, isAuthenticated]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
  };

  const getInputClassName = (field) => {
    const hasError = errors[field];
    const isFocused = focusedField === field;
    
    return `w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
      hasError 
        ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-4 focus:ring-destructive/20" 
        : isFocused 
        ? "border-primary bg-white focus:ring-4 focus:ring-primary/20" 
        : "border-border bg-muted/30 hover:border-primary/50"
    }`;
  };

  const renderFieldIcon = (field) => {
    if (errors[field]) {
      return <RiErrorWarningLine size={20} className="text-destructive" />;
    }
    if (eval(field) && !errors[field]) { // Get field value dynamically
      return <RiCheckLine size={20} className="text-success" />;
    }
    return null;
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center bg-gradient-to-br from-dashboard-bg to-background">
        <div className="mx-auto w-full max-w-4xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <RiAuctionFill className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join PrimeBid
            </h1>
            <p className="text-muted-foreground">
              Create your account and start bidding or selling
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <form onSubmit={handleRegister} className="space-y-8">
              
              {/* Personal Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <RiUserLine className="text-primary text-lg" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Personal Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <RiUserLine className="text-muted-foreground" />
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => handleFieldChange('userName', e.target.value)}
                        onFocus={() => setFocusedField('userName')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your full name"
                        className={getInputClassName('userName')}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {renderFieldIcon('userName')}
                      </div>
                    </div>
                    {errors.userName && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <RiErrorWarningLine size={16} />
                        {errors.userName}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <RiMailLine className="text-muted-foreground" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your email"
                        className={getInputClassName('email')}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {renderFieldIcon('email')}
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <RiErrorWarningLine size={16} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <RiPhoneLine className="text-muted-foreground" />
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your phone number"
                        className={getInputClassName('phone')}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {renderFieldIcon('phone')}
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <RiErrorWarningLine size={16} />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <RiMapPinLine className="text-muted-foreground" />
                      Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your address"
                        className={getInputClassName('address')}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {renderFieldIcon('address')}
                      </div>
                    </div>
                    {errors.address && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <RiErrorWarningLine size={16} />
                        {errors.address}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <RiUserLine className="text-muted-foreground" />
                      Role
                    </label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => handleFieldChange('role', e.target.value)}
                        onFocus={() => setFocusedField('role')}
                        onBlur={() => setFocusedField('')}
                        className={getInputClassName('role')}
                        required
                      >
                        <option value="">Select your role</option>
                        <option value="Auctioneer">Auctioneer</option>
                        <option value="Bidder">Bidder</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {renderFieldIcon('role')}
                      </div>
                    </div>
                    {errors.role && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <RiErrorWarningLine size={16} />
                        {errors.role}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <RiLockLine className="text-muted-foreground" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Create a strong password"
                        className={`${getInputClassName('password')} pr-12`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                      >
                        {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                      </button>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {renderFieldIcon('password')}
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <RiErrorWarningLine size={16} />
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Image Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <RiImageLine className="text-accent text-lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Profile Image</h3>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-all duration-300">
                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <RiImageLine className="text-muted-foreground text-3xl" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Upload Profile Image
                    </label>
                    <input
                      type="file"
                      onChange={imageHandler}
                      accept="image/*"
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 file:transition-all file:duration-200"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, or WebP up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section - Only for Auctioneers */}
              {role === "Auctioneer" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <RiBankCardLine className="text-success text-lg" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                      <RiStarLine className="text-success text-sm" />
                      <span className="text-success text-sm font-medium">Required for Auctioneers</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Bank Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => handleFieldChange('bankName', e.target.value)}
                          onFocus={() => setFocusedField('bankName')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter bank name"
                          className={getInputClassName('bankName')}
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {renderFieldIcon('bankName')}
                        </div>
                      </div>
                      {errors.bankName && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <RiErrorWarningLine size={16} />
                          {errors.bankName}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Account Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={bankAccountNumber}
                          onChange={(e) => handleFieldChange('bankAccountNumber', e.target.value)}
                          onFocus={() => setFocusedField('bankAccountNumber')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter account number"
                          className={getInputClassName('bankAccountNumber')}
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {renderFieldIcon('bankAccountNumber')}
                        </div>
                      </div>
                      {errors.bankAccountNumber && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <RiErrorWarningLine size={16} />
                          {errors.bankAccountNumber}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Account Holder Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={bankAccountName}
                          onChange={(e) => handleFieldChange('bankAccountName', e.target.value)}
                          onFocus={() => setFocusedField('bankAccountName')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter account holder name"
                          className={getInputClassName('bankAccountName')}
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {renderFieldIcon('bankAccountName')}
                        </div>
                      </div>
                      {errors.bankAccountName && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <RiErrorWarningLine size={16} />
                          {errors.bankAccountName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <RiPaypalLine className="text-primary" />
                        UPI ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => handleFieldChange('upiId', e.target.value)}
                          onFocus={() => setFocusedField('upiId')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter UPI ID"
                          className={getInputClassName('upiId')}
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {renderFieldIcon('upiId')}
                        </div>
                      </div>
                      {errors.upiId && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <RiErrorWarningLine size={16} />
                          {errors.upiId}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <RiPaypalLine className="text-accent" />
                        PayPal Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={paypalEmail}
                          onChange={(e) => handleFieldChange('paypalEmail', e.target.value)}
                          onFocus={() => setFocusedField('paypalEmail')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter PayPal email"
                          className={getInputClassName('paypalEmail')}
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {renderFieldIcon('paypalEmail')}
                        </div>
                      </div>
                      {errors.paypalEmail && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <RiErrorWarningLine size={16} />
                          {errors.paypalEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  className="w-full py-4 px-6 bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg rounded-xl hover:from-primary/90 hover:to-accent/90 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading || Object.keys(errors).some(key => errors[key])}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <RiArrowRightLine size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link to="/" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
