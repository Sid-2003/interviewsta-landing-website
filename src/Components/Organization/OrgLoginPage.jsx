import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  CheckCircle,
  X,
  GraduationCap,
  Briefcase,
  Code,
  Users,
} from "lucide-react";
import Logo from "../../assets/logo.png";

const OrgLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Organization selection
  const [step, setStep] = useState(1); // 1: Find org, 2: Login
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { dispatch } = useVideoInterview();
  
  const from = location.state?.from?.pathname || "/manage";
  
  // Check if org is pre-selected via URL param
  useEffect(() => {
    const orgSlug = searchParams.get('org');
    if (orgSlug) {
      fetchOrgBySlug(orgSlug);
    }
  }, [searchParams]);
  
  const fetchOrgBySlug = async (slug) => {
    try {
      const response = await api.get(`organizations/${slug}/`);
      if (response.data) {
        setSelectedOrg(response.data);
        setStep(2);
      }
    } catch (err) {
      console.error("Error fetching org:", err);
    }
  };
  
  // Search organizations
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
  
  // Auto-detect org from email domain
  const handleEmailChange = async (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail.includes('@') && !selectedOrg) {
      const domain = newEmail.split('@')[1];
      if (domain && domain.includes('.')) {
        try {
          const response = await api.get(`organizations/search/?domain=${domain}`);
          if (response.data.organizations?.length === 1) {
            setSelectedOrg(response.data.organizations[0]);
          }
        } catch (err) {
          // Ignore - just a hint
        }
      }
    }
  };
  
  const selectOrganization = (org) => {
    setSelectedOrg(org);
    setStep(2);
    setSearchQuery("");
    setSearchResults([]);
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const payload = {
        email: email.toLowerCase().trim(),
        password,
      };
      
      // If org selected, use org-specific login
      if (selectedOrg) {
        payload.organization_id = selectedOrg.id;
      }
      
      const response = await api.post(
        selectedOrg ? 'auth/org/login/' : 'auth/login/',
        payload
      );
      
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
            role: userData.role || 'student',
            subscription: response.data.subscription || null,
            organizations: response.data.organizations || [],
            currentOrganization: response.data.current_organization || null,
          }
        });
        
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const getOrgTypeIcon = (type) => {
    switch (type) {
      case 'university': return GraduationCap;
      case 'company': return Briefcase;
      case 'bootcamp': return Code;
      default: return Building2;
    }
  };
  
  const getOrgTypeColor = (type) => {
    switch (type) {
      case 'university': return 'bg-blue-100 text-blue-600';
      case 'company': return 'bg-purple-100 text-purple-600';
      case 'bootcamp': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={Logo} alt="Interviewsta.AI" className="h-12 w-auto mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Organization Login
            </h2>
            <p className="text-gray-400">
              Sign in with your organization credentials
            </p>
          </div>
          
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                // Step 1: Find Organization
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Find your organization
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Search by name or domain..."
                      />
                      {searching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                      )}
                    </div>
                  </div>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                      {searchResults.map((org) => {
                        const TypeIcon = getOrgTypeIcon(org.org_type);
                        return (
                          <button
                            key={org.id}
                            onClick={() => selectOrganization(org)}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
                          >
                            {org.logo_url ? (
                              <img src={org.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getOrgTypeColor(org.org_type)}`}>
                                <TypeIcon className="h-5 w-5" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{org.name}</p>
                              <p className="text-gray-400 text-sm truncate">@{org.email_domain}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Skip org selection */}
                  <div className="text-center">
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Continue without selecting organization →
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Step 2: Login Form
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Selected Organization */}
                  {selectedOrg && (
                    <div className="flex items-center justify-between p-3 mb-6 rounded-lg bg-purple-500/20 border border-purple-500/30">
                      <div className="flex items-center space-x-3">
                        {selectedOrg.logo_url ? (
                          <img src={selectedOrg.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6 text-purple-400" />
                        )}
                        <div>
                          <p className="text-white font-medium text-sm">{selectedOrg.name}</p>
                          <p className="text-purple-300 text-xs">@{selectedOrg.email_domain}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedOrg(null); setStep(1); }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                  
                  {/* Error Message */}
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
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          required
                          disabled={loading}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                          placeholder="you@organization.edu"
                        />
                      </div>
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Forgot Password */}
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        Forgot password?
                      </button>
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
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                  
                  {/* Register Link */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                      Have an invite code?{" "}
                      <button
                        onClick={() => navigate("/org/register")}
                        className="text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Back to main login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              ← Back to regular login
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Side - Info */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Building2 className="h-5 w-5 text-purple-400" />
              <span className="text-white text-sm font-medium">Enterprise Solution</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Empowering Organizations
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Join hundreds of universities, companies, and bootcamps using Interviewsta.AI
              to prepare their students and employees for success.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: GraduationCap, label: "Universities", count: "100+" },
              { icon: Briefcase, label: "Companies", count: "50+" },
              { icon: Users, label: "Students", count: "50K+" },
              { icon: CheckCircle, label: "Success Rate", count: "95%" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                <stat.icon className="h-6 w-6 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">{stat.count}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgLoginPage;