import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../service/api";
import { useVideoInterview } from "../../Contexts/VideoInterviewContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Search,
  Loader2,
  User,
  Ticket,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Logo from "../../assets/logo.png";

const OrgRegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    inviteCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Invite code, 2: Registration form
  
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [inviteDetails, setInviteDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dispatch } = useVideoInterview();
  
  // Pre-fill invite code from URL
  useEffect(() => {
    const code = searchParams.get('code');
    const orgSlug = searchParams.get('org');
    
    if (code) {
      setFormData(prev => ({ ...prev, inviteCode: code }));
      // Auto-verify the code
      verifyInviteCode(code);
    }
    
    if (orgSlug) {
      fetchOrgBySlug(orgSlug);
    }
  }, [searchParams]);
  
  const fetchOrgBySlug = async (slug) => {
    try {
      const response = await api.get(`organizations/${slug}/`);
      if (response.data) {
        setSelectedOrg(response.data);
      }
    } catch (err) {
      console.error("Error fetching org:", err);
    }
  };
  
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const response = await api.get(`organizations/search/?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.organizations || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };
  
  const verifyInviteCode = async (code) => {
    // This would ideally hit a verification endpoint
    // For now, we'll just validate on submit
    if (code.length >= 6) {
      setInviteDetails({ code, verified: true });
      setStep(2);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'inviteCode' && value.length >= 8) {
      verifyInviteCode(value);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (!selectedOrg && !formData.inviteCode) {
      setError("Please select an organization or enter an invite code");
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization_id: selectedOrg?.id,
        invite_code: formData.inviteCode || undefined,
      };
      
      const response = await api.post('auth/org/register/', payload);
      
      if (response.data) {
        const userData = response.data.user;
        
        const user = {
          id: userData.id,
          email: userData.email,
          displayName: userData.first_name
            ? `${userData.first_name} ${userData.last_name || ''}`.trim()
            : userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
        };
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user,
            role: response.data.membership?.role || 'student',
            subscription: null,
            organizations: response.data.organization ? [response.data.organization] : [],
            currentOrganization: response.data.organization || null,
          }
        });
        
        navigate("/manage", { replace: true });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={Logo} alt="Interviewsta.AI" className="h-12 w-auto mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            Join Your Organization
          </h2>
          <p className="text-gray-400">
            Register with an invite code from your organization
          </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Invite Code Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter your invite code
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="inviteCode"
                      value={formData.inviteCode}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase tracking-wider"
                      placeholder="ABCD1234"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Ask your organization admin for an invite code
                  </p>
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-transparent text-gray-400">
                      Or find your organization
                    </span>
                  </div>
                </div>
                
                {/* Organization Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Search organizations..."
                    />
                    {searching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                    )}
                  </div>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    {searchResults.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => {
                          setSelectedOrg(org);
                          if (org.allow_self_registration) {
                            setStep(2);
                          } else {
                            setError("This organization requires an invite code to join");
                          }
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
                      >
                        <Building2 className="h-5 w-5 text-purple-400" />
                        <div className="flex-1">
                          <p className="text-white font-medium">{org.name}</p>
                          <p className="text-gray-400 text-sm">@{org.email_domain}</p>
                        </div>
                        {org.allow_self_registration ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Selected Org/Invite */}
                {(selectedOrg || inviteDetails) && (
                  <div className="flex items-center justify-between p-3 mb-6 rounded-lg bg-green-500/20 border border-green-500/30">
                    <div className="flex items-center space-x-3">
                      {selectedOrg ? (
                        <>
                          <Building2 className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium text-sm">{selectedOrg.name}</p>
                            <p className="text-green-300 text-xs">@{selectedOrg.email_domain}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Ticket className="h-5 w-5 text-green-400" />
                          <p className="text-white font-medium text-sm">
                            Invite: {formData.inviteCode}
                          </p>
                        </>
                      )}
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                )}
                
                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                        placeholder={selectedOrg ? `you@${selectedOrg.email_domain}` : "you@organization.edu"}
                      />
                    </div>
                    {selectedOrg?.email_domain && (
                      <p className="mt-1 text-xs text-gray-400">
                        Use your @{selectedOrg.email_domain} email
                      </p>
                    )}
                  </div>
                  
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                        placeholder="At least 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                  
                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
                
                {/* Back button */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-4 py-2 text-gray-400 hover:text-gray-300 text-sm"
                >
                  ← Back to invite code
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Already have account */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/org/login")}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrgRegisterPage;