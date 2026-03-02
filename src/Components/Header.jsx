import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOutIcon, UserIcon, ChevronDown, GraduationCap, X, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import Logo from "../assets/logo.png";

const Header = ({setSectionChange}) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const Navigate = useNavigate();
  const navMenuRef = useRef(null);
  const profileRef = useRef(null);
  const profileVisRef = useRef(null);
  const navMenuVisRef = useRef(null);
  const currentSection = useLocation();
  const {state,dispatch} = useVideoInterview();
  
  const role = localStorage.getItem('role') || 'student';

  const [hoveredNavItem, setHoveredNavItem] = useState(false);
  const [currentHoveredItem, setCurrentHoveredItem] = useState(null);


  // const [toggleMenu, setToggleMenu] = useState(false);
  // const location = useLocation();
  // console.log(currentSection.pathname);
  useEffect(() => {
    if(toggleMenu) {
      navMenuRef.current.classList.remove('hidden');
      navMenuVisRef.current.classList.add('bg-blue-50', 'text-blue-600' ,'shadow-sm');
    } else {
      navMenuRef.current.classList.add('hidden');
      navMenuVisRef.current.classList.remove('bg-blue-50' ,'text-blue-600' ,'shadow-sm');
    }
  },[toggleMenu]);

  useEffect(() => {
    if(toggleProfile) {
      profileRef.current.classList.remove('hidden');
      profileVisRef.current.classList.add('text-blue-600');
    } else {
      profileRef.current.classList.add('hidden');
      profileVisRef.current.classList.remove('text-blue-600');
    }
  },[toggleProfile]);

  useEffect(() => {
    if (hoveredNavItem === false) {
      setCurrentHoveredItem(null);
    }
  }, [hoveredNavItem]);

  // Close dropdown when route changes
  useEffect(() => {
    setHoveredNavItem(false);
    setCurrentHoveredItem(null);
  }, [currentSection.pathname]);

  const handleClickNavItem = (link) => {
    Navigate(link);
    setToggleMenu(false);
    // Close dropdown when navigating to any route
    setHoveredNavItem(false);
    setCurrentHoveredItem(null);
  };
  //   const currentSection =
  const handleClickNavVisibleItem = (item) => {
    if (item.link) {
      Navigate(item.link);
    } else {
      setHoveredNavItem((prev) => prev !== "clicked" ? "clicked" : false);
      setCurrentHoveredItem(item.id);
      console.log("Clcococo");
    }
  }

  const { logout } = useVideoInterview();
  
  const handleSignOut = async () => {
    try{
      await logout();
    } catch(error) {
      console.error("Error signing out!", error);
    }
  }
  
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'student': return 'bg-blue-100 text-blue-700';
      case 'teacher': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  // Role-based navigation items
  const getNavItems = () => {
    if (role === 'teacher') {
      return [];
    } else if (role === 'admin') {
      return [
        { id: "dashboard", label: "Dashboard", link: "/admin/dashboard" },
        { id: "users", label: "User Management", link: "/admin/users" },
      ];
    } else {
      // Student navigation (existing)
      return [
        { id: "dashboard", label: "Dashboard", link: "/manage" },
        { id: "classroom", label: "My Classroom", link: "/student/classes" },
        {
          id: "video-interview",
          label: "Video Interview",
          link: "/video-interview",
        },
        // Learning tab hidden
        // { id: "learning", label: "Learning", link: "/learning" },
        { id: "resume", label: "Resume", subItems:[
          {
            id: "resume-analysis", label: "Resume Analysis", link: "/resume-analysis"
          }
        ]},
      ];
    }
  };

  const navItems = getNavItems();

  // Check if current path matches any subItem of a nav item
  const isNavItemActive = (item) => {
    if (item.link) {
      return currentSection.pathname === item.link;
    }
    if (item.subItems) {
      return item.subItems.some(subItem => currentSection.pathname === subItem.link);
    }
    return false;
  };

  const handleClickItemLg = (link) => {
      const diff = navItems.findIndex((item) => item.link === currentSection.pathname) - navItems.findIndex((item) => item.link === link);
      setSectionChange(diff);
      Navigate(link);
  }

  // const handleClickNavItem = (link) => {
  //     setSectionChange(link);
  //     Navigate(link);
  //     setToggleMenu(false);
  // }
  //   const currentSection =

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Logo */}
            <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => {
              const role = localStorage.getItem('role') || 'student';
              if (role === 'teacher') {
                Navigate('/teacher/classes');
              } else if (role === 'admin') {
                Navigate('/admin/dashboard');
              } else {
                Navigate('/manage');
              }
            }}>
              <img src={Logo} alt="Interviewsta.AI" className="h-8 w-auto" />
            </div>

            {/* Navigation - Centered */}
            <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
              {/* Departments Button - Hidden */}
              {/* <button
                onClick={handleDepartmentsClick}
                className="relative px-4 py-2 rounded-full text-sm font-semibold text-gray-700 bg-white hover:shadow-lg transition-all duration-200 group overflow-hidden"
                style={{
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #3b82f6, #a855f7, #ec4899) border-box',
                  border: '2px solid transparent',
                }}
              >
                <div className="flex items-center space-x-2 relative z-10">
                  <GraduationCap className="h-4 w-4 text-gray-700 group-hover:text-blue-600 transition-colors" />
                  <span>Departments</span>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 blur-sm transition-opacity -z-0"></div>
              </button> */}
              {/* {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClickItemLg(item.link)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentSection.pathname === item.link
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))} */}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleClickNavVisibleItem(item);
                  }}
                  className={`px-4 py-2 rounded-lg relative text-sm font-medium transition-all duration-200 ${
                    isNavItemActive(item)
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  } cursor-pointer flex items-center space-x-1 ${item.subItems ? 'pr-2' : ''} whitespace-nowrap`}
                  onMouseEnter={() => {item.subItems && setCurrentHoveredItem(item.id); item.subItems && setHoveredNavItem((prev) => prev !== "clicked" ? true : "clicked")}}
                  onMouseLeave={() => {item.subItems && setHoveredNavItem((prev) => prev !== "clicked" ? false : "clicked")}}
                >
                  <span>{item.label}</span>
                  {item.subItems ? (
                    <ChevronDown className={`h-4 w-4 ${currentHoveredItem === item.id ? "rotate-180" : ""} transition-transform duration-200`} />
                  ) : null}
                  <AnimatePresence mode="wait"> 
                      {hoveredNavItem && currentHoveredItem === item.id && (
                        <motion.div className={`${hoveredNavItem ? "absolute" : "hidden"} top-full left-0 w-max overflow-hidden rounded-sm bg-white shadow-2xl shadow-gray-50`}
                          key="NavItemDropdown"
                          initial={{ height: 0 }}
                          animate={{ height: hoveredNavItem ? 'auto' : 0 }}
                          exit={{ height: 0}}
                        >
                          <ul className="flex flex-col p-4 space-y-2">
                            {item.subItems.map((subItem) => (
                              <li key={subItem.id}>
                                <motion.button
                                  onClick={() => handleClickNavItem(subItem.link)}
                                  whileHover={{ x: 5 }}
                                  className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                    currentSection.pathname === subItem.link
                                      ? "bg-blue-50 text-blue-600"
                                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {subItem.label}
                                </motion.button>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </button>
              ))}
            </nav>

            {/* Mobile Departments Button - Hidden */}
            {/* <button
              onClick={handleDepartmentsClick}
              className="lg:hidden px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors flex items-center space-x-1"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Departments</span>
            </button> */}

            {/* User Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0 ml-auto">
              {/* User Info with Dropdown */}
              <div className="relative">
                <button 
                  className="hidden md:flex items-center space-x-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setToggleProfile(prev => !prev)}
                  ref={profileVisRef}
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {state?.auth?.user?.displayName || 'User'}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(role)}`}>
                      {role}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border border-blue-200">
                    <UserIcon className="h-4 w-4 text-blue-600"/>
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                <div className="hidden absolute top-[calc(100%)] z-10 right-0 w-44 rounded-lg bg-white shadow-lg border border-gray-200 mt-1 overflow-hidden"
                ref={profileRef}>
                  <button
                    className="w-full text-gray-700 inline-flex space-x-2.5 items-center hover:text-blue-600 hover:bg-gray-50 px-4 py-2.5 transition-colors text-sm"
                    onClick={() => { Navigate('/account'); setToggleProfile(false); }}
                  >
                    <Settings className="w-4 h-4"/>
                    <p>My Account</p>
                  </button>
                  <div className="border-t border-gray-100" />
                  <button 
                    className="w-full text-red-500 inline-flex space-x-2.5 items-center hover:text-red-600 hover:bg-gray-100 px-4 py-2.5 transition-colors text-sm"
                    onClick={() => handleSignOut()}
                  >
                    <LogOutIcon className="w-4 h-4"/>
                    <p>Log out</p>
                  </button>
                </div>
              </div>
              
              {/* Mobile Menu Button - Right Side */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors order-last"
              onClick={()=>{setToggleMenu((val)=>!val)}}
              ref={navMenuVisRef}>
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="hidden absolute top-full left-0 min-h-[calc(100vh-2rem)] w-full bg-blue-50"
        ref={navMenuRef}>
          <nav className="!flex !flex-col pt-5 space-y-3 min-h-full w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.link) {
                    handleClickNavItem(item.link);
                  } else if (item.subItems && item.subItems.length > 0) {
                    handleClickNavItem(item.subItems[0].link);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 block ${
                  currentSection.pathname === item.link
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
