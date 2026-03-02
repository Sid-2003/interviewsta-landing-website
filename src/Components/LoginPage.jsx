import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import {
  useMotionValue,
  motion,
  easeIn,
  easeOut,
  AnimatePresence,
  easeInOut,
} from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Users,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Logo from "../assets/logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [loadingDisabled, setLoadingDisabled] = useState(false);
  const [error, setError] = useState("");
  const Navigate = useNavigate();
  const { state, login } = useVideoInterview();
  const { user, loading } = state.auth;

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      // User is already authenticated, redirect based on role
      const role = localStorage.getItem('role') || 'student';
      console.log("[INFO] User already authenticated, redirecting...", role);
      
      if (role === 'teacher') {
        Navigate('/teacher/classes', { replace: true });
      } else if (role === 'admin') {
        Navigate('/admin/dashboard', { replace: true });
      } else {
        Navigate('/manage', { replace: true });
      }
    }
  }, [user, loading, Navigate]);

  // Google OAuth Sign-In
  const handleGoogleSignIn = () => {
    setLoadingDisabled(true);
    setValidationError(false);
    setError("");
    
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'profile email';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=google`;
    
    window.location.href = googleAuthUrl;
  };

  // GitHub OAuth Sign-In
  const handleGithubSignIn = () => {
    setLoadingDisabled(true);
    setValidationError(false);
    setError("");
    
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'user:email';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=github`;
    
    window.location.href = githubAuthUrl;
  };
  
  const signInWithEmailPassword = async (e) => {
    e.preventDefault();
    setLoadingDisabled(true);
    setValidationError(false);
    setError("");
    
    // Trim email before using it
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError("Email is required.");
      setLoadingDisabled(false);
      setValidationError(true);
      return;
    }
    
    try {
      const result = await login(trimmedEmail, password);
      
      if (!result.success) {
        setError(result.error || "Login failed.");
        setLoadingDisabled(false);
        setValidationError(true);
        return;
      }
      
      // Login successful, navigate based on role
      const role = result.role;
      if (role === 'teacher') {
        Navigate('/teacher/classes', { replace: true });
      } else if (role === 'admin') {
        Navigate('/admin/dashboard', { replace: true });
      } else {
        Navigate('/manage', { replace: true });
      }
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      setLoadingDisabled(false);
      setValidationError(true);
      setError("Invalid email or password.");
    }
  };

  const handleForgotPassword = () => {
    Navigate("/forgot-password");
  }
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Interviews",
      description: "Practice with advanced AI that adapts to your responses",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your progress with detailed insights and metrics",
    },
    {
      icon: Users,
      title: "Expert Coaching",
      description: "Get personalized feedback from industry professionals",
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={Logo} alt="Interviewsta.AI" className="h-12 w-auto" />
            </div>
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform">
                TRIAL
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-15">
              Welcome back
            </h2>
          </div>

          {/* Show loading if checking auth state */}
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Login Form */}
          {!loading && (
          <form className="mt-8 space-y-6 relative" onSubmit={signInWithEmailPassword}>
            <AnimatePresence mode="wait">
              {validationError && (
                <motion.div
                  key="validationError" // Add this key prop
                  initial={{ scaleY: 0.1, opacity: 0, y: 0, x: 0 }}
                  animate={{
                    scaleY: 1,
                    opacity: 1,
                    y: 0,
                    x: [0, -15, 15, -10, 10, -6, 6, -3, 3, 0],
                  }}
                  exit={{ scaleY: 0, opacity: 0.5, y: 0 }}
                  style={{ transformOrigin: "bottom" }}
                  transition={{
                    opacity: { duration: 0.2, ease: "easeOut" }, // quick fade in
                    x: { delay: 0.1, duration: 0.6, ease: "easeInOut" },
                    scaleY: { duration: 0.05, ease: "easeOut" },
                    // type: "spring",
                  }}
                  className="absolute overflow-hidden h-auto transition-all duration-100 ease-in-out w-full bg-red-200 -top-14 right-0 rounded-sm border-1 border-red-400 flex flex-col items-start pl-3 justify-center text-sm"
                >
                  <p className="font-bold block">Invalid Email or Password.</p>
                  <p className="block">Kindly re-check and try again.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="text-gray-700"> Email address </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    onBlur={(e) => setEmail(e.target.value.trim())}
                    className={` ${
                      loadingDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400`}
                    placeholder="Enter your email"
                    disabled={loadingDisabled}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="text-gray-700"> Password </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${loadingDisabled ? "!opacity-50" : ""} text-gray-400`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={` ${
                      loadingDisabled
                        ? "!opacity-50 cursor-not-allowed"
                        : ""
                    } block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400`}
                    placeholder="Enter your password"
                    disabled={loadingDisabled}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                <div className="text-gray-700"> Remember me</div> 
                </label> */}
              </div>

              <div className="text-sm" onClick={handleForgotPassword}>
                <a
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={` ${loadingDisabled ? "!opacity-50 cursor-not-allowed" : ""} group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                disabled={loadingDisabled}
              >
                {loadingDisabled ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex animate-arrow-jitter items-center pl-3">
                      <ArrowRight className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors" />
                    </span>
                    Sign in to your account
                  </>
                )}
              </button>
            </div>

          </form>
          )}

          {/* Social Login */}
          {!loading && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loadingDisabled}
                className="w-full col-span-2 inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingDisabled ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </>
                )}
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">
                Powered by Advanced AI
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Master Your Interview Skills
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of professionals who have successfully landed their
              dream jobs with our AI-powered interview preparation platform.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-blue-200 text-sm">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-blue-200 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-200 text-sm">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
