import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { RiAuctionFill, RiLockLine, RiMailLine, RiEyeLine, RiEyeOffLine, RiCheckLine, RiErrorWarningLine } from "react-icons/ri";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && !validatePassword(value)) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate before submission
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Send JSON data instead of FormData
    const loginData = {
      email: email,
      password: password
    };
    
    console.log("🔍 Login attempt with data:", loginData);
    console.log("Email:", email);
    console.log("Password:", password);
    
    dispatch(login(loginData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated, loading]);

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center bg-gradient-to-br from-dashboard-bg to-background">
        <div className="mx-auto w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <RiAuctionFill className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your PrimeBid account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <RiMailLine className="text-muted-foreground" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                      emailError 
                        ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-4 focus:ring-destructive/20" 
                        : emailFocused 
                        ? "border-primary bg-white focus:ring-4 focus:ring-primary/20" 
                        : "border-border bg-muted/30 hover:border-primary/50"
                    }`}
                    required
                  />
                  {email && !emailError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                      <RiCheckLine size={20} />
                    </div>
                  )}
                  {emailError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                      <RiErrorWarningLine size={20} />
                    </div>
                  )}
                </div>
                {emailError && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <RiErrorWarningLine size={16} />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <RiLockLine className="text-muted-foreground" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                      passwordError 
                        ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-4 focus:ring-destructive/20" 
                        : passwordFocused 
                        ? "border-primary bg-white focus:ring-4 focus:ring-primary/20" 
                        : "border-border bg-muted/30 hover:border-primary/50"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                  >
                    {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                  </button>
                  {password && !passwordError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                      <RiCheckLine size={20} />
                    </div>
                  )}
                  {passwordError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                      <RiErrorWarningLine size={20} />
                    </div>
                  )}
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <RiErrorWarningLine size={16} />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                className="w-full py-3 px-6 bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg rounded-xl hover:from-primary/90 hover:to-accent/90 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                type="submit"
                disabled={loading || emailError || passwordError}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
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

export default Login;
