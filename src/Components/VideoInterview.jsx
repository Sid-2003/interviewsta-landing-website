import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import PopupForm from "./PopupForm";
import SystemCheck from "./SystemCheck";
import TopicSelectionGrid from "./TopicSelectionGrid";
import CompanyPlaybookGrid from "./CompanyPlaybookGrid";
import {
  BookOpen,
  Play,
  Pause,
  Square,
  Mic,   
  MicOff,
  Camera,
  CameraOff,
  Settings,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle,
  Clock,
  Target,
  MessageSquare,
  Download,
  Copy,
  X,
  Upload,
  FileText,
  Briefcase,
  Users,
  Building,
  Code,
  Maximize2,
  Minimize2,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Sparkles,
  Info,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./VideoInterview/SearchBar";
import InterviewTypeCard from "./VideoInterview/InterviewTypeCard";
import TipsDrawer from "./VideoInterview/TipsDrawer";
import StickyActionBar from "./VideoInterview/StickyActionBar";

// Hardcoded fallback consulting topics — used when the API is unavailable
const CONSULTING_TOPICS = [
  { slug: "profitability",          name: "Profitability",          icon: "📉", color: "from-red-400 to-orange-500",    description: "Diagnose why profit has declined or identify levers to improve it.",                          frameworks: ["Revenue tree", "Cost tree"] },
  { slug: "market_entry",           name: "Market Entry",           icon: "🌍", color: "from-blue-400 to-cyan-500",     description: "Assess whether and how a client should enter a new market or geography.",                   frameworks: ["TAM/SAM/SOM", "Porter's 5 Forces"] },
  { slug: "growth_strategy",        name: "Growth Strategy",        icon: "📈", color: "from-green-400 to-emerald-500", description: "Identify levers to grow revenue or market share beyond the core business.",                 frameworks: ["Ansoff Matrix", "Segmentation"] },
  { slug: "mergers_acquisitions",   name: "M&A",                    icon: "🤝", color: "from-violet-400 to-purple-500", description: "Evaluate an acquisition's strategic rationale, valuation, and synergies.",                 frameworks: ["Synergy tree", "Due diligence"] },
  { slug: "pricing_strategy",       name: "Pricing Strategy",       icon: "💲", color: "from-yellow-400 to-amber-500",  description: "Design or fix a pricing model for a product or service.",                                  frameworks: ["Value-based", "Price-volume"] },
  { slug: "operations",             name: "Operations",             icon: "⚙️", color: "from-slate-400 to-gray-500",   description: "Reduce costs or improve throughput in a business process.",                                frameworks: ["Process mapping", "Bottleneck"] },
  { slug: "competitive_response",   name: "Competitive Response",   icon: "⚔️", color: "from-pink-400 to-rose-500",    description: "Respond to a competitor entering the market or disrupting pricing.",                       frameworks: ["Competitive map", "War-gaming"] },
  { slug: "digital_transformation", name: "Digital Transformation", icon: "💡", color: "from-indigo-400 to-blue-600",  description: "Build the case for or against a major technology investment.",                             frameworks: ["Build/buy/partner", "ROI/NPV"] },
];

// Hardcoded company playbooks — real Indian startup growth stories
const COMPANY_PLAYBOOKS = [
  { slug: "zomato",    name: "Zomato",    tagline: "From Menu to Home",              icon: "🍕", color: "from-red-500 to-orange-500",    era: "2015–2022", topic: "growth_strategy" },
  { slug: "cred",      name: "CRED",      tagline: "Pay Bills, Feel Rich",           icon: "💳", color: "from-slate-700 to-gray-900",    era: "2018–2023", topic: "market_entry" },
  { slug: "meesho",    name: "Meesho",    tagline: "WhatsApp + Shopping = Mind Blown", icon: "🛍️", color: "from-pink-500 to-rose-500",   era: "2019–2022", topic: "growth_strategy" },
  { slug: "dunzo",     name: "Dunzo",     tagline: "10 Minutes or It's Free",        icon: "⚡", color: "from-green-500 to-teal-500",    era: "2016–2022", topic: "operations" },
  { slug: "zepto",     name: "Zepto",     tagline: "Groceries Before You Blink",     icon: "🥦", color: "from-purple-500 to-violet-600", era: "2021–2023", topic: "operations" },
  { slug: "razorpay",  name: "Razorpay",  tagline: "Making Payments Boring Again",   icon: "💸", color: "from-blue-600 to-indigo-600",   era: "2014–2022", topic: "digital_transformation" },
  { slug: "ola",       name: "Ola",       tagline: "Honk Honk, We're Profitable",    icon: "🚕", color: "from-yellow-500 to-amber-500",  era: "2014–2020", topic: "competitive_response" },
  { slug: "byjus",     name: "BYJU'S",    tagline: "Learning is Fun (Allegedly)",    icon: "📖", color: "from-cyan-500 to-blue-500",     era: "2015–2022", topic: "growth_strategy" },
];


const VideoInterview = () => {
  const [showSystemTest, setShowSystemTest] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupData, setSetupData] = useState({});

  const [searchParams] = useSearchParams();
  const { state, dispatch } = useVideoInterview();
  
  // State for time slot interview parameters
  const [timeSlotInterview, setTimeSlotInterview] = useState(null);

  // Fetch consulting topics from Django API (with fallback to hardcoded list)
  useEffect(() => {
    import("../api/client").then(({ djangoClient }) => {
      djangoClient.get("/consulting-topics/")
        .then((res) => setConsultingTopics(res.data))
        .catch(() => {});
    }).catch(() => {});
  }, []);

  // Extract interview parameters from URL or localStorage
  useEffect(() => {
    const interviewType = searchParams.get('interviewType');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const timeSlotId = searchParams.get('timeSlotId');
    
    if (interviewType && category) {
      setTimeSlotInterview({
        interviewType,
        category,
        difficulty,
        timeSlotId,
      });
      
      // Also check localStorage for additional details
      const stored = localStorage.getItem('timeSlotInterview');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setTimeSlotInterview(prev => ({...prev, ...data}));
        } catch (e) {
          console.log('Could not parse stored interview data');
        }
      }
    }

    // Check for department interview selection
    const deptInterview = localStorage.getItem('selectedDepartmentInterview');
    if (deptInterview) {
      try {
        const interview = JSON.parse(deptInterview);
        setSelectedInterview(interview);
        localStorage.removeItem('selectedDepartmentInterview');
      } catch (e) {
        console.log('Could not parse department interview data');
      }
    }
  }, [searchParams]);
  
  // Modal states for interview end scenarios
  const [showInterviewEndedModal, setShowInterviewEndedModal] = useState(false);
  const [interviewEndModalType, setInterviewEndModalType] = useState(null); // 'noConversation', 'offensive', or 'systemEnded'

  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  

  const tests = [
  {
    "id": 3,
    "title": "Netflix",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Netflix SDE-I technical questions focusing on streaming systems, scalability, and distributed computing patterns used in production.",
    "topics": ["System Design", "Microservices", "Caching Strategies"],
    "company": "Netflix",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 4,
    "title": "Amazon",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Amazon SDE-I coding challenges emphasizing scalability, AWS services, and leadership principles with real-world e-commerce scenarios.",
    "topics": ["Algorithm Optimization", "Data Structures", "System Scalability"],
    "company": "Amazon",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 5,
    "title": "Google",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Google L3/L4 interview questions testing algorithmic thinking, complex problem-solving, and code optimization at massive scale.",
    "topics": ["Advanced Algorithms", "Time Complexity", "Graph Theory"],
    "company": "Google",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 6,
    "title": "Apple",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 60,
    "description": "Apple ICT3/ICT4 technical assessment focusing on performance optimization, memory management, and elegant code design.",
    "topics": ["Object-Oriented Design", "Performance Tuning", "API Design"],
    "company": "Apple",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 7,
    "title": "TCS",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "TCS technical interview focusing on programming fundamentals, data structures, algorithms, and problem-solving skills commonly asked in TCS campus recruitment and lateral hiring.",
    "topics": ["Programming Fundamentals", "Data Structures", "Problem Solving", "Aptitude"],
    "company": "TCS",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 8,
    "title": "Wipro",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Wipro technical assessment covering core programming concepts, logical reasoning, and coding problems typically asked in Wipro placement interviews.",
    "topics": ["Core Programming", "Logical Reasoning", "Coding Problems", "System Design Basics"],
    "company": "Wipro",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 9,
    "title": "Accenture",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Accenture technical interview emphasizing practical coding skills, problem-solving approach, and understanding of software development lifecycle.",
    "topics": ["Practical Coding", "Problem Solving", "SDLC", "Database Concepts"],
    "company": "Accenture",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 10,
    "title": "Infosys",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Infosys technical interview covering programming fundamentals, data structures, algorithms, and system design concepts asked in Infosys campus and lateral interviews.",
    "topics": ["Programming Fundamentals", "Data Structures", "Algorithms", "System Design"],
    "company": "Infosys",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 11,
    "title": "Microsoft",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Microsoft SDE technical interview focusing on algorithms, data structures, system design, and problem-solving at scale with emphasis on clean code and optimization.",
    "topics": ["Algorithms", "Data Structures", "System Design", "Code Optimization"],
    "company": "Microsoft",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  // Additional FAANG/MAANG tier companies
  {
    "id": 12,
    "title": "IBM",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "IBM technical interview focusing on enterprise software, cloud computing, AI/ML systems, and distributed systems architecture.",
    "topics": ["Enterprise Software", "Cloud Computing", "AI/ML", "Distributed Systems"],
    "company": "IBM",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 13,
    "title": "Intel",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Intel technical interview emphasizing low-level systems programming, performance optimization, hardware-software interaction, and parallel computing.",
    "topics": ["Systems Programming", "Performance Optimization", "Parallel Computing", "Hardware-Software"],
    "company": "Intel",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 14,
    "title": "SAP",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "SAP technical interview focusing on enterprise software development, database systems, business logic, and enterprise architecture patterns.",
    "topics": ["Enterprise Software", "Database Systems", "Business Logic", "Enterprise Architecture"],
    "company": "SAP",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 15,
    "title": "Oracle",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Oracle technical interview emphasizing database systems, cloud infrastructure, enterprise solutions, and high-performance computing.",
    "topics": ["Database Systems", "Cloud Infrastructure", "Enterprise Solutions", "High Performance"],
    "company": "Oracle",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 16,
    "title": "Salesforce",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Salesforce technical interview focusing on cloud platform development, SaaS architecture, API design, and scalable multi-tenant systems.",
    "topics": ["Cloud Platform", "SaaS Architecture", "API Design", "Multi-tenant Systems"],
    "company": "Salesforce",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  // Additional Mass Hiring/Service Companies
  {
    "id": 17,
    "title": "Capgemini",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Capgemini technical interview covering programming fundamentals, software engineering practices, and problem-solving skills for consulting and IT services.",
    "topics": ["Programming Fundamentals", "Software Engineering", "Problem Solving", "IT Services"],
    "company": "Capgemini",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 18,
    "title": "Cognizant",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Cognizant technical assessment focusing on core programming, data structures, algorithms, and software development lifecycle practices.",
    "topics": ["Core Programming", "Data Structures", "Algorithms", "SDLC"],
    "company": "Cognizant",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 19,
    "title": "Deloitte",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Deloitte technical interview emphasizing problem-solving, analytical thinking, software development practices, and consulting-oriented technical skills.",
    "topics": ["Problem Solving", "Analytical Thinking", "Software Development", "Consulting Skills"],
    "company": "Deloitte",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 20,
    "title": "EY",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "EY technical interview focusing on programming fundamentals, logical reasoning, problem-solving, and technology consulting skills.",
    "topics": ["Programming Fundamentals", "Logical Reasoning", "Problem Solving", "Tech Consulting"],
    "company": "EY",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 21,
    "title": "KPMG",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "KPMG technical assessment covering core programming concepts, data structures, algorithms, and analytical problem-solving for technology consulting.",
    "topics": ["Core Programming", "Data Structures", "Algorithms", "Analytical Problem Solving"],
    "company": "KPMG",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 22,
    "title": "PwC",
    "category": "company-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "PwC technical interview emphasizing programming fundamentals, logical reasoning, problem-solving approach, and technology consulting capabilities.",
    "topics": ["Programming Fundamentals", "Logical Reasoning", "Problem Solving", "Tech Consulting"],
    "company": "PwC",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  // Product-based/Startup Companies
  {
    "id": 23,
    "title": "Flipkart",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Flipkart technical interview focusing on e-commerce systems, recommendation engines, scalable architecture, and real-world product engineering challenges.",
    "topics": ["E-commerce Systems", "Recommendation Engines", "Scalable Architecture", "Product Engineering"],
    "company": "Flipkart",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 24,
    "title": "Zomato",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Zomato technical interview emphasizing food delivery systems, location-based services, real-time matching algorithms, and product engineering at scale.",
    "topics": ["Food Delivery Systems", "Location Services", "Real-time Algorithms", "Product Engineering"],
    "company": "Zomato",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 25,
    "title": "Swiggy",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Swiggy technical interview focusing on delivery optimization, route planning algorithms, real-time order matching, and scalable food delivery platform engineering.",
    "topics": ["Delivery Optimization", "Route Planning", "Real-time Matching", "Platform Engineering"],
    "company": "Swiggy",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 26,
    "title": "Paytm",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Paytm technical interview emphasizing payment systems, transaction security, financial technology, and high-availability fintech platform development.",
    "topics": ["Payment Systems", "Transaction Security", "FinTech", "High Availability"],
    "company": "Paytm",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 27,
    "title": "Byju's",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Byju's technical interview focusing on educational technology, personalized learning systems, content delivery platforms, and EdTech product engineering.",
    "topics": ["EdTech", "Personalized Learning", "Content Delivery", "Product Engineering"],
    "company": "Byju's",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 28,
    "title": "PhonePe",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "PhonePe technical interview emphasizing digital payments, UPI systems, financial security, and scalable fintech platform architecture.",
    "topics": ["Digital Payments", "UPI Systems", "Financial Security", "Fintech Architecture"],
    "company": "PhonePe",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 29,
    "title": "Ola",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Ola technical interview focusing on ride-sharing systems, dynamic pricing algorithms, real-time matching, and transportation platform engineering.",
    "topics": ["Ride-sharing Systems", "Dynamic Pricing", "Real-time Matching", "Transportation Platform"],
    "company": "Ola",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 30,
    "title": "Uber",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Uber technical interview emphasizing ride-sharing algorithms, surge pricing, location services, and large-scale transportation platform engineering.",
    "topics": ["Ride-sharing Algorithms", "Surge Pricing", "Location Services", "Platform Engineering"],
    "company": "Uber",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 31,
    "title": "LinkedIn",
    "category": "company-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "LinkedIn technical interview focusing on professional networking platforms, feed algorithms, recommendation systems, and social network engineering at scale.",
    "topics": ["Professional Networks", "Feed Algorithms", "Recommendation Systems", "Social Network Engineering"],
    "company": "LinkedIn",
    "subject": null,
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 50,
    "title": "Graphs - 1",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Master fundamental graph algorithms including BFS, DFS, and basic traversal techniques for connected components and shortest paths.",
    "topics": ["BFS/DFS", "Graph Traversal", "Connected Components"],
    "company": null,
    "subject": "Graph",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 51,
    "title": "Graphs - 2",
    "category": "subject-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Advanced graph problems covering shortest path algorithms, topological sorting, and minimum spanning trees for complex network scenarios.",
    "topics": ["Dijkstra's Algorithm", "Topological Sort", "MST"],
    "company": null,
    "subject": "Graph",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 52,
    "title": "Arrays - 1",
    "category": "subject-wise",
    "difficulty": "Easy",
    "questions": 2,
    "duration": 30,
    "description": "Build strong array fundamentals with basic operations, two-pointer techniques, and simple manipulation patterns for beginners.",
    "topics": ["Array Manipulation", "Two Pointers", "Linear Search"],
    "company": null,
    "subject": "Array",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 53,
    "title": "Arrays - 2",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Intermediate array problems featuring sliding window, prefix sums, and efficient subarray techniques for optimized solutions.",
    "topics": ["Sliding Window", "Prefix Sum", "Kadane's Algorithm"],
    "company": null,
    "subject": "Array",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 54,
    "title": "Arrays - 3",
    "category": "subject-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Complex array challenges requiring advanced patterns like merge intervals, matrix manipulation, and multi-dimensional optimization.",
    "topics": ["Merge Intervals", "Matrix Problems", "Advanced Sorting"],
    "company": null,
    "subject": "Array",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 55,
    "title": "Strings - 1",
    "category": "subject-wise",
    "difficulty": "Easy",
    "questions": 2,
    "duration": 30,
    "description": "Foundational string manipulation covering reversals, palindrome checks, and basic pattern matching for coding interview preparation.",
    "topics": ["String Reversal", "Palindromes", "Character Counting"],
    "company": null,
    "subject": "String",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 56,
    "title": "Strings - 2",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Intermediate string algorithms including substring search, string matching patterns, and efficient text processing techniques.",
    "topics": ["KMP Algorithm", "Substring Search", "Anagrams"],
    "company": null,
    "subject": "String",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 57,
    "title": "Strings - 3",
    "category": "subject-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Advanced string problems featuring regex patterns, longest common subsequence, and dynamic programming-based text algorithms.",
    "topics": ["Pattern Matching", "LCS/LIS", "String DP"],
    "company": null,
    "subject": "String",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 58,
    "title": "Dynamic Programming - 1",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Introduction to DP concepts with classic problems like Fibonacci, coin change, and basic memoization strategies for optimization.",
    "topics": ["Memoization", "Tabulation", "Classic DP"],
    "company": null,
    "subject": "Dynamic Programming",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 59,
    "title": "Dynamic Programming - 2",
    "category": "subject-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Advanced DP patterns including knapsack variations, sequence alignment, and multi-dimensional state optimization for complex scenarios.",
    "topics": ["Knapsack Variants", "State Optimization", "2D/3D DP"],
    "company": null,
    "subject": "Dynamic Programming",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 60,
    "title": "Trees - 1",
    "category": "subject-wise",
    "difficulty": "Easy",
    "questions": 2,
    "duration": 30,
    "description": "Binary tree fundamentals covering basic traversals, tree height calculations, and simple recursive patterns for tree manipulation.",
    "topics": ["Tree Traversals", "Recursion Basics", "Tree Height"],
    "company": null,
    "subject": "Tree",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 61,
    "title": "Trees - 2",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Intermediate tree problems including BST operations, level-order traversal, and path-finding algorithms in binary trees.",
    "topics": ["BST Operations", "Level Order", "Path Sum"],
    "company": null,
    "subject": "Tree",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 62,
    "title": "Trees - 3",
    "category": "subject-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Complex tree challenges featuring tree serialization, LCA problems, and advanced BST operations for expert-level preparation.",
    "topics": ["Tree Serialization", "Lowest Common Ancestor", "AVL Trees"],
    "company": null,
    "subject": "Tree",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 63,
    "title": "Linked Lists - 1",
    "category": "subject-wise",
    "difficulty": "Easy",
    "questions": 2,
    "duration": 30,
    "description": "Master linked list basics with insertion, deletion, and reversal operations essential for data structure interviews.",
    "topics": ["List Traversal", "Insertion/Deletion", "Reversal"],
    "company": null,
    "subject": "Linked List",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 64,
    "title": "Linked Lists - 2",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Intermediate linked list problems including cycle detection, merge operations, and two-pointer techniques for optimal solutions.",
    "topics": ["Cycle Detection", "Merge Lists", "Fast/Slow Pointers"],
    "company": null,
    "subject": "Linked List",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 65,
    "title": "Stacks & Queues - 1",
    "category": "subject-wise",
    "difficulty": "Easy",
    "questions": 2,
    "duration": 30,
    "description": "Learn stack and queue fundamentals with basic operations, balanced parentheses, and simple LIFO/FIFO pattern applications.",
    "topics": ["Stack Operations", "Queue Basics", "Parentheses Matching"],
    "company": null,
    "subject": "Stack & Queue",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 66,
    "title": "Stacks & Queues - 2",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Advanced stack/queue patterns including monotonic stacks, priority queues, and expression evaluation for interview success.",
    "topics": ["Monotonic Stack", "Priority Queue", "Expression Parsing"],
    "company": null,
    "subject": "Stack & Queue",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 67,
    "title": "Heaps - 1",
    "category": "subject-wise",
    "difficulty": "Medium",
    "questions": 2,
    "duration": 45,
    "description": "Heap data structure fundamentals covering min/max heaps, heapify operations, and k-largest/smallest element problems.",
    "topics": ["Min/Max Heap", "Heapify", "Top K Elements"],
    "company": null,
    "subject": "Heap",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    "id": 68,
    "title": "Heaps - 2",
    "category": "subject-wise",
    "difficulty": "Hard",
    "questions": 2,
    "duration": 60,
    "description": "Advanced heap applications including median finding, merge k sorted arrays, and efficient priority-based scheduling algorithms.",
    "topics": ["Median Finding", "Merge K Lists", "Scheduling"],
    "company": null,
    "subject": "Heap",
    "interview_mode": "Coding Interview",
    "is_active": true
  },
  {
    id: 38,
    title: "Maths 1",
    category: "topic-wise",
    difficulty: "Medium",
    questions: 2,
    duration: 45,
    description: "Covers calculus, limits, and basic differential equations.",
    topics: ["Limits", "Derivatives", "Integrals"],
    company: null,
    subject: "Maths1",
    interview_mode: "Technical Interview",
    is_active: true,
  },
  {
    id: 39,
    title: "Engineering Materials",
    category: "topic-wise",
    difficulty: "Medium",
    questions: 2,
    duration: 45,
    description: "Properties of materials, failure modes and selection criteria.",
    topics: ["Metals", "Polymers", "Failure Analysis"],
    company: null,
    subject: "Engineering Materials",
    interview_mode: "Technical Interview",
    is_active: true,
  },
  {
  id: 40,
  title: "Maths 2",
  category: "topic-wise",
  difficulty: "Medium",
  questions: 2,
  duration: 45,
  description: "Covers advanced calculus, differential equations, and complex numbers.",
  topics: ["Differential Equations", "Complex Numbers", "Series"],
  company: null,
  subject: "Maths2",
  interview_mode: "Technical Interview",
  is_active: true,
},
{
  id: 41,
  title: "Engineering Chemistry",
  category: "topic-wise",
  difficulty: "Medium",
  questions: 2,
  duration: 45,
  description: "Focuses on chemical bonding, corrosion, polymers, and water treatment relevant to engineering.",
  topics: ["Chemical Bonding", "Corrosion", "Polymers"],
  company: null,
  subject: "Engineering Chemistry",
  interview_mode: "Technical Interview",
  is_active: true,
},
{
  id: 42,
  title: "Engineering Physics",
  category: "topic-wise",
  difficulty: "Medium",
  questions: 2,
  duration: 45,
  description: "Includes engineering applications of optics, waves, and modern physics concepts.",
  topics: ["Optics", "Waves", "Modern Physics"],
  company: null,
  subject: "Engineering Physics",
  interview_mode: "Technical Interview",
  is_active: true,
},
{
  id: 43,
  title: "Manufacturing Processes",
  category: "topic-wise",
  difficulty: "Medium",
  questions: 2,
  duration: 45,
  description: "Covers metal casting, machining, forming, and joining processes used in manufacturing.",
  topics: ["Casting", "Machining", "Forming"],
  company: null,
  subject: "Manufacturing Processes",
  interview_mode: "Technical Interview",
  is_active: true,
},
{
  id: 44,
  title: "Operating Systems",
  category: "topic-wise",
  difficulty: "Medium",
  questions: 2,
  duration: 45,
  description: "Tests understanding of OS concepts like processes, scheduling, memory, and synchronization.",
  topics: ["Processes", "Scheduling", "Memory Management"],
  company: null,
  subject: "Operating Systems",
  interview_mode: "Technical Interview",
  is_active: true,
},
{
  id: 45,
  title: "Database Management Systems",
  category: "topic-wise",
  difficulty: "Medium",
  questions: 2,
  duration: 45,
  description: "Focuses on relational databases, SQL, normalization, and transaction management.",
  topics: ["SQL", "Normalization", "Transactions"],
  company: null,
  subject: "DBMS",
  interview_mode: "Technical Interview",
  is_active: true,
},
{
  id: 46,
  title: "Microprocessors",
  category: "topic-wise",
  difficulty: "Medium",
  questions: 2,
  duration: 45,
  description: "Covers microprocessor architecture, instruction sets, and interfacing basics.",
  topics: ["Architecture", "Instruction Set", "Interfacing"],
  company: null,
  subject: "Microprocessors",
  interview_mode: "Technical Interview",
  is_active: true,
},
// Role-based interviews
{
  id: 30,
  title: "Frontend Development",
  category: "role-wise",
  difficulty: "Medium",
  questions: null,
  duration: 45,
  description: "Comprehensive frontend development interview covering HTML, CSS, JavaScript, React, and modern web development practices.",
  topics: ["HTML/CSS", "JavaScript", "React/Vue/Angular", "State Management", "Performance Optimization"],
  company: null,
  subject: null,
  interview_mode: "Role-Based Interview",
  role: "Frontend Development",
  is_active: true
},
{
  id: 31,
  title: "Backend Development",
  category: "role-wise",
  difficulty: "Medium",
  questions: null,
  duration: 45,
  description: "Backend development interview focusing on server-side programming, APIs, databases, and system design.",
  topics: ["APIs", "Databases", "Authentication", "Caching", "Microservices"],
  company: null,
  subject: null,
  interview_mode: "Role-Based Interview",
  role: "Backend Development",
  is_active: true
},
{
  id: 32,
  title: "UI/UX Design",
  category: "role-wise",
  difficulty: "Medium",
  questions: null,
  duration: 40,
  description: "UI/UX design interview assessing design principles, user research, prototyping, and design thinking.",
  topics: ["Design Principles", "User Research", "Prototyping", "Accessibility", "Design Systems"],
  company: null,
  subject: null,
  interview_mode: "Role-Based Interview",
  role: "UI/UX Design",
  is_active: true
},
{
  id: 33,
  title: "AI/ML",
  category: "role-wise",
  difficulty: "Hard",
  questions: null,
  duration: 50,
  description: "AI/ML interview covering machine learning fundamentals, deep learning, model evaluation, and practical ML applications.",
  topics: ["Machine Learning", "Deep Learning", "Model Evaluation", "NLP", "Computer Vision"],
  company: null,
  subject: null,
  interview_mode: "Role-Based Interview",
  role: "AI/ML",
  is_active: true
},
{
  id: 34,
  title: "Data Science",
  category: "role-wise",
  difficulty: "Medium",
  questions: null,
  duration: 45,
  description: "Data science interview focusing on statistics, data analysis, visualization, and data-driven decision making.",
  topics: ["Statistics", "Data Analysis", "SQL", "Data Visualization", "A/B Testing"],
  company: null,
  subject: null,
  interview_mode: "Role-Based Interview",
  role: "Data Science",
  is_active: true
}

  ];

  const categories = [
    { id: "all", label: "All Categories", count: tests.length },
    { id: "company-wise", label: "Company Wise", count: tests.filter(p => p.category === 'company-wise').length },
    { id: "subject-wise", label: "DSA subjects", count: tests.filter(p => p.category === 'subject-wise').length },
    // { id: "job-wise", label: "Domains", count: tests.filter(p => p.category === 'job-wise').length }, // Hidden as requested
    { id: "role-wise", label: "Role-Based", count: tests.filter(p => p.category === 'role-wise').length },
    // { id: "language-wise", label: "Language-Wise", count: tests.filter(p => p.category === 'language-wise').length },
    { id: "topic-wise", label: "Subjects", count: tests.filter(p => p.category === 'topic-wise').length },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterviewType, setSelectedInterviewType] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [showSpecialisedModal, setShowSpecialisedModal] = useState(false);
  const [showTopicStep, setShowTopicStep] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [consultingTopics, setConsultingTopics] = useState([]);
  const [showCompanyStep, setShowCompanyStep] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const difficulties = [
    { id: "all", label: "All Levels" },
    { id: "Easy", label: "Easy" },
    { id: "Medium", label: "Medium" },
    { id: "Hard", label: "Hard" },
  ];

  // Search and filter logic
  const filteredTests = useMemo(() => {
    // Start with all active tests
    let filtered = tests.filter((test) => test.is_active !== false);

    // CRITICAL: Filter by category - only include tests that match the selected category exactly
    if (selectedCategory !== "all") {
      const wantCategory = String(selectedCategory).trim();
      filtered = filtered.filter((test) => {
        const cat = test.category != null ? String(test.category).trim() : '';
        return cat === wantCategory;
      });
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((test) => test.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((test) => {
        const titleMatch = test.title?.toLowerCase().includes(query);
        const companyMatch = test.company?.toLowerCase().includes(query);
        const subjectMatch = test.subject?.toLowerCase().includes(query);
        const descriptionMatch = test.description?.toLowerCase().includes(query);
        const topicsMatch = test.topics?.some(topic => topic.toLowerCase().includes(query));
        return titleMatch || companyMatch || subjectMatch || descriptionMatch || topicsMatch;
      });
    }

    // Sort: When "All Categories" is selected, show company-wise first then subject-wise (DSA)
    if (selectedCategory === "all") {
      filtered = [...filtered].sort((a, b) => {
        const catOrder = { 'company-wise': 0, 'subject-wise': 1, 'role-wise': 2, 'topic-wise': 3 };
        const orderA = catOrder[a.category] ?? 4;
        const orderB = catOrder[b.category] ?? 4;
        if (orderA !== orderB) return orderA - orderB;
        return (a.title || '').localeCompare(b.title || '');
      });
    } else {
      // When a specific category is selected, sort by title for consistent order
      filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return filtered;
  }, [selectedCategory, selectedDifficulty, searchQuery, tests]);

  
  
  const interviewTypes = [
    {
    "id": 26,
    "title": "Technical Interview",
    "category": "interview-type",
    "difficulty": "Medium",
    "questions": null,
    "duration": 45,
    "description": "In-depth technical skills assessment covering algorithms, data structures, and problem-solving with live coding challenges and system design discussions.",
    "topics": ["Coding Problems", "Algorithm Design", "Code Optimization"],
    "company": null,
    "subject": null,
    "interview_mode": "Technical Interview",
    "is_active": true
  },
  {
    "id": 2,
    "title": "Behavioral Interview",
    "category": "interview-type",
    "difficulty": "Easy",
    "questions": null,
    "duration": 30,
    "description": "Behavioral assessment focusing on soft skills, cultural fit, communication abilities, career motivations, and alignment with company values.",
    "topics": ["Behavioral Questions", "Cultural Fit", "Career Goals"],
    "company": null,
    "subject": null,
    "interview_mode": "HR Interview",
    "is_active": true
  },
  {
    "id": 28,
    "title": "Specialised Interview",
    "category": "hobby-type",
    "difficulty": "Easy",
    "duration": 15,
    "description": "Practice expressing yourself through natural conversation about your hobbies and interests in a relaxed, supportive environment.",
    "topics": ["Public Speaking", "Debate", "Photography", "Music", "Sports", "Content Creation"],
    "interview_mode": "Hobby Interview",
    "is_active": true
  },
  // Communication Interview – commented out for now
  // {
  //   "id": 29,
  //   "title": "Communication Interview",
  //   "category": "interview-type",
  //   "difficulty": "Medium",
  //   "questions": null,
  //   "duration": 30,
  //   "description": "Assess your communication skills through speaking exercises, writing comprehension, and vocabulary tests in a structured interview format.",
  //   "topics": ["Speaking", "Writing Comprehension", "Vocabulary", "Personal Details"],
  //   "company": null,
  //   "subject": null,
  //   "interview_mode": "Communication Interview",
  //   "is_active": true
  // }
  ];

  // Role-based interviews
  const roleBasedInterviews = [
    {
      "id": 30,
      "title": "Frontend Development",
      "category": "role-wise",
      "difficulty": "Medium",
      "questions": null,
      "duration": 45,
      "description": "Comprehensive frontend development interview covering HTML, CSS, JavaScript, React, and modern web development practices.",
      "topics": ["HTML/CSS", "JavaScript", "React/Vue/Angular", "State Management", "Performance Optimization"],
      "company": null,
      "subject": null,
      "interview_mode": "Role-Based Interview",
      "role": "Frontend Development",
      "is_active": true
    },
    {
      "id": 31,
      "title": "Backend Development",
      "category": "role-wise",
      "difficulty": "Medium",
      "questions": null,
      "duration": 45,
      "description": "Backend development interview focusing on server-side programming, APIs, databases, and system design.",
      "topics": ["APIs", "Databases", "Authentication", "Caching", "Microservices"],
      "company": null,
      "subject": null,
      "interview_mode": "Role-Based Interview",
      "role": "Backend Development",
      "is_active": true
    },
    {
      "id": 32,
      "title": "UI/UX Design",
      "category": "role-wise",
      "difficulty": "Medium",
      "questions": null,
      "duration": 40,
      "description": "UI/UX design interview assessing design principles, user research, prototyping, and design thinking.",
      "topics": ["Design Principles", "User Research", "Prototyping", "Accessibility", "Design Systems"],
      "company": null,
      "subject": null,
      "interview_mode": "Role-Based Interview",
      "role": "UI/UX Design",
      "is_active": true
    },
    {
      "id": 33,
      "title": "AI/ML",
      "category": "role-wise",
      "difficulty": "Hard",
      "questions": null,
      "duration": 50,
      "description": "AI/ML interview covering machine learning fundamentals, deep learning, model evaluation, and practical ML applications.",
      "topics": ["Machine Learning", "Deep Learning", "Model Evaluation", "NLP", "Computer Vision"],
      "company": null,
      "subject": null,
      "interview_mode": "Role-Based Interview",
      "role": "AI/ML",
      "is_active": true
    },
    {
      "id": 34,
      "title": "Data Science",
      "category": "role-wise",
      "difficulty": "Medium",
      "questions": null,
      "duration": 45,
      "description": "Data science interview focusing on statistics, data analysis, visualization, and data-driven decision making.",
      "topics": ["Statistics", "Data Analysis", "SQL", "Data Visualization", "A/B Testing"],
      "company": null,
      "subject": null,
      "interview_mode": "Role-Based Interview",
      "role": "Data Science",
      "is_active": true
    }
  ];

  // Hobby data - completely separate from interview types
  const hobbies = [
    {
      id: 'case-study',
      name: 'Case Study',
      test_id: 27,
      description: 'Analyze real-world scenarios and develop your problem-solving and analytical thinking skills'
    },
    {
      id: 'company-playbook',
      name: 'Real Company Playbooks',
      test_id: 27,
      description: 'Solve the actual growth problems that made Indian startups famous — Zomato, CRED, Meesho & more'
    },
    {
      id: 'public-speaking',
      name: 'Public Speaking',
      description: 'Build confidence and improve your speaking skills through structured practice sessions'
    },
    {
      id: 'debate',
      name: 'Debate',
      test_id: 29,
      description: 'Sharpen your argumentation skills and learn to present compelling cases'
    },
    {
      id: 'photography',
      name: 'Photography',
      description: 'Express your creative vision and discuss the art of capturing moments'
    },
    {
      id: 'music',
      name: 'Music',
      description: 'Share your passion for music and explore how it influences your life'
    },
    {
      id: 'content-creation',
      name: 'Content Creation',
      description: 'Talk about your creative process and the impact you want to make'
    }
  ];

  // Handle hobby selection - Case Study and Debate use same flow as Technical/HR
const handleHobbySelect = (hobby) => {
  if (hobby.id === 'case-study') {
    // Show topic selection step inside the modal instead of going straight to SystemCheck
    setShowTopicStep(true);
    return;
  }
  if (hobby.id === 'company-playbook') {
    // Show company selection step inside the modal
    setShowCompanyStep(true);
    return;
  }
  if (hobby.id === 'debate') {
    dispatch({ type: "NoResume" });
    dispatch({ type: "Reset" });
    dispatch({ type: "Set", payload: "Debate Interview" });
    dispatch({ type: "Debate", payload: { interview_type_id: hobby.test_id } });
    setShowSpecialisedModal(false);
    setShowSystemTest(true);
  }
};

const handleCompanySelect = (companySlug) => {
  const company = COMPANY_PLAYBOOKS.find((c) => c.slug === companySlug) || null;
  setSelectedCompany(company);
  dispatch({ type: "NoResume" });
  dispatch({ type: "Reset" });
  dispatch({ type: "Set", payload: "Case Study Interview" });
  dispatch({ type: "CaseStudy", payload: {
    interview_type_id: 27,
    topic_slug: company ? company.topic : "",
    company_slug: companySlug,
  }});
  setShowCompanyStep(false);
  setShowSpecialisedModal(false);
  setShowSystemTest(true);
};

const handleCompanyStepBack = () => {
  setShowCompanyStep(false);
  setSelectedCompany(null);
};

const handleTopicSelect = (topicSlug) => {
  const topic = (consultingTopics.length > 0 ? consultingTopics : CONSULTING_TOPICS)
    .find((t) => t.slug === topicSlug) || null;
  setSelectedTopic(topic);
  dispatch({ type: "NoResume" });
  dispatch({ type: "Reset" });
  dispatch({ type: "Set", payload: "Case Study Interview" });
  dispatch({ type: "CaseStudy", payload: { interview_type_id: 27, topic_slug: topicSlug } });
  setShowTopicStep(false);
  setShowSpecialisedModal(false);
  setShowSystemTest(true);
};

const handleTopicStepBack = () => {
  setShowTopicStep(false);
  setSelectedTopic(null);
};

  // Handle interview type click - separate hobby handling
  const handleInterviewTypeClick = (type) => {
    if (type.category === 'hobby-type') {
      // Show popup modal for Specialised Interview
      setShowSpecialisedModal(true);
      setSelectedInterviewType(type);
    } else {
      // For Technical/HR/Communication, use existing flow
      setSelectedInterviewType(type);
      handleInterviewSelect(type);
    }
  };

  // Check for interview end flags from sessionStorage on mount
  useEffect(() => {
    const noConversationFlag = sessionStorage.getItem('interviewEndedNoConversation');
    const offensiveFlag = sessionStorage.getItem('interviewEndedOffensive');
    const systemEndedFlag = sessionStorage.getItem('interviewEndedBySystem');
    
    if (noConversationFlag === 'true') {
      setInterviewEndModalType('noConversation');
      setShowInterviewEndedModal(true);
      sessionStorage.removeItem('interviewEndedNoConversation');
    } else if (offensiveFlag === 'true') {
      setInterviewEndModalType('offensive');
      setShowInterviewEndedModal(true);
      sessionStorage.removeItem('interviewEndedOffensive');
    } else if (systemEndedFlag === 'true') {
      setInterviewEndModalType('systemEnded');
      setShowInterviewEndedModal(true);
      sessionStorage.removeItem('interviewEndedBySystem');
    }
  }, []); // Run once on mount

  // Auto-scroll to bottom when new messages arrive
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  useEffect(() => {
    console.log("This is the updated state", state.videoInterview);
  },[state]);

  const handleInterviewSelect = async (type) => {
    // If it's an interview type (Technical/HR/Communication), start immediately
    if (type.category === 'interview-type') {
      const interview_mode = type.interview_mode;
      if(interview_mode === 'HR Interview' || interview_mode === 'Technical Interview') {
          dispatch({ type: "ShowResume" });
      } else {
          dispatch({ type: "NoResume" });
      }
      dispatch({ type: "Reset" });
      dispatch({ type: "Set", payload: interview_mode });
      // For Communication, use "Communication" as the action type
      const actionType = interview_mode === 'Communication Interview' ? 'Communication' : interview_mode.split(' ')[0];
      dispatch({ type: actionType, payload:{interview_type_id: type.id}});
      setShowSystemTest(true);
    } else {
      // Otherwise, it's a test - set as selected
      setSelectedInterview(type);
    }
  };

  const handleStartInterview = async () => {
    if (!selectedInterview) return;

    const interview_mode = selectedInterview.interview_mode;
    if(interview_mode === 'HR Interview' || interview_mode === 'Technical Interview') {
        dispatch({ type: "ShowResume" });
    } else {
        dispatch({ type: "NoResume" });
    }
    // Clear all interview context first so previous selection (e.g. AI ML) never leaks
    dispatch({ type: "Reset" });
    dispatch({ type: "Set", payload: interview_mode });
    
    if(selectedInterview.company) {
      dispatch({ type: "CompanyWise", payload: {Company: selectedInterview.company, interview_type_id: selectedInterview.id, Difficulty: selectedInterview.difficulty, Tags: selectedInterview.topics}});
    } else if(selectedInterview.subject) {
      dispatch({ type: "SubjectWise", payload: {Subject: selectedInterview.subject, interview_type_id: selectedInterview.id, Difficulty: selectedInterview.difficulty, Tags: selectedInterview.topics}});
    } else if(selectedInterview.role) {
      // Role-based interview
      dispatch({ type: "RoleBased", payload: {role: selectedInterview.role, interview_type_id: selectedInterview.id}});
    } else {
      // For Communication, use "Communication" as the action type
      const actionType = interview_mode === 'Communication Interview' ? 'Communication' : interview_mode.split(' ')[0];
      dispatch({ type: actionType, payload:{interview_type_id: selectedInterview.id}});
    }
    setShowSystemTest(true);
  };

  return (
    <>
    <div
      className={`relative ${
        showSystemTest || showSetupModal ? "overflow-hidden" : ""
      }`}
    >
      {/* Regular interview system check and setup modal */}
      {showSystemTest ? (
        <SystemCheck
          setShowSystemTest={setShowSystemTest}
          setShowSetupModal={setShowSetupModal}
        />
      ) : null}
      {showSetupModal ? (
        <PopupForm setShowSetupModal={setShowSetupModal} />
      ) : null}
      
      {/* Specialised Interview Popup Modal — two-step: hobby grid → topic grid */}
      <AnimatePresence>
        {showSpecialisedModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => { setShowSpecialisedModal(false); setShowTopicStep(false); setShowCompanyStep(false); }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="specialised-modal-title"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header — dynamic based on step */}
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(showTopicStep || showCompanyStep) && (
                      <button
                        onClick={showTopicStep ? handleTopicStepBack : handleCompanyStepBack}
                        className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                        aria-label="Back to interview types"
                      >
                        <ChevronLeft className="h-5 w-5 text-white" />
                      </button>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 id="specialised-modal-title" className="text-2xl font-bold text-white">
                        {showTopicStep
                          ? "Choose a Consulting Topic"
                          : showCompanyStep
                          ? "Real Company Playbooks"
                          : "Specialised Interview"}
                      </h2>
                      <p className="text-white/90 text-sm mt-1">
                        {showTopicStep
                          ? "Your AI interviewer will tailor the case to this topic"
                          : showCompanyStep
                          ? "Pick a startup — your AI interviewer knows the full story"
                          : "Choose a category to practice"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowSpecialisedModal(false); setShowTopicStep(false); setShowCompanyStep(false); }}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content — AnimatePresence switches between hobby grid, topic grid, and company grid */}
              <div className="p-6 max-h-[65vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {showCompanyStep ? (
                    <motion.div
                      key="company-grid"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.18 }}
                    >
                      <CompanyPlaybookGrid
                        companies={COMPANY_PLAYBOOKS}
                        selectedCompany={selectedCompany}
                        onSelect={handleCompanySelect}
                      />
                    </motion.div>
                  ) : showTopicStep ? (
                    <motion.div
                      key="topic-grid"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.18 }}
                    >
                      <TopicSelectionGrid
                        topics={consultingTopics.length > 0 ? consultingTopics : CONSULTING_TOPICS}
                        selectedTopic={selectedTopic}
                        onSelect={handleTopicSelect}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hobby-grid"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hobbies.map((hobby) => {
                          const isLocked = hobby.id !== 'case-study' && hobby.id !== 'company-playbook' && hobby.id !== 'debate';
                          return (
                            <motion.div
                              key={hobby.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.05 }}
                              whileHover={!isLocked ? { scale: 1.05, y: -4 } : {}}
                              whileTap={!isLocked ? { scale: 0.95 } : {}}
                              onClick={isLocked ? undefined : () => handleHobbySelect(hobby)}
                              className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                                isLocked
                                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                                  : selectedHobby?.id === hobby.id
                                  ? 'border-purple-500 bg-purple-50 shadow-xl scale-105'
                                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg cursor-pointer'
                              }`}
                            >
                              {isLocked && (
                                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] rounded-2xl z-20 flex items-center justify-center">
                                  <div className="bg-white rounded-full p-3 shadow-xl border-2 border-gray-400">
                                    <Lock className="h-6 w-6 text-gray-600" />
                                  </div>
                                </div>
                              )}
                              <div className="p-5 relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg ${
                                  hobby.id === 'company-playbook'
                                    ? 'bg-gradient-to-br from-orange-400 to-red-500'
                                    : 'bg-gradient-to-br from-purple-400 to-pink-500'
                                }`}>
                                  <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{hobby.name}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{hobby.description}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <TipsDrawer />
      
      {/* Interview Ended Modal */}
      <AnimatePresence>
        {showInterviewEndedModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowInterviewEndedModal(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="interview-ended-title"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {interviewEndModalType === 'offensive' ? (
                  <>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3
                      id="interview-ended-title"
                      className="text-lg font-semibold text-gray-900 mb-2"
                    >
                      Interview Ended
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      The interview has been terminated due to suspicious activity. Please maintain a professional demeanor during interviews.
                    </p>
                  </>
                ) : interviewEndModalType === 'systemEnded' ? (
                  <>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3
                      id="interview-ended-title"
                      className="text-lg font-semibold text-gray-900 mb-2"
                    >
                      Interview Ended
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      The interview has been automatically ended. You may have been inactive or away from the screen for an extended period.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                      <AlertCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3
                      id="interview-ended-title"
                      className="text-lg font-semibold text-gray-900 mb-2"
                    >
                      Interview Ended
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      The interview has been ended. No conversation was recorded. Please start a new interview to continue.
                    </p>
                  </>
                )}
                <button
                  onClick={() => setShowInterviewEndedModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 via-pink-50 to-indigo-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Play className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  AI Video Interview
                </h1>
                <p className="text-gray-600 text-base md:text-lg">Have a natural conversation with our AI interviewer</p>
              </div>
            </div>
          </motion.div>

          {/* Three Main Interview Type Sections */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group mb-8"
          >
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100/50 p-8 md:p-10 backdrop-blur-sm relative overflow-hidden">
              {/* Gradient overlays */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-pink-100/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Choose Your Interview Type
                  </h2>
                </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 items-stretch">
              {interviewTypes.map((type, index) => {
                // Company-wise interviews are now unlocked and functional
                const isLocked = false;

                return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLocked ? 0.7 : 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={isLocked ? {} : { scale: 1.02, y: -4 }}
                  whileTap={isLocked ? {} : { scale: 0.98 }}
                  onClick={isLocked ? undefined : () => handleInterviewTypeClick(type)}
                  className={`relative group/card h-full min-h-[420px] ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Glowing background effect */}
                  <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 -z-10 ${
                    type.category === 'hobby-type'
                      ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20'
                      : type.interview_mode === 'Technical Interview'
                      ? 'bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-indigo-500/20'
                      : type.interview_mode === 'Communication Interview'
                      ? 'bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20'
                      : 'bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20'
                  }`} />

                  <div className={`relative bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden flex flex-col h-full min-h-[420px] ${
                    selectedInterviewType?.id === type.id && !isLocked
                      ? type.category === 'hobby-type'
                        ? 'border-purple-500 shadow-2xl scale-105'
                        : 'border-blue-600 shadow-2xl scale-105'
                      : isLocked
                      ? 'border-gray-300'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                  }`}>
                    {/* Lock overlay for locked interviews */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-gray-100/30 backdrop-blur-[2px] rounded-3xl z-20 flex items-center justify-center">
                        <div className="bg-white rounded-full p-4 shadow-xl border-2 border-gray-400">
                          <Lock className="h-8 w-8 text-gray-600" />
                        </div>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-30 ${
                      type.category === 'hobby-type'
                        ? 'bg-gradient-to-br from-purple-200 to-pink-200'
                        : type.interview_mode === 'Technical Interview'
                        ? 'bg-gradient-to-br from-blue-200 to-cyan-200'
                        : type.interview_mode === 'Communication Interview'
                        ? 'bg-gradient-to-br from-orange-200 to-amber-200'
                        : type.interview_mode === 'Role-Based Interview'
                        ? 'bg-gradient-to-br from-indigo-200 to-purple-200'
                        : 'bg-gradient-to-br from-green-200 to-emerald-200'
                    }`} />
                  {type.category === 'hobby-type' && (
                    <div className="absolute top-2 right-2 z-10">
                      <Info className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                    <div className="p-6 md:p-8 relative z-10 flex flex-col flex-1 min-h-0">
                      <div className="flex items-center space-x-4 mb-4 shrink-0">
                      {type.category === 'hobby-type' ? (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-xl">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                      ) : type.interview_mode === 'Technical Interview' ? (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl">
                            <Code className="h-8 w-8 text-white" />
                        </div>
                      ) : type.interview_mode === 'Communication Interview' ? (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 flex items-center justify-center shadow-xl">
                            <Mic className="h-8 w-8 text-white" />
                        </div>
                      ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 flex items-center justify-center shadow-xl">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                      )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">{type.duration} min</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            type.difficulty === "Easy"
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                              : type.difficulty === "Medium"
                                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                          }`}>
                            {type.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-5 min-h-[3.5rem] line-clamp-3">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5 min-h-[2.5rem] shrink-0">
                      {type.category !== 'hobby-type' && type.topics?.length > 0 ? (
                        type.topics.slice(0, 3).map((topic, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 shadow-sm">
                            {topic}
                          </span>
                        ))
                      ) : (
                        type.category === 'hobby-type' && (
                          <span className="text-xs text-gray-400 italic">Choose your focus</span>
                        )
                      )}
                    </div>
                    <div className="mt-auto pt-1 shrink-0">
                      {type.category !== 'hobby-type' && !isLocked && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInterviewSelect(type);
                        }}
                          className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            <Play className="h-4 w-4" />
                            <span>Start Interview</span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        </motion.button>
                      )}
                      {type.category === 'hobby-type' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInterviewTypeClick(type);
                          }}
                          className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl font-bold text-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden group/btn"
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            <Play className="h-4 w-4" />
                            <span>Start Interview</span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-600 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        </motion.button>
                      )}
                    </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>

            </div>

            {/* Divider */}
            <div className="border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 my-6"></div>

            {/* Search and Filter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Find Your Interview</h3>
              </div>
              
              {/* Search Bar */}
              <div className="mb-4">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-3 mb-4">
                {categories.map((category, idx) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105"
                        : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-blue-300 shadow-sm"
                    }`}
                  >
                    {category.label} <span className="opacity-80">({category.count})</span>
                  </motion.button>
                ))}
              </div>

              {/* Difficulty Filter Pills */}
              <div className="flex flex-wrap gap-3">
                {difficulties.map((difficulty, idx) => (
                  <motion.button
                    key={difficulty.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      selectedDifficulty === difficulty.id
                        ? difficulty.id === "Easy" 
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105"
                          : difficulty.id === "Medium" 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl scale-105"
                          : difficulty.id === "Hard" 
                          ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl scale-105"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    {difficulty.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Divider */}
            <div className="border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 my-6"></div>

            {/* Interview Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Select Interview
              </h3>
              </div>
              <AnimatePresence mode="wait">
                {filteredTests.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mb-4 shadow-lg">
                      <Target className="h-10 w-10 text-gray-500" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">No interviews found</p>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
                  >
                    {filteredTests.map((test, index) => {
                      // Company-wise interviews are now unlocked and functional
                      const isLocked = false;
                      
                      return (
                      <motion.div
                        key={`${test.category}-${test.id}-${test.title}`}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: isLocked ? 0.7 : 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25 
                        }}
                        whileHover={isLocked ? {} : { scale: 1.02, y: -3 }}
                        onClick={isLocked ? undefined : () => handleInterviewSelect(test)}
                        className={`relative group/card h-full min-h-[400px] ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {/* Glowing background */}
                        <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 -z-10 ${
                          test.difficulty === "Easy"
                            ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20'
                            : test.difficulty === "Medium"
                            ? 'bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-amber-500/20'
                            : 'bg-gradient-to-br from-red-500/20 via-rose-500/20 to-pink-500/20'
                        }`} />

                        <div className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col h-[400px] ${
                          selectedInterview?.id === test.id && !isLocked
                            ? 'border-blue-500 shadow-2xl scale-105'
                            : isLocked
                            ? 'border-gray-300'
                            : 'border-gray-200 hover:border-blue-400 hover:shadow-2xl'
                        }`}>
                          {/* Lock overlay for locked interviews */}
                          {isLocked && (
                            <div className="absolute inset-0 bg-gray-100/30 backdrop-blur-[2px] rounded-3xl z-20 flex items-center justify-center">
                              <div className="bg-white rounded-full p-4 shadow-xl border-2 border-gray-400">
                                <Lock className="h-8 w-8 text-gray-600" />
                              </div>
                            </div>
                          )}
                          {/* Gradient overlay */}
                          <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                            test.difficulty === "Easy"
                              ? 'bg-gradient-to-br from-green-200 to-emerald-200'
                              : test.difficulty === "Medium"
                              ? 'bg-gradient-to-br from-yellow-200 to-orange-200'
                              : 'bg-gradient-to-br from-red-200 to-rose-200'
                          }`} />

                          <div className="p-6 relative z-10 flex flex-col flex-1 min-h-0">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
                                test.difficulty === "Easy"
                                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                  : test.difficulty === "Medium"
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                    : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                              }`}
                            >
                              {test.difficulty}
                            </span>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <BookOpen className="h-4 w-4" />
                                  <span className="font-semibold">{test.questions}</span>
                              </div>
                                <div className="flex items-center space-x-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Clock className="h-4 w-4" />
                                  <span className="font-semibold">{test.duration}m</span>
                              </div>
                            </div>
                          </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 shrink-0">
                            {test.title}
                          </h3>
                            {/* Fixed-height block so description + tags take same space on every card */}
                            <div className="flex flex-col flex-1 min-h-0 mb-5">
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
                                {test.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3 min-h-[2.75rem] items-end">
                            {test.topics?.slice(0, 3).map((topic, idx) => (
                              <span
                                key={idx}
                                  className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 shadow-sm"
                              >
                                {topic}
                              </span>
                            ))}
                            {test.topics?.length > 3 && (
                                <span className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 shadow-sm">
                                +{test.topics.length - 3} more
                              </span>
                            )}
                              </div>
                            </div>

                            <div className="mt-auto pt-1 shrink-0">
                            {!isLocked && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInterviewSelect(test);
                            }}
                                className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group/btn ${
                              selectedInterview?.id === test.id
                                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl'
                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-50 hover:to-purple-50 border-2 border-gray-300 hover:border-blue-400'
                            }`}
                          >
                                <span className="relative z-10 flex items-center space-x-2">
                            <Play className="h-4 w-4" />
                            <span>Start Test</span>
                                </span>
                                {selectedInterview?.id === test.id && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                )}
                              </motion.button>
                            )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            </div>
        </motion.div>
          </div>
        </div>
      </div>
      <StickyActionBar
        selectedInterview={selectedInterview}
        onStart={handleStartInterview}
        onClear={() => setSelectedInterview(null)}
        hideWhenSystemCheck={showSystemTest}
      />
      {selectedInterview && <div className="h-24" />}
    </>
  );
};

export default VideoInterview;
