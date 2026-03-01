// src/Components/Signup.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  User,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Logo from "../assets/logo.png";
import PurpleDropdown from "./Common/PurpleDropdown";
import PhoneInputWithCountry from "./Common/PhoneInputWithCountry";
import CountrySelect from "./Common/CountrySelect";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useVideoInterview();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const showValidationMessage = useRef([]);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingDisabled, setLoadingDisabled] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (showValidationError) {
      // Handle validation error display logic here
      const timer = setTimeout(() => {
        setShowValidationError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showValidationError]);

  useEffect(() => {
    if (loadingDisabled) {
      handleSubmit();
      // Handle loading disabled state here
    }
  }, [loadingDisabled]);

  const handleSubmit = async () => {
    // Handle signup logic here
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const result = await register(
        fullName,
        formData.email,
        formData.password,
        formData.role,
        formData.phone?.trim() || "",
        formData.country?.trim() || ""
      );

      if (!result.success) {
        setErrorMessage(result.error || "Registration failed");
        setShowValidationError(true);
        setLoadingDisabled(false);
        return;
      }

      // Registration successful
      const role = result.role;
      if (true) {
        console.log("Signup successful, role:", role);
        navigate("/manage");
      } else {
        console.error("Error during signup");
      }
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        setShowValidationError(true);
      } else if (error.code === "auth/weak-password") {
        // Handle weak password error
        setShowValidationError()
      } else if (error.code === "auth/invalid-email") {
        // Handle invalid email error
      }

    } finally { 
      setLoadingDisabled(false);
    }
  };
  const handleSignInWithGoogle = () => {
    setLoadingDisabled(true);
    // Store role for OAuth callback
    localStorage.setItem('signup_role', formData.role);
    
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

  const handleSignInWithGithub = () => {
    setLoadingDisabled(true);
    // Store role for OAuth callback
    localStorage.setItem('signup_role', formData.role);
    
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
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSwitchToLogin = () => {
    navigate("/login");
  };

  const benefits = [
    {
      icon: Target,
      title: "Personalized Learning",
      description: "AI adapts to your skill level and career goals",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor improvement with detailed analytics",
    },
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Certificates valued by top employers",
    },
  ];

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength < 2) return "bg-red-500";
    if (strength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen !bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:flex-1 !bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden h-auto">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">
                Join 50,000+ Professionals
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Start Your Success Journey Today
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Create your free account and get access to AI-powered interview
              preparation tools that have helped thousands land their dream
              jobs.
            </p>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-100">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="font-medium">
                What's included in your free account:
              </span>
            </div>
            <ul className="space-y-2 text-blue-100">
              <li>• 3 AI video interviews per month</li>
              <li>• 10 practice tests</li>
              <li>• Basic resume analysis</li>
              <li>• Progress tracking dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="p-4 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-md w-full space-y-5">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={Logo} alt="Interviewsta.AI" className="h-12 w-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-5 text-gray-900">
              Create your account
            </h2>
          </div>

          {/* Signup Form */}
          <form className="space-y-4 relative" onSubmit={(e) => {e.preventDefault(); setLoadingDisabled(true);}}>
            <AnimatePresence mode="wait">
            {showValidationError && (
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
                className="absolute -top-14 left-0 w-full bg-yellow-100 flex flex-col justify-center px-4 py-1 rounded-lg border border-yellow-300"
              >
                <p className="text-yellow-800 text-sm font-bold">
                  This Email is already in use.
                </p>
                <p className="text-yellow-700 text-sm">
                  Kindly try logging in instead.
                </p>
              </motion.div>
            )}
            </AnimatePresence>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`${loadingDisabled ? "opacity-50 cursor-not-allowed" : ""} block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400`}
                      placeholder="John"
                      disabled={loadingDisabled}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={` ${loadingDisabled ? "opacity-50 cursor-not-allowed" : ""} block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400`}
                    placeholder="Doe"
                    disabled={loadingDisabled}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`${loadingDisabled ? "opacity-50 cursor-not-allowed" : ""} block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400`}
                    placeholder="john@example.com"
                    disabled={loadingDisabled}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone number
                </label>
                <div className={loadingDisabled ? "opacity-50 pointer-events-none" : ""}>
                  <PhoneInputWithCountry
                    id="phone"
                    value={formData.phone}
                    onChange={(v) => handleInputChange("phone", v || "")}
                    onCountryChange={(c) => handleInputChange("country", c || "")}
                    defaultCountry="US"
                    disabled={loadingDisabled}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country / Region
                </label>
                <CountrySelect
                  id="country"
                  value={formData.country}
                  onChange={(v) => handleInputChange("country", v || "")}
                  disabled={loadingDisabled}
                  placeholder="Select your country or region"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`${loadingDisabled ? "!opacity-50" : ""} h-5 w-5 text-gray-400`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`${loadingDisabled ? "opacity-50 cursor-not-allowed" : ""} block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400`}
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(
                            passwordStrength(formData.password)
                          )}`}
                          style={{
                            width: `${
                              (passwordStrength(formData.password) / 5) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {getStrengthText(passwordStrength(formData.password))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`${loadingDisabled ? "!opacity-50" : ""} h-5 w-5 text-gray-400`} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`${loadingDisabled ? "opacity-50 cursor-not-allowed" : ""} block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400`}
                    placeholder="Confirm your password"
                    disabled={loadingDisabled}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  I am a
                </label>
                <PurpleDropdown
                  value={formData.role}
                  onChange={(value) => handleInputChange("role", value)}
                  placeholder="Select your role"
                  disabled={loadingDisabled}
                  options={[
                    { value: 'student', label: 'Student' },
                    { value: 'teacher', label: 'Teacher' },
                    { value: 'admin', label: 'Admin' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                disabled={loadingDisabled}
              />
              <label
                htmlFor="accept-terms"
                className="ml-2 block text-sm text-gray-700 leading-relaxed"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  !acceptTerms || formData.password !== formData.confirmPassword || loadingDisabled
                }
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingDisabled ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <ArrowRight className="h-4 w-4 text-blue-200 group-hover:text-white transition-colors" />
                    </span>
                    Create your free account
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>

          {/* Social Signup */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSignInWithGoogle}
                disabled={loadingDisabled}
              >
                {loadingDisabled ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing up...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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

              {/* <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                <span className="ml-2">Twitter</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
