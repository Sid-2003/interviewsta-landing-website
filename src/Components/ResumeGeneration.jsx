import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Download,
  Sparkles,
  CheckCircle,
  Loader2,
  PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import {
  ProfessionalTemplate,
  ModernTemplate,
  CreativeTemplate,
  MinimalTemplate
} from './ResumeTemplates';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';
import { duration } from '@mui/material/styles';
import axios from 'axios';

import api from "../service/api";
const ResumeGeneration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const { state, dispatch } = useVideoInterview();
  const resumeRef = useRef(null);

  useEffect(() => {
    console.log(`[DEBUG] This is the generated resume ${generatedResume}`);
  },[generatedResume]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: '',
    experience: [{ company: '', position: '', duration: '', description: [''] }],
    education: [{ school: '', degree: '', year: '', gpa: '' }],
    projects: [{ name: '', technologies: '', duration: '', description: [''] }],
    skills: '',
    certifications: '',
    jobDescription: ''
  });

  useEffect(() => {


  },[formData])

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and elegant design for corporate roles',
      color: 'blue',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with bold typography',
      color: 'purple',
      preview: 'bg-gradient-to-br from-purple-50 to-purple-100'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Unique layout for creative industries',
      color: 'pink',
      preview: 'bg-gradient-to-br from-pink-50 to-pink-100'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and straightforward approach',
      color: 'gray',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayField = (section) => {
    const emptyFields = {
      experience: { company: '', position: '', duration: '', description: '' },
      education: { school: '', degree: '', year: '', gpa: '' },
      projects: { name: '', technologies: '', duration: '', description: '' }
    };
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], emptyFields[section]]
    }));
  };

  const removeArrayField = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const transformArrayFieldsForAPI = (data) => {
    const work_experience = data.experience.map(exp => ({
      company: exp.company,
      duration: exp.duration,
      title: exp.position,
      achievements: exp.description
    }));

    const education = data.education.map(edu => ({
      school: edu.school,
      degree: edu.degree,
      duration: edu.year,
      gpa: edu.gpa
    }));

    const projects = data.projects.map(proj => ({
      name: proj.name,
      technologies: proj.technologies,
      duration: proj.duration,
      description: proj.description
    }));

    return [work_experience, education, projects];
  };

  const transformReturnData = (data) => {
    const education = data.final_resume.education.map((val,ind) => ({
      school: val.school,
      degree: val.degree,
      duration: val.duration,
      gpa: val.gpa
    }));

    const experience = data.final_resume.work_experience.map((val,ind) => ({
      company: val.company,
      position: val.title,
      duration: val.duration,
      description: val.optimized_achievements
    }));

    const projects = data.final_resume.projects.map((val,ind) => ({
      name: val.name,
      technologies: val.technologies,
      duration: val.duration,
      description: val.optimized_description
    }));

    return [education, experience, projects]
  }

  const generateResume = async () => {
    const formInputData = new FormData();
    const [work_experience, education, projects] = transformArrayFieldsForAPI(formData);
    formInputData.append('job_description', formData?.jobDescription ?? '');
    formInputData.append('work_experience', JSON.stringify(work_experience));
    formInputData.append('education', JSON.stringify(education));
    formInputData.append('projects', JSON.stringify(projects));
    formInputData.append('skills', formData.skills);

    console.log('[DEBUG] Sending this to the backend', formInputData);
    const user = state.auth.user;
        const response = await api.post('resume-generation/', formInputData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    const data = response.data;

    console.log(data);
    const [educationTransformed, experienceTransformed, projectsTransformed] = transformReturnData(data);
    console.log(data.final_resume.skills);



    // setFormData({...formData,skills:data.skills,education:educationTransformed,experience:experienceTransformed,projects:projectsTransformed});
    // setFormData({...FormData,education:})

    // if(!response.ok) {
    //   console.error("[ERROR] Error optimizing resume:", response.statusText);
    //   // return;
    // } 

    // const data = await response.json();

    console.log("[INFO] Resume optimization response data:", data);

    setIsGenerating(true);

    setTimeout(() => {
      const optimizedResume = {
        ...formData,
        skills:data.final_resume.skills,
        education:educationTransformed,
        experience:experienceTransformed,
        projects:projectsTransformed,
        summary: formData.summary || `Results-driven professional with proven expertise in delivering high-impact solutions. Demonstrated success in ${formData.experience[0]?.position || 'technical roles'} with strong analytical and problem-solving capabilities. Seeking to leverage comprehensive skill set to drive innovation and exceed objectives in challenging environments.`,
        optimizedSkills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        matchScore: Math.floor(Math.random() * 15) + 85
      };

      setGeneratedResume(optimizedResume);
      setIsGenerating(false);
      setCurrentStep(5);
    }, 1000);
  };

    const downloadResume = async () => {
      if (!resumeRef.current) return;

      try {
        const element = resumeRef.current;
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 500));
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        pdf.save(`${formData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);

        // const canvas = await html2canvas(element, {
        //   scale: 2,
        //   useCORS: true,
        //   backgroundColor: "#ffffff",
        //   logging: false,
        //   letterRendering: true,
        // });

        // const imgData = canvas.toDataURL("image/png");
        // const pdf = new jsPDF({
        //   unit: "mm",
        //   format: "a4",
        //   orientation: "portrait",
        // });

        // const pageWidth = 210; // A4 width in mm
        // const pageHeight = 297;
        // const imgWidth = pageWidth;
        // const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // let position = 0;
        // pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        // // Handle multipage if resume is long
        // let heightLeft = imgHeight - pageHeight;
        // while (heightLeft > 0) {
        //   position = heightLeft - imgHeight;
        //   pdf.addPage();
        //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        //   heightLeft -= pageHeight;
        // }

        // pdf.save(`${formData.fullName.replace(/\s+/g, "_") || "My"}_Resume.pdf`);
        // const element = resumeRef.current;
        // const canvas = await html2canvas(element, { scale: 2 });
        // const imgData = canvas.toDataURL("image/png");
        // const pdf = new jsPDF();
        // pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        // pdf.save(`${formData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Error generating the PDF. Try again.");
      }
    };


  const renderTemplateSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Template</h2>
        <p className="text-gray-600">Select a template that best fits your industry and style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedTemplate(template.id);
              setCurrentStep(2);
            }}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 bg-white'
            }`}
          >
            <div className={`${template.preview} h-48 rounded-lg mb-4 flex items-center justify-center`}>
              <FileText className={`w-16 h-16 text-${template.color}-600`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-gray-600 text-sm">{template.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="San Francisco, CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Portfolio Website
            </label>
            <input
              type="url"
              value={formData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="johndoe.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of your professional background and career goals..."
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            disabled={!formData.fullName || !formData.email}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderExperienceAndSkills = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Experience & Skills</h2>
        <p className="text-gray-600">Add your professional background</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
            <button
              onClick={() => addArrayField('experience')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add More
            </button>
          </div>

          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Position Title"
                />
              </div>
              <input
                type="text"
                value={exp.duration}
                onChange={(e) => handleArrayFieldChange('experience', index, 'duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Duration (e.g., Jan 2020 - Present)"
              />
              <textarea
                value={exp.description}
                onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your key responsibilities and achievements..."
              />
              {formData.experience.length > 1 && (
                <button
                  onClick={() => removeArrayField('experience', index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
            <button
              onClick={() => addArrayField('education')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add More
            </button>
          </div>

          {formData.education.map((edu, index) => (
            <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleArrayFieldChange('education', index, 'school', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="School/University"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Degree/Major"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => handleArrayFieldChange('education', index, 'year', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Graduation Year"
                />
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => handleArrayFieldChange('education', index, 'gpa', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="GPA (optional)"
                />
              </div>
              {formData.education.length > 1 && (
                <button
                  onClick={() => removeArrayField('education', index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
            <button
              onClick={() => addArrayField('projects')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add More
            </button>
          </div>

          {formData.projects.map((project, index) => (
            <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Project Name"
                />
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Technologies Used (e.g., React, Node.js)"
                />
              </div>
              <input
                type="text"
                value={project.duration}
                onChange={(e) => handleArrayFieldChange('projects', index, 'duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Duration (e.g., Jan 2023 - Mar 2023)"
              />
              <textarea
                value={project.description}
                onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the project, your role, and key achievements..."
              />
              {formData.projects.length > 1 && (
                <button
                  onClick={() => removeArrayField('projects', index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills (comma-separated)
          </label>
          <textarea
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="JavaScript, React, Node.js, Python, SQL..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications (optional)
          </label>
          <textarea
            value={formData.certifications}
            onChange={(e) => handleInputChange('certifications', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="AWS Certified Developer, Google Analytics Certified..."
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(4)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderJobDescription = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Target Job Description</h2>
        <p className="text-gray-600">Help us tailor your resume to match the job requirements</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">AI-Powered Optimization</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Paste the full job description below. Our AI will analyze the requirements and optimize your resume to:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-blue-700">
                <li>• Highlight relevant skills and experiences</li>
                <li>• Match keywords for ATS systems</li>
                <li>• Emphasize achievements that align with the role</li>
                <li>• Improve your chances of getting an interview</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Job Description *
          </label>
          <textarea
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            rows={16}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Paste the complete job description here...

Example:
We are seeking a Senior Software Engineer to join our team...

Requirements:
- 5+ years of experience in software development
- Strong proficiency in JavaScript, React, and Node.js
- Experience with cloud platforms (AWS, Azure, or GCP)
..."
          />
          <p className="mt-2 text-sm text-gray-500">
            The more detailed the job description, the better we can optimize your resume
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setCurrentStep(3)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={generateResume}
            disabled={!formData.jobDescription.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Resume with AI</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderGeneratedResume = () => {
    const getTemplateComponent = () => {
      switch (selectedTemplate) {
        case 'professional':
          return <ProfessionalTemplate data={generatedResume} />;
        case 'modern':
          return <ModernTemplate data={generatedResume} />;
        case 'creative':
          return <CreativeTemplate data={generatedResume} />;
        case 'minimal':
          return <MinimalTemplate data={generatedResume} />;
        default:
          return <ProfessionalTemplate data={generatedResume} />;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Resume Generated!</h2>
          <p className="text-gray-600">
            Your AI-optimized resume is ready. Match score:
            <span className="text-green-600 font-bold ml-2">{generatedResume?.matchScore}%</span>
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">AI Optimization Applied</h4>
              <p className="text-sm text-blue-700">
                Your resume has been tailored to match the job description with keyword optimization and improved formatting.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-xl overflow-auto">
          <div ref={resumeRef} className="mx-auto" style={{ width: '210mm' }}>
            {getTemplateComponent()}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => {
              setCurrentStep(4);
              setGeneratedResume(null);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit Information
          </button>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setCurrentStep(1);
                setGeneratedResume(null);
                setSelectedTemplate('');
              }}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Create New Resume
            </button>
            <button
              onClick={downloadResume}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderLoadingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Resume...</h3>
      <p className="text-gray-600 text-center max-w-md">
        Our AI is analyzing the job description and optimizing your resume to maximize your chances of getting an interview
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume tailored to your target job in minutes
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  <span className={`ml-2 text-xs font-medium hidden lg:inline ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Template'}
                    {step === 2 && 'Personal'}
                    {step === 3 && 'Experience'}
                    {step === 4 && 'Job'}
                    {step === 5 && 'Preview'}
                  </span>
                </div>
                {step < 5 && (
                  <div
                    className={`w-8 h-1 rounded transition-all ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isGenerating ? (
            renderLoadingState()
          ) : (
            <>
              {currentStep === 1 && renderTemplateSelection()}
              {currentStep === 2 && renderPersonalInfo()}
              {currentStep === 3 && renderExperienceAndSkills()}
              {currentStep === 4 && renderJobDescription()}
              {currentStep === 5 && generatedResume && renderGeneratedResume()}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeGeneration;
