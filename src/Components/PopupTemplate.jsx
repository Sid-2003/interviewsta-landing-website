import React, { useState,useEffect } from 'react';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';
import { useNavigate } from 'react-router-dom';
import LoadingWrapper from './Experimental/LoadingWrapper';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Award,
  Calendar,
  ExternalLink,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Edit3,
  Save,
  Camera,
  Globe,
  Linkedin,
  Github,
  Play,
  Sparkles
} from 'lucide-react';

const PopupTemplate = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [applicableSkills,setApplicableSkills] = useState([]);
  const {state,dispatch} = useVideoInterview();
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const skills = ["C++","Java","JavaScript","TypeScript","Python","Node.js","React.js","Next.js","Docker","Kubernetes","Ruby","AWS","Docker","Git"];
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    title: 'Senior Frontend Developer',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'sarahjohnson.dev',
    linkedin: 'linkedin.com/in/sarahjohnson',
    github: 'github.com/sarahjohnson',
    summary: 'Experienced frontend developer with 6+ years building scalable web applications using React, TypeScript, and modern development practices. Passionate about creating exceptional user experiences and leading high-performing teams.',
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        duration: '2022 - Present',
        description: 'Lead a team of 4 developers building React applications serving 100K+ users. Implemented micro-frontend architecture reducing load times by 40%.'
      },
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        duration: '2020 - 2022',
        description: 'Developed responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UI components.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        year: '2018'
      }
    ],
    skills: ['React.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Git'],
    certifications: [
      'AWS Certified Developer',
      'Google Cloud Professional',
      'Certified Scrum Master'
    ]
  });
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);
  useEffect (() => {
    console.log(newSkill);
  },[newSkill])
  useEffect(() => {

    const modifiedSkills = skills.filter((value,index) => !profileData.skills.includes(value))
    setApplicableSkills(modifiedSkills);
    setNewSkill(modifiedSkills[0])
   
  },[profileData]);
  

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowPreview(true);
      }, 2000);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };
  const handleAddSkills = (e) => {
    // console.log(newSkill);
    // const newskills = profileData.skills.push(newSkill);
    // console.log(newskills);
    profileData.skills.push(newSkill);
    setProfileData({...profileData,skills:profileData.skills});
  }
  const handleRemoveSkills = (skill) => {
    setProfileData({...profileData,skills:profileData.skills.filter((value) => value !== skill)})
  }

  const handleSelect = (e) => {
    setNewSkill(e.target.value);
  }
  const handleSubmit = (e) => {
    let resumeString = "";

    Object.entries(profileData).forEach(([key, value]) => {
      resumeString += `${key}: `;
      
      if (Array.isArray(value)) {
        resumeString += "\n";
        
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            // Handle array of objects
            Object.entries(item).forEach(([subKey, subValue]) => {
              resumeString += `  ${subKey}: ${subValue}\n`;
            });
            if (index < value.length - 1) resumeString += "\n"; // Add spacing between objects
          } else {
            // Handle array of primitive values (strings, numbers)
            resumeString += `  ${item}\n`;
          }
        });
      } else {
        resumeString += `${value}\n`;
      }
      
      resumeString += "\n"; // Add spacing between sections
    });
    const payloadInput = { Resume: resumeString };
    console.log(state);
    const interviewType = state.session.split(' ')[0];
    const currentPayload = state.videoInterview[interviewType];
    console.log("This is the interview type",interviewType);
    console.log("This is the current payload",currentPayload);
  
    dispatch({ type:interviewType, payload:{...currentPayload, ...payloadInput}});
    Navigate('/interview-interface');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Fixed Header with Upload */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-40"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                Video Interview Setup
              </h1>
              <p className="text-gray-600 text-sm">Upload your resume or create a new one from scratch</p>
            </div>
            
            {/* Upload Section */}
            <div className="flex flex-wrap items-center gap-3">
              {uploadedFile && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2.5 rounded-xl border border-blue-200 shadow-sm"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{uploadedFile.name}</span>
                  {isAnalyzing && <RefreshCw className="h-4 w-4 text-blue-600 animate-spin ml-2" />}
                </motion.div>
              )}
              
              {/* AutoFill Resume button hidden */}
              {/* <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <motion.label
                  htmlFor="resume-upload"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center space-x-2 shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                  <span>AutoFill Resume</span>
                </motion.label>
              </div> */}
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setEditMode(!editMode)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md ${
                    editMode 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {editMode ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  <span>{editMode ? 'Save' : 'Edit'}</span>
                </motion.button>
                <motion.button 
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold cursor-pointer hover:shadow-xl transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Play className="h-4 w-4" />
                  <span>Begin</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      

      {/* Main Content - Horizontal Flow */}
      <div className="py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Resume Builder - Horizontal Layout */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 min-h-[calc(100vh-200px)]">
              {/* Left Side - Form */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 z-10 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Virtual Resume</h2>
                  </div>
                  <p className="text-gray-600 text-sm ml-13">Fill in your information to provide the interviewer better context about you</p>
                </div>
                
                <div className="p-6 lg:p-8 space-y-8 overflow-y-auto flex-1">
                  {/* Personal Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span>Personal Information</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!editMode}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Title</label>
                        <input
                          type="text"
                          value={profileData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          disabled={!editMode}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!editMode}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!editMode}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!editMode}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          disabled={!editMode}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Professional Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <span>Professional Summary</span>
                    </h3>
                    <textarea
                      value={profileData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      disabled={!editMode}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200 resize-none"
                      placeholder="Write a compelling professional summary..."
                    />
                  </motion.div>

                  {/* Experience */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <span>Work Experience</span>
                      </h3>
                      {editMode && (
                        <motion.button
                          onClick={addExperience}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Experience</span>
                        </motion.button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {profileData.experience.map((exp, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 space-y-3">
                              <div className="grid md:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                  disabled={!editMode}
                                  placeholder="Job Title"
                                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                                />
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                  disabled={!editMode}
                                  placeholder="Company Name"
                                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                                />
                              </div>
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                                disabled={!editMode}
                                placeholder="Duration (e.g., 2020 - Present)"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                              />
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                disabled={!editMode}
                                rows={3}
                                placeholder="Describe your role and achievements..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200 resize-none"
                              />
                            </div>
                            {editMode && (
                              <motion.button
                                onClick={() => removeExperience(index)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Education */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-white" />
                      </div>
                      <span>Education</span>
                    </h3>
                    <div className="space-y-4">
                      {profileData.education.map((edu, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="border-2 border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                        >
                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={edu.degree}
                              disabled={!editMode}
                              placeholder="Degree"
                              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-all duration-200"
                            />
                            <input
                              type="text"
                              value={edu.school}
                              disabled={!editMode}
                              placeholder="School/University"
                              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-all duration-200"
                            />
                          </div>
                          <input
                            type="text"
                            value={edu.year}
                            disabled={!editMode}
                            placeholder="Graduation Year"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 transition-all duration-200 mt-3"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Skills */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <span>Skills</span>
                    </h3>
                    {editMode && (
                    <select
                      type="text"
                      disabled={!editMode}
                      onChange={(e)=>{handleSelect(e)}}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-50 transition-all duration-200"
                    >
                      {applicableSkills.map((value,index) =>
                        <option key={index} value={value}>
                            {value}
                        </option>
                      )}
                    </select>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full shadow-md"
                        >
                          <span className="text-sm font-semibold">{skill}</span>
                          {editMode && (
                            <motion.button 
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-white hover:text-red-200 ml-1" 
                              onClick={() => {handleRemoveSkills(skill)}}
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                      {editMode && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-1.5 rounded-full hover:from-gray-200 hover:to-gray-300 shadow-md font-semibold"
                          onClick={handleAddSkills}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="text-sm">Add Skill</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Side - Live Preview */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 z-10 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Live Preview</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Download className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Resume Preview */}
                <div className="p-8 lg:p-10 bg-white overflow-y-auto flex-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {/* Header */}
                  <div className="text-center mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{profileData.name}</h1>
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">{profileData.title}</h2>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                      <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700 font-medium">{profileData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                        <Phone className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-700 font-medium">{profileData.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-pink-50 px-3 py-1.5 rounded-lg">
                        <MapPin className="h-4 w-4 text-pink-600" />
                        <span className="text-gray-700 font-medium">{profileData.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg">
                        <Globe className="h-4 w-4 text-indigo-600" />
                        <span className="text-gray-700 font-medium">{profileData.website}</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                      <span>Professional Summary</span>
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-base bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">{profileData.summary}</p>
                  </div>

                  {/* Experience */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                      <span>Work Experience</span>
                    </h3>
                    <div className="space-y-6">
                      {profileData.experience.map((exp, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-1">{exp.title}</h4>
                              <p className="text-blue-600 font-semibold text-lg">{exp.company}</p>
                            </div>
                            <span className="text-gray-600 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{exp.duration}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
                      <span>Education</span>
                    </h3>
                    <div className="space-y-4">
                      {profileData.education.map((edu, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
                        >
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{edu.degree}</h4>
                            <p className="text-gray-600 font-medium">{edu.school}</p>
                          </div>
                          <span className="text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-full">{edu.year}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full"></div>
                      <span>Technical Skills</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <motion.span 
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center space-x-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                      <span>Certifications</span>
                    </h3>
                    <div className="space-y-3">
                      {profileData.certifications.map((cert, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 bg-gradient-to-br from-white to-indigo-50 p-3 rounded-xl border border-indigo-200"
                        >
                          <Award className="h-5 w-5 text-indigo-600" />
                          <span className="text-gray-700 font-semibold">{cert}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PopupTemplate;