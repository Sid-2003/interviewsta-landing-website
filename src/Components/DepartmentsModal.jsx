import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  Info,
  Search,
} from "lucide-react";
import { useVideoInterview } from "../Contexts/VideoInterviewContext";

// Department data
const departments = [
  {
    id: 'defence-tech',
    name: 'SCHOOL OF DEFENCE TECHNOLOGY',
    branches: 'Aerospace, Directed Energy, Sensors, AI & Cyber',
    borderColor: 'from-red-500 to-orange-500',
    buckets: [
      { title: 'Physics Core (EM Waves, Radar, Optics, RF)', keywords: ['EM Waves', 'Radar', 'Optics', 'RF'], difficulty: 'Medium', duration: 45 },
      { title: 'Defence Systems & Weapon Technology', keywords: ['Defence Systems', 'Weapon Technology', 'Military Tech'], difficulty: 'Hard', duration: 45 },
      { title: 'Embedded & Control Systems', keywords: ['Embedded Systems', 'Control Systems', 'Microcontrollers'], difficulty: 'Medium', duration: 45 },
      { title: 'MATLAB & Simulink Modelling', keywords: ['MATLAB', 'Simulink', 'Modelling', 'Simulation'], difficulty: 'Medium', duration: 45 },
      { title: 'Python & C++', keywords: ['Python', 'C++', 'Programming'], difficulty: 'Easy', duration: 45 },
      { title: 'GATE Numerical Round', keywords: ['GATE', 'Numerical', 'Engineering'], difficulty: 'Hard', duration: 45 },
      { title: 'Mission Design Case Study', keywords: ['Mission Design', 'Case Study', 'Problem Solving'], difficulty: 'Hard', duration: 45 },
      { title: 'Security Clearance Interview', keywords: ['Security', 'Clearance', 'Background Check'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'cse',
    name: 'SCHOOL OF COMPUTER SCIENCE & ENGINEERING',
    branches: 'CSE, AI, DS, Cyber, Cloud, Full Stack, Gaming',
    borderColor: 'from-blue-500 to-indigo-500',
    buckets: [
      { title: 'Data Structures & Algorithms', keywords: ['DSA', 'Algorithms', 'Data Structures'], difficulty: 'Medium', duration: 45 },
      { title: 'OOPS, DBMS, OS, CN', keywords: ['OOPS', 'DBMS', 'Operating Systems', 'Computer Networks'], difficulty: 'Medium', duration: 45 },
      { title: 'System Design', keywords: ['System Design', 'Architecture', 'Scalability'], difficulty: 'Hard', duration: 45 },
      { title: 'Web Stack, Cloud & DevOps', keywords: ['Web Development', 'Cloud', 'DevOps', 'AWS'], difficulty: 'Medium', duration: 45 },
      { title: 'ML/DL Coding', keywords: ['Machine Learning', 'Deep Learning', 'AI'], difficulty: 'Hard', duration: 45 },
      { title: 'Cyber Security Labs', keywords: ['Cybersecurity', 'Security', 'Penetration Testing'], difficulty: 'Hard', duration: 45 },
      { title: 'Case Study (Real Company Problems)', keywords: ['Case Study', 'Problem Solving', 'Real World'], difficulty: 'Hard', duration: 45 },
      { title: 'Behavioural HR Round', keywords: ['HR', 'Behavioural', 'Soft Skills'], difficulty: 'Easy', duration: 45 },
    ]
  },
  {
    id: 'ece',
    name: 'SCHOOL OF ELECTRICAL, ELECTRONICS & COMMUNICATION',
    branches: 'ECE, VLSI, Embedded, EV, EEE',
    borderColor: 'from-yellow-500 to-amber-500',
    buckets: [
      { title: 'Digital & Analog Circuits', keywords: ['Digital Circuits', 'Analog Circuits', 'Electronics'], difficulty: 'Medium', duration: 45 },
      { title: 'Microprocessors & Microcontrollers', keywords: ['Microprocessors', 'Microcontrollers', '8051', 'ARM'], difficulty: 'Medium', duration: 45 },
      { title: 'VLSI Design & CMOS', keywords: ['VLSI', 'CMOS', 'IC Design', 'Semiconductors'], difficulty: 'Hard', duration: 45 },
      { title: 'MATLAB & Simulink', keywords: ['MATLAB', 'Simulink', 'Signal Processing'], difficulty: 'Medium', duration: 45 },
      { title: 'Control Systems', keywords: ['Control Systems', 'Feedback', 'PID'], difficulty: 'Medium', duration: 45 },
      { title: 'Power Electronics', keywords: ['Power Electronics', 'Converters', 'Inverters'], difficulty: 'Hard', duration: 45 },
      { title: 'PCB Design Interview', keywords: ['PCB Design', 'Layout', 'Circuit Design'], difficulty: 'Medium', duration: 45 },
      { title: 'Circuit Debugging (On Paper)', keywords: ['Circuit Debugging', 'Troubleshooting', 'Analysis'], difficulty: 'Hard', duration: 45 },
      { title: 'Embedded C Coding', keywords: ['Embedded C', 'C Programming', 'Firmware'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'mechanical',
    name: 'SCHOOL OF MECHANICAL, ROBOTICS & MECHATRONICS',
    branches: 'Mechanical, Robotics, Mechatronics',
    borderColor: 'from-green-500 to-emerald-500',
    buckets: [
      { title: 'Engineering Mechanics', keywords: ['Mechanics', 'Statics', 'Dynamics'], difficulty: 'Medium', duration: 45 },
      { title: 'Machine Design', keywords: ['Machine Design', 'CAD', 'Design Principles'], difficulty: 'Medium', duration: 45 },
      { title: 'Thermodynamics', keywords: ['Thermodynamics', 'Heat Transfer', 'Energy'], difficulty: 'Medium', duration: 45 },
      { title: 'Fluid Mechanics', keywords: ['Fluid Mechanics', 'Hydraulics', 'Aerodynamics'], difficulty: 'Hard', duration: 45 },
      { title: 'Robotics Kinematics', keywords: ['Robotics', 'Kinematics', 'Dynamics'], difficulty: 'Hard', duration: 45 },
      { title: 'CAD/CAM & SolidWorks', keywords: ['CAD', 'CAM', 'SolidWorks', '3D Modeling'], difficulty: 'Medium', duration: 45 },
      { title: 'Manufacturing & CNC', keywords: ['Manufacturing', 'CNC', 'Production'], difficulty: 'Medium', duration: 45 },
      { title: 'Automation PLC', keywords: ['PLC', 'Automation', 'Industrial Control'], difficulty: 'Medium', duration: 45 },
      { title: 'Group Discussion & Technical HR', keywords: ['Group Discussion', 'HR', 'Communication'], difficulty: 'Easy', duration: 45 },
    ]
  },
  {
    id: 'civil',
    name: 'SCHOOL OF CIVIL & SMART CITIES',
    branches: 'Civil, Smart Cities, GIS',
    borderColor: 'from-cyan-500 to-teal-500',
    buckets: [
      { title: 'Structural Design', keywords: ['Structural Design', 'RCC', 'Steel Design'], difficulty: 'Hard', duration: 45 },
      { title: 'Surveying & GIS', keywords: ['Surveying', 'GIS', 'Mapping'], difficulty: 'Medium', duration: 45 },
      { title: 'AutoCAD & STAAD', keywords: ['AutoCAD', 'STAAD', 'Structural Analysis'], difficulty: 'Medium', duration: 45 },
      { title: 'Construction Planning', keywords: ['Construction', 'Planning', 'Project Management'], difficulty: 'Medium', duration: 45 },
      { title: 'Soil Mechanics', keywords: ['Soil Mechanics', 'Geotechnical', 'Foundation'], difficulty: 'Hard', duration: 45 },
      { title: 'Real Project Case Study', keywords: ['Case Study', 'Real Projects', 'Problem Solving'], difficulty: 'Hard', duration: 45 },
      { title: 'Quantity Estimation', keywords: ['Quantity Estimation', 'Costing', 'BOQ'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'biosciences',
    name: 'SCHOOL OF BIOSCIENCES, BIOTECH & BIOMEDICAL',
    branches: 'Biotechnology, Biomedical, Life Sciences',
    borderColor: 'from-pink-500 to-rose-500',
    buckets: [
      { title: 'Molecular Biology', keywords: ['Molecular Biology', 'Genetics', 'DNA'], difficulty: 'Medium', duration: 45 },
      { title: 'Biochemistry', keywords: ['Biochemistry', 'Proteins', 'Enzymes'], difficulty: 'Medium', duration: 45 },
      { title: 'PCR / ELISA / Spectroscopy', keywords: ['PCR', 'ELISA', 'Spectroscopy', 'Lab Techniques'], difficulty: 'Medium', duration: 45 },
      { title: 'Laboratory Practicals', keywords: ['Lab Practicals', 'Experiments', 'Hands-on'], difficulty: 'Medium', duration: 45 },
      { title: 'Research Paper Presentation', keywords: ['Research', 'Paper Presentation', 'Academic'], difficulty: 'Hard', duration: 45 },
      { title: 'Drug & Medical Case Studies', keywords: ['Drug Development', 'Medical Cases', 'Pharmaceuticals'], difficulty: 'Hard', duration: 45 },
      { title: 'Ethics & Regulatory Interview', keywords: ['Ethics', 'Regulatory', 'Compliance'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'law',
    name: 'SCHOOL OF LAW',
    branches: 'Law',
    borderColor: 'from-purple-500 to-violet-500',
    buckets: [
      { title: 'Legal Reasoning', keywords: ['Legal Reasoning', 'Logic', 'Analysis'], difficulty: 'Medium', duration: 45 },
      { title: 'Constitutional Law', keywords: ['Constitutional Law', 'Constitution', 'Legal Framework'], difficulty: 'Hard', duration: 45 },
      { title: 'Case Laws Discussion', keywords: ['Case Laws', 'Precedents', 'Judicial'], difficulty: 'Hard', duration: 45 },
      { title: 'Legal Drafting Practical', keywords: ['Legal Drafting', 'Documentation', 'Writing'], difficulty: 'Medium', duration: 45 },
      { title: 'Debate Round', keywords: ['Debate', 'Argumentation', 'Public Speaking'], difficulty: 'Medium', duration: 45 },
      { title: 'Client Handling Simulation', keywords: ['Client Handling', 'Communication', 'Simulation'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'business',
    name: 'SCHOOL OF BUSINESS, MANAGEMENT & FINANCE',
    branches: 'BBA, MBA, Finance',
    borderColor: 'from-indigo-500 to-blue-500',
    buckets: [
      { title: 'Quantitative Aptitude', keywords: ['Quantitative', 'Math', 'Aptitude'], difficulty: 'Medium', duration: 45 },
      { title: 'Logical Reasoning', keywords: ['Logical Reasoning', 'Analytics', 'Problem Solving'], difficulty: 'Medium', duration: 45 },
      { title: 'IIM Style Case Study', keywords: ['IIM', 'Case Study', 'Business Analysis'], difficulty: 'Hard', duration: 45 },
      { title: 'Excel & Financial Modelling', keywords: ['Excel', 'Financial Modelling', 'Analysis'], difficulty: 'Medium', duration: 45 },
      { title: 'Marketing Roleplay', keywords: ['Marketing', 'Roleplay', 'Sales'], difficulty: 'Medium', duration: 45 },
      { title: 'Behavioural HR Interview', keywords: ['HR', 'Behavioural', 'Soft Skills'], difficulty: 'Easy', duration: 45 },
    ]
  },
  {
    id: 'design',
    name: 'SCHOOL OF DESIGN',
    branches: 'Product, Fashion, Interior, Graphic',
    borderColor: 'from-fuchsia-500 to-pink-500',
    buckets: [
      { title: 'Portfolio Review', keywords: ['Portfolio', 'Design Review', 'Creative Work'], difficulty: 'Medium', duration: 45 },
      { title: 'UI/UX Challenge', keywords: ['UI', 'UX', 'Design Challenge'], difficulty: 'Medium', duration: 45 },
      { title: 'Figma & Adobe Tools Test', keywords: ['Figma', 'Adobe', 'Design Tools'], difficulty: 'Medium', duration: 45 },
      { title: 'Live Design Task', keywords: ['Live Design', 'Creative Task', 'Real-time'], difficulty: 'Hard', duration: 45 },
      { title: 'Creativity Interview', keywords: ['Creativity', 'Innovation', 'Ideation'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'media',
    name: 'SCHOOL OF MEDIA & COMMUNICATION',
    branches: 'Journalism, Film, Media',
    borderColor: 'from-orange-500 to-red-500',
    buckets: [
      { title: 'Writing Test', keywords: ['Writing', 'Content', 'Journalism'], difficulty: 'Medium', duration: 45 },
      { title: 'Video Editing Practical', keywords: ['Video Editing', 'Post Production', 'Editing'], difficulty: 'Medium', duration: 45 },
      { title: 'News Analysis', keywords: ['News Analysis', 'Current Affairs', 'Media'], difficulty: 'Medium', duration: 45 },
      { title: 'Camera & Script Test', keywords: ['Camera', 'Script', 'Production'], difficulty: 'Medium', duration: 45 },
      { title: 'Live Reporting Simulation', keywords: ['Live Reporting', 'Broadcasting', 'Simulation'], difficulty: 'Hard', duration: 45 },
    ]
  },
  {
    id: 'health',
    name: 'SCHOOL OF ALLIED HEALTH, NURSING & PHARMACY',
    branches: 'Nursing, Pharmacy, Radiology',
    borderColor: 'from-emerald-500 to-green-500',
    buckets: [
      { title: 'Clinical Knowledge', keywords: ['Clinical', 'Medical Knowledge', 'Healthcare'], difficulty: 'Hard', duration: 45 },
      { title: 'Practical Simulation', keywords: ['Practical', 'Simulation', 'Hands-on'], difficulty: 'Medium', duration: 45 },
      { title: 'Drug Knowledge', keywords: ['Pharmacy', 'Drugs', 'Medications'], difficulty: 'Hard', duration: 45 },
      { title: 'Patient Handling Roleplay', keywords: ['Patient Handling', 'Roleplay', 'Communication'], difficulty: 'Medium', duration: 45 },
      { title: 'Medical Ethics Interview', keywords: ['Medical Ethics', 'Ethics', 'Professional Conduct'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'agriculture',
    name: 'SCHOOL OF AGRICULTURE',
    branches: 'Agriculture',
    borderColor: 'from-lime-500 to-green-500',
    buckets: [
      { title: 'Crop Science', keywords: ['Crop Science', 'Agriculture', 'Cultivation'], difficulty: 'Medium', duration: 45 },
      { title: 'Soil Fertility', keywords: ['Soil Fertility', 'Soil Science', 'Agriculture'], difficulty: 'Medium', duration: 45 },
      { title: 'Agricultural Economics', keywords: ['Agricultural Economics', 'Economics', 'Farming'], difficulty: 'Medium', duration: 45 },
      { title: 'Farm Equipment', keywords: ['Farm Equipment', 'Machinery', 'Agriculture Tech'], difficulty: 'Medium', duration: 45 },
      { title: 'Field Case Study', keywords: ['Field Case Study', 'Real World', 'Problem Solving'], difficulty: 'Hard', duration: 45 },
    ]
  },
  {
    id: 'basic-sciences',
    name: 'SCHOOL OF BASIC SCIENCES',
    branches: 'Mathematics, Physics, Chemistry',
    borderColor: 'from-slate-500 to-gray-500',
    buckets: [
      { title: 'Core Subject Numericals', keywords: ['Numericals', 'Problem Solving', 'Math/Physics'], difficulty: 'Medium', duration: 45 },
      { title: 'Laboratory Viva', keywords: ['Lab Viva', 'Practical', 'Experiments'], difficulty: 'Medium', duration: 45 },
      { title: 'Research Aptitude', keywords: ['Research', 'Aptitude', 'Academic'], difficulty: 'Hard', duration: 45 },
      { title: 'MATLAB & Python', keywords: ['MATLAB', 'Python', 'Programming'], difficulty: 'Medium', duration: 45 },
      { title: 'GATE-Style Technical Round', keywords: ['GATE', 'Technical', 'Engineering'], difficulty: 'Hard', duration: 45 },
    ]
  },
  {
    id: 'education',
    name: 'SCHOOL OF EDUCATION & HUMANITIES',
    branches: 'Education, Humanities',
    borderColor: 'from-amber-500 to-yellow-500',
    buckets: [
      { title: 'Teaching Demonstration', keywords: ['Teaching', 'Demonstration', 'Pedagogy'], difficulty: 'Medium', duration: 45 },
      { title: 'Psychology & Pedagogy', keywords: ['Psychology', 'Pedagogy', 'Education'], difficulty: 'Medium', duration: 45 },
      { title: 'Content Creation', keywords: ['Content Creation', 'Educational Content', 'Writing'], difficulty: 'Medium', duration: 45 },
      { title: 'Classroom Management', keywords: ['Classroom Management', 'Teaching', 'Education'], difficulty: 'Medium', duration: 45 },
    ]
  },
  {
    id: 'vocational',
    name: 'SCHOOL OF VOCATIONAL & POLYTECHNIC',
    branches: 'Vocational, Polytechnic',
    borderColor: 'from-stone-500 to-neutral-500',
    buckets: [
      { title: 'Skill Practical', keywords: ['Skills', 'Practical', 'Hands-on'], difficulty: 'Medium', duration: 45 },
      { title: 'Tool Handling', keywords: ['Tool Handling', 'Equipment', 'Technical Skills'], difficulty: 'Medium', duration: 45 },
      { title: 'Industrial Safety', keywords: ['Industrial Safety', 'Safety', 'Workplace'], difficulty: 'Medium', duration: 45 },
      { title: 'Production Line Simulation', keywords: ['Production', 'Simulation', 'Manufacturing'], difficulty: 'Hard', duration: 45 },
    ]
  },
];

const DepartmentsModal = ({ isOpen, onClose }) => {
  const [expandedDepartments, setExpandedDepartments] = useState(new Set([departments[0]?.id]));
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useVideoInterview();
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  // Auto-expand first department on open
  useEffect(() => {
    if (isOpen && departments[0]) {
      setExpandedDepartments(new Set([departments[0].id]));
    }
  }, [isOpen]);

  // Filter departments and buckets based on search
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) {
      return departments;
    }

    const query = searchQuery.toLowerCase();
    return departments
      .map(dept => {
        const matchingBuckets = dept.buckets.filter(bucket => {
          const titleMatch = bucket.title.toLowerCase().includes(query);
          const keywordMatch = bucket.keywords.some(kw => kw.toLowerCase().includes(query));
          const deptMatch = dept.name.toLowerCase().includes(query) || dept.branches.toLowerCase().includes(query);
          return titleMatch || keywordMatch || deptMatch;
        });

        if (matchingBuckets.length > 0 || dept.name.toLowerCase().includes(query) || dept.branches.toLowerCase().includes(query)) {
          return { ...dept, buckets: matchingBuckets.length > 0 ? matchingBuckets : dept.buckets };
        }
        return null;
      })
      .filter(Boolean);
  }, [searchQuery]);

  // Toggle department expansion
  const toggleDepartment = (departmentId) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  // Handle department bucket interview selection
  const handleDepartmentBucketSelect = (bucket, department) => {
    const mockInterview = {
      id: `dept-${department.id}-${bucket.title}`,
      title: bucket.title,
      category: 'department-wise',
      difficulty: bucket.difficulty,
      questions: 2,
      duration: bucket.duration,
      description: `${bucket.title} - Department oriented interview for ${department.name}`,
      topics: bucket.keywords,
      company: null,
      subject: null,
      interview_mode: 'Technical Interview',
      is_active: true,
      department: department.name,
    };

    // Store in localStorage for VideoInterview to pick up
    localStorage.setItem('selectedDepartmentInterview', JSON.stringify(mockInterview));
    
    // Navigate to video interview page
    navigate('/video-interview');
    onClose();
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Make background inert
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Tab trap
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, filteredDepartments]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Drawer */}
        <motion.div
          ref={modalRef}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="departments-modal-title"
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 id="departments-modal-title" className="text-2xl font-bold text-gray-900">
                  Department Oriented Interviews
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose your department to start AI curated interviews
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
                ref={firstFocusableRef}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments / interviews…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {filteredDepartments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No departments or interviews found matching your search.</p>
                </div>
              ) : (
                filteredDepartments.map((department) => {
                  const isExpanded = expandedDepartments.has(department.id);

                  return (
                    <motion.div
                      key={department.id}
                      initial={false}
                      className="bg-white rounded-xl shadow-sm border-2 border-gray-100 overflow-hidden"
                    >
                      {/* Department Header - Clickable */}
                      <div
                        onClick={() => toggleDepartment(department.id)}
                        className="relative cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                      >
                        {/* Glowing Left Border */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${department.borderColor} shadow-lg`}></div>

                        <div className="flex items-center justify-between">
                          <div className="flex-1 ml-4">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {department.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {department.branches}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {department.buckets.length} interviews
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-2">
                              <div className="grid md:grid-cols-2 gap-4">
                                {department.buckets.map((bucket, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-white rounded-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-4"
                                  >
                                    {/* Tooltip */}
                                    <div className="absolute top-2 right-2 group/tooltip">
                                      <Info className="h-4 w-4 text-blue-400 cursor-help hover:text-blue-600 transition-colors" />
                                      <div className="absolute right-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 z-20 whitespace-normal">
                                        AI curated department-level interview
                                        <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                      </div>
                                    </div>

                                    {/* Difficulty Pill */}
                                    <div className="flex items-center justify-between mb-3">
                                      <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                          bucket.difficulty === "Easy"
                                            ? "bg-green-100 text-green-800"
                                            : bucket.difficulty === "Medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {bucket.difficulty}
                                      </span>

                                      {/* Duration Badge */}
                                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{bucket.duration} min</span>
                                      </div>
                                    </div>

                                    {/* Bucket Title */}
                                    <h5 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2">
                                      {bucket.title}
                                    </h5>

                                    {/* Tag Chips */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                      {bucket.keywords.slice(0, 3).map((keyword, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                          {keyword}
                                        </span>
                                      ))}
                                      {bucket.keywords.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                          +{bucket.keywords.length - 3}
                                        </span>
                                      )}
                                    </div>

                                    {/* Start Interview Ghost Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDepartmentBucketSelect(bucket, department);
                                      }}
                                      className="w-full py-2 rounded-lg font-medium text-sm border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      ref={index === department.buckets.length - 1 ? lastFocusableRef : null}
                                    >
                                      <Play className="h-3.5 w-3.5" />
                                      <span>Start Interview</span>
                                    </button>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DepartmentsModal;

