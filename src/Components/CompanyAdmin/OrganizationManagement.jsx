import React, { useState, useEffect } from 'react';
import api from '../../service/api';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../service/api";
import {
  Building2, Plus, Users, Ticket, Copy, Trash2, Search, Loader2, 
  CheckCircle, ArrowRight, ArrowLeft, Mail, Globe, MapPin, 
  GraduationCap, Briefcase, Code, Edit2, Eye, UserPlus, X,
  AlertCircle, Settings, MoreVertical, RefreshCw
} from 'lucide-react';

const OrganizationManagement = () => {
  // View states
  const [view, setView] = useState('list'); // 'list', 'create', 'detail', 'members'
  const [selectedOrg, setSelectedOrg] = useState(null);
  
  // Data states
  const [organizations, setOrganizations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Create org form state
  const [createStep, setCreateStep] = useState(1); // 1: Basic Info, 2: Settings, 3: Confirm
  const [orgForm, setOrgForm] = useState({
    subscription_tier_name: 'standard',
    name: '',
    slug: '',
    org_type: 'university',
    email_domain: '',
    logo_url: '',
    website: '',
    address: '',
    city: '',
    country: 'India',
    allow_self_registration: false,
  });
  
  // Add member state
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'student',
    department: '',
    student_id: '',
  });
  
  // Invite state
  const [showCreateInvite, setShowCreateInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'student',
    max_uses: 1,
  });
  const [createdInvite, setCreatedInvite] = useState(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterType) params.append('org_type', filterType);
      
      const response = await api.get(`admin/organizations/?${params}`);
      setOrganizations(response.data.organizations || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgDetails = async (orgId) => {
    setLoading(true);
    try {
      const response = await api.get(`admin/organizations/${orgId}/`);
      setSelectedOrg(response.data);
    } catch (err) {
      console.error('Error fetching org details:', err);
      setError('Failed to fetch organization details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (orgId) => {
    setLoading(true);
    try {
      const response = await api.get(`admin/organizations/${orgId}/members/`);
      setMembers(response.data.members || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create Organization
  const handleCreateOrg = async () => {
    setActionLoading(true);
    setError('');
    
    try {
      const response = await api.post('admin/organizations/', orgForm);
      
      if (response.data.organization) {
        setSuccess('Organization created successfully!');
        setSelectedOrg(response.data.organization);
        setView('members'); // Go directly to add members
        fetchOrganizations(); // Refresh list
        
        // Reset form
        setOrgForm({
          name: '',
          slug: '',
          org_type: 'university',
          email_domain: '',
          logo_url: '',
          website: '',
          address: '',
          city: '',
          country: 'India',
          allow_self_registration: false,
        });
        setCreateStep(1);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create organization');
    } finally {
      setActionLoading(false);
    }
  };

  // Add Member Directly
  const handleAddMember = async () => {
    if (!selectedOrg || !memberForm.email) return;
    
    setActionLoading(true);
    setError('');
    
    try {
      const response = await api.post(`admin/organizations/${selectedOrg.id}/members/`, memberForm);
      
      if (response.data) {
        setSuccess(`Member ${memberForm.email} added successfully!`);
        fetchMembers(selectedOrg.id);
        setShowAddMember(false);
        setMemberForm({ first_name: '', last_name: '', email: '', role: 'student', department: '', student_id: '' });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setActionLoading(false);
    }
  };

  // Create Invite
  const handleCreateInvite = async () => {
    if (!selectedOrg) return;
    
    setActionLoading(true);
    setError('');
    
    try {
      const response = await api.post('organizations/invite/', {
        organization_id: selectedOrg.id,
        ...inviteForm,
      });
      
      if (response.data) {
        setCreatedInvite(response.data);
        setSuccess('Invite created successfully!');
        // Refresh org details to get updated invites
        fetchOrgDetails(selectedOrg.id);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create invite');
    } finally {
      setActionLoading(false);
    }
  };

  // Remove Member
  const handleRemoveMember = async (membershipId) => {
    if (!selectedOrg || !window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await api.delete(`admin/organizations/${selectedOrg.id}/members/${membershipId}/`);
      setSuccess('Member removed successfully');
      fetchMembers(selectedOrg.id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove member');
    }
  };

  // Copy helpers
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getInviteLink = (code) => {
    return `${window.location.origin}/org/register?code=${code}&org=${selectedOrg?.slug}`;
  };

  // UI Helpers
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
      case 'university': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'company': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'bootcamp': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'teacher': return 'bg-purple-100 text-purple-700';
      case 'student': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Clear messages after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ============================================
  // RENDER: Organizations List
  // ============================================
  const renderOrgList = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage organization entities and their members</p>
        </div>
        <button
          onClick={() => { setView('create'); setCreateStep(1); }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Organization</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrganizations()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Search organizations..."
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Types</option>
          <option value="university">Universities</option>
          <option value="company">Companies</option>
          <option value="bootcamp">Bootcamps</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={fetchOrganizations}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Organizations Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : organizations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 mb-2">No organizations found</p>
          <button
            onClick={() => setView('create')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Create your first organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => {
            const TypeIcon = getOrgTypeIcon(org.org_type);
            return (
              <div
                key={org.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => { setSelectedOrg(org); fetchOrgDetails(org.id); setView('detail'); }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {org.logo_url ? (
                      <img src={org.logo_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getOrgTypeColor(org.org_type)}`}>
                        <TypeIcon className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{org.name}</h3>
                      <p className="text-sm text-gray-500">@{org.email_domain}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${org.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {org.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{org.member_count || 0} members</span>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${getOrgTypeColor(org.org_type)}`}>
                    {org.org_type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER: Create Organization (Multi-step)
  // ============================================
  const renderCreateOrg = () => (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => setView('list')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Organization</h1>
          <p className="text-gray-600">Step {createStep} of 3</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              createStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {createStep > step ? <CheckCircle className="h-5 w-5" /> : step}
            </div>
            {step < 3 && (
              <div className={`flex-1 h-1 mx-2 ${createStep > step ? 'bg-purple-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AnimatePresence mode="wait">
          {createStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Stanford University"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'university', label: 'University', icon: GraduationCap },
                    { value: 'company', label: 'Company', icon: Briefcase },
                    { value: 'bootcamp', label: 'Bootcamp', icon: Code },
                    { value: 'other', label: 'Other', icon: Building2 },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setOrgForm({ ...orgForm, org_type: type.value })}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        orgForm.org_type === type.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className={`h-6 w-6 mx-auto mb-1 ${
                        orgForm.org_type === type.value ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        orgForm.org_type === type.value ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Domain <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                  <input
                    type="text"
                    value={orgForm.email_domain}
                    onChange={(e) => setOrgForm({ ...orgForm, email_domain: e.target.value.replace('@', '') })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="stanford.edu"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Users must use this email domain to register</p>
              </div>

              {/* Slug (auto-generated preview) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">{window.location.origin}/org/</span>
                  <input
                    type="text"
                    value={orgForm.slug || orgForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}
                    onChange={(e) => setOrgForm({ ...orgForm, slug: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="stanford-university"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {createStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
              
              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={orgForm.website}
                    onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://www.stanford.edu"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={orgForm.logo_url}
                  onChange={(e) => setOrgForm({ ...orgForm, logo_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={orgForm.city}
                    onChange={(e) => setOrgForm({ ...orgForm, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Palo Alto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={orgForm.country}
                    onChange={(e) => setOrgForm({ ...orgForm, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="USA"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={orgForm.address}
                  onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Full address..."
                />
              </div>

              {/* Subscription Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Tier <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'standard', name: 'Standard', description: 'Basic features', color: 'blue' },
                    { id: 'pro', name: 'Pro', description: 'All features + priority', color: 'purple' },
                    { id: 'max', name: 'Max', description: 'Enterprise grade', color: 'amber' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setOrgForm({ ...orgForm, subscription_tier_name: tier.id })}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                          orgForm.subscription_tier_name === tier.id
                          ? `border-${tier.color}-500 bg-${tier.color}-50 ring-2 ring-${tier.color}-200`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className={`font-semibold ${
                        orgForm.subscription_tier_name === tier.id ? `text-${tier.color}-700` : 'text-gray-900'
                      }`}>
                        {tier.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Self Registration Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Allow Self Registration</p>
                  <p className="text-sm text-gray-500">Users can register without an invite code</p>
                </div>
                <button
                  onClick={() => setOrgForm({ ...orgForm, allow_self_registration: !orgForm.allow_self_registration })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    orgForm.allow_self_registration ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    orgForm.allow_self_registration ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </motion.div>
          )}

          {createStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review & Confirm</h2>
              
              {/* Preview Card */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-start space-x-4 mb-4">
                  {orgForm.logo_url ? (
                    <img src={orgForm.logo_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getOrgTypeColor(orgForm.org_type)}`}>
                      {React.createElement(getOrgTypeIcon(orgForm.org_type), { className: 'h-8 w-8' })}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{orgForm.name || 'Organization Name'}</h3>
                    <p className="text-gray-600">@{orgForm.email_domain || 'domain.com'}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded capitalize ${getOrgTypeColor(orgForm.org_type)}`}>
                      {orgForm.org_type}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {orgForm.website && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span className="truncate">{orgForm.website}</span>
                    </div>
                  )}
                  {(orgForm.city || orgForm.country) && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{[orgForm.city, orgForm.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-sm text-gray-600">
                    <strong>Registration URL:</strong>{' '}
                    <code className="bg-white px-2 py-0.5 rounded text-purple-600">
                      {window.location.origin}/org/register?org={orgForm.slug || 'slug'}
                    </code>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Self Registration:</strong>{' '}
                    {orgForm.allow_self_registration ? (
                      <span className="text-green-600">Enabled</span>
                    ) : (
                      <span className="text-orange-600">Invite Only</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Subscription Tier:</strong>{' '}
                    <span className={`font-semibold capitalize ${
                      orgForm.subscription_tier_name === 'max' ? 'text-amber-600' :
                      orgForm.subscription_tier_name === 'pro' ? 'text-purple-600' : 'text-blue-600'
                      // orgForm.subscription_tier_name === 'standard' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {orgForm.subscription_tier_name || 'standard'}
                    </span>
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => createStep > 1 ? setCreateStep(createStep - 1) : setView('list')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{createStep > 1 ? 'Back' : 'Cancel'}</span>
          </button>
          
          {createStep < 3 ? (
            <button
              onClick={() => setCreateStep(createStep + 1)}
              disabled={createStep === 1 && (!orgForm.name || !orgForm.email_domain)}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleCreateOrg}
              disabled={actionLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Create Organization</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER: Organization Detail / Members
  // ============================================
  const renderOrgDetail = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => { setView('list'); setSelectedOrg(null); }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          {selectedOrg && (
            <div className="flex items-center space-x-3">
              {selectedOrg.logo_url ? (
                <img src={selectedOrg.logo_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getOrgTypeColor(selectedOrg.org_type)}`}>
                  {React.createElement(getOrgTypeIcon(selectedOrg.org_type), { className: 'h-6 w-6' })}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedOrg.name}</h1>
                <p className="text-gray-600">@{selectedOrg.email_domain}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateInvite(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Ticket className="h-5 w-5" />
            <span>Create Invite</span>
          </button>
          <button
            onClick={() => { fetchMembers(selectedOrg.id); setView('members'); }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span>Manage Members</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : selectedOrg && (
        <div className="grid grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="col-span-2 grid grid-cols-3 gap-4">
            {[
              { label: 'Total Members', value: selectedOrg.stats?.total_members || 0, color: 'blue' },
              { label: 'Students', value: selectedOrg.stats?.students || 0, color: 'green' },
              { label: 'Teachers', value: selectedOrg.stats?.teachers || 0, color: 'purple' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={selectedOrg.is_active ? 'text-green-600' : 'text-red-600'}>
                  {selectedOrg.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Self Registration</span>
                <span>{selectedOrg.allow_self_registration ? 'Allowed' : 'Invite Only'}</span>
              </div>
            </div>
          </div>

          {/* Recent Invites */}
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Invites</h3>
              <button
                onClick={() => setShowCreateInvite(true)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                + New Invite
              </button>
            </div>
            
            {selectedOrg.recent_invites?.length > 0 ? (
              <div className="space-y-2">
                {selectedOrg.recent_invites.map((invite) => (
                  <div key={invite.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Ticket className="h-5 w-5 text-purple-500" />
                      <code className="font-mono font-bold text-gray-900">{invite.code}</code>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${getRoleColor(invite.role)}`}>
                        {invite.role}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{invite.times_used}/{invite.max_uses} used</span>
                      <button
                        onClick={() => copyToClipboard(getInviteLink(invite.code), invite.code)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {copied === invite.code ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No invites created yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER: Members Management
  // ============================================
  const renderMembers = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView('detail')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Members</h1>
            <p className="text-gray-600">{selectedOrg?.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Joined</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600 mx-auto" />
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No members found. Add members using invites or direct addition.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.membership_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                      member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(member.joined_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemoveMember(member.membership_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ============================================
  // MODALS
  // ============================================
  
  // Add Member Modal
  const renderAddMemberModal = () => (
    <AnimatePresence>
      {showAddMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowAddMember(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Member</h2>
              <button onClick={() => setShowAddMember(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={memberForm.first_name}
                    onChange={(e) => setMemberForm({ ...memberForm, first_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={memberForm.last_name}
                    onChange={(e) => setMemberForm({ ...memberForm, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Doe"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="user@organization.edu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department (optional)</label>
                <input
                  type="text"
                  value={memberForm.department}
                  onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Computer Science"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMember(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!memberForm.email || actionLoading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Add Member'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Create Invite Modal
  const renderCreateInviteModal = () => (
    <AnimatePresence>
      {showCreateInvite && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => { setShowCreateInvite(false); setCreatedInvite(null); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {createdInvite ? 'Invite Created!' : 'Create Invite'}
              </h2>
              <button onClick={() => { setShowCreateInvite(false); setCreatedInvite(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {createdInvite ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">Invite Code</p>
                  <code className="text-2xl font-mono font-bold text-purple-600">{createdInvite.invite_code}</code>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={getInviteLink(createdInvite.invite_code)}
                      className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(getInviteLink(createdInvite.invite_code), 'invite-link')}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      {copied === 'invite-link' ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => { setShowCreateInvite(false); setCreatedInvite(null); }}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Specific email or leave empty"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={inviteForm.max_uses}
                    onChange={(e) => setInviteForm({ ...inviteForm, max_uses: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateInvite(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateInvite}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Invite'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="p-6">
      {/* Success/Error Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Views */}
      {view === 'list' && renderOrgList()}
      {view === 'create' && renderCreateOrg()}
      {view === 'detail' && renderOrgDetail()}
      {view === 'members' && renderMembers()}
      
      {/* Modals */}
      {renderAddMemberModal()}
      {renderCreateInviteModal()}
    </div>
  );
};

export default OrganizationManagement;