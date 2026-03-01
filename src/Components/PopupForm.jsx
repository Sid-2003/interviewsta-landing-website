import React, { useState, useEffect } from "react";
import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import {
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
} from "lucide-react";

const PopupForm = ({ setShowSetupModal }) => {

  
  const [openCheck, setOpenCheck] = useState(true);
  const [setupData, setSetupData] = useState({});
  const { state, dispatch } = useVideoInterview();
  const selectedInterviewType = state.session;
  const Navigate = useNavigate();
  useEffect(()=>{
    console.log("This is setup data",setupData);
  },[setupData])
  const handleAutoFillHR = async (e) => {
    console.log("Clicked!",setupData.resume);
        try{
    const formdata = new FormData();
    formdata.append("resume",setupData.resume);
    const response = await api.post("get-resume-hr/", formdata)
    if(response.ok){
      const data = await response.json();
      console.log("This is the response ->",data);
      setSetupData(data);
      // console.log("This is setup data",setupData);
    }
    else{
      console.log("Error",response);
    }
    } catch(error){
      console.log("THis is error occured",error);
    }
  }
  const handleAutoFillTechnical = async (e) => {
    console.log("Clicked!",setupData.resume);
        try{
    const formdata = new FormData();
    formdata.append("resume",setupData.resume);
    const response = await api.post("get-resume-technical/", formdata)
    if(response.ok){
      const data = await response.json();
      console.log("This is the response ->",data);
      setSetupData(data);
      // console.log("This is setup data",setupData);
    }
    else{
      console.log("Error",response);
    }
    } catch(error){
      console.log("THis is error occured",error);
    }
  }

  function ReturnString(instance){
    for(const[key,value] of Object.entries(instance)){
        if(Array.isArray(value)){
            console.log("Array")
            instance[key] = value.join(',')
        }
    }
    return instance;
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSetupData({ ...setupData, resume: file });
    }
  };
  const handleJobDescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSetupData({ ...setupData, jobdescription: file });
    }
  };
  const proceedWithInterview = async () => {
        switch (selectedInterviewType) {
      case "General Interview": {
        if (setupData.resume && setupData.jobdescription) {
          const formdata = new FormData();
          formdata.append("resume", setupData.resume);
          formdata.append("jobDescription", setupData.jobdescription);
          try {
            const response = await api.post("upload-files/", formdata);

            if (!response.ok) {
              throw new Error(
                `Network response was not ok: ${response.statusText}`
              );
            }

            const data = await response.json();

            const inpdata = {
              resume: data.resume_skills,
              jd: data.job_summary,
            };

            dispatch({ type: "Clear" });
            dispatch({ type: "Resume_and_jd", payload: inpdata });
            // console.log("Data",inpdata);
            Navigate("/interview-interface");
          } catch (err) {
            console.error("Can't move on", err);
          }
        } else {
          console.error("Kindly upload resume and job description");
        }
        break;
      }
      case "Technical Interview": {
          const inputdata = ReturnString(setupData);
          console.log(inputdata);
          dispatch({ type: "Clear" });
          dispatch({ type: "Technical", payload: inputdata });
          Navigate("/interview-interface");
          break;
        }
      case "HR Interview": {
          const inpdata = ReturnString(setupData);
          dispatch({ type: "Clear" });
          dispatch({ type: "HR", payload: inpdata });
          Navigate("/interview-interface");
        break;
      }
      case "Case Study Interview": {
          // Case Study doesn't need any setup data - just navigate
          dispatch({ type: "Clear" });
          // CaseStudy data is already set in VideoInterview when hobby is selected
          Navigate("/interview-interface");
        break;
      }
      
    }

    // Navigate("/interview-interface");
  };

 

  useEffect(() => {
    if (!selectedInterviewType && openCheck) {
      Navigate("/video-interview");
    }
    setOpenCheck(false);

    document.body.classList.add("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedInterviewType, openCheck, Navigate]);
  const renderSetupForm = () => {
    switch (selectedInterviewType) {
      case "Case Study Interview":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">Case Study Interview</h3>
                  <p className="text-sm text-blue-700 mt-1">Practice analyzing real-world business scenarios and develop your problem-solving skills</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong className="font-semibold">Ready to practice?</strong> You'll be presented with a case study scenario and asked to analyze it. 
                Think through the problem, ask clarifying questions, and present your solution approach.
              </p>
            </div>
          </div>
        );
      case "General Interview":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="text-gray-700">Upload Resume</div>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {setupData.resume
                      ? setupData.resume.name
                      : "Click to upload resume"}
                  </p>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="text-gray-700">Upload Job Description</div>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleJobDescriptionUpload}
                  className="hidden"
                  id="jobdescription-upload"
                />
                <label
                  htmlFor="jobdescription-upload"
                  className="cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {setupData.jobdescription
                      ? setupData.jobdescription.name
                      : "Click to upload job description"}
                  </p>
                </label>
              </div>
            </div>
          </div>
        );

      case "Technical Interview":
        return (
          <div className="space-y-6 max-h-[30vh] overflow-y-scroll">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="text-gray-700"><span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Auto-Fill using AI</span></div>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload-senior"
                />
                <label
                  htmlFor="resume-upload-senior"
                  className="cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm !text-gray-600">
                    {setupData.resume
                      ? setupData.resume.name
                      : "Click to upload resume"}
                  </p>
                </label>
              </div>
            </div>
            <div>
              <button className="w-full rounded-lg border border-gray-300 bg-gradient-to-r from blue-50 to-purple-50 cursor-pointer text-md flex justify-center items-center p-2"
              onClick={handleAutoFillTechnical}>
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      AutoFill
                    </div>
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Name
              </label>
              <input
                value={setupData.Name || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    Name: e.target.value,
                  }))
                }
                // placeholder="e.g., Finance, Software"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Role
              </label>
              <input
                value={setupData.Role || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    Role: e.target.value,
                  }))
                }
                // placeholder="e.g., Finance, Software"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Company
              </label>
              <input
                value={setupData.Company || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    Company: e.target.value,
                  }))
                }
                // placeholder="e.g., Finance, Software"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Programming Language
              </label>
              <input
                type="text"
                value={setupData.Programming_Language || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    Programming_Language: e.target.value,
                  }))
                }
                placeholder="e.g., Meta, Amazon, Netflix"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Frameworks
              </label>
              <input
                type="text"
                value={setupData.Frameworks || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    Frameworks: e.target.value,
                  }))
                }
                placeholder="e.g., Engineering Manager, Director of Product"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Type of Projects You've Worked On
              </label>
              <textarea
                value={setupData.Projects || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    Projects: e.target.value,
                  }))
                }
                placeholder="Describe the scale and type of projects you've managed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                type="text"
                value={setupData.difficulty || "Easy"}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    Difficulty: e.target.value,
                  }))
                }
                placeholder="e.g., Engineering Manager, Director of Product"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        );

      case "HR Interview":
        return (
          <div className="space-y-6 max-h-[30vh] overflow-y-scroll">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="text-gray-700"><span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Auto-Fill using AI</span></div>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload-senior"
                />
                <label
                  htmlFor="resume-upload-senior"
                  className="cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm !text-gray-600">
                    {setupData.resume
                      ? setupData.resume.name
                      : "Click to upload resume"}
                  </p>
                </label>
              </div>
            </div>
            <div>
              <button className="w-full rounded-lg border border-gray-300 bg-gradient-to-r from blue-50 to-purple-50 cursor-pointer text-md flex justify-center items-center p-2"
              onClick={handleAutoFillHR}>
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      AutoFill
                    </div>
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Name
              </label>
              <input
                value={setupData.Name || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    industry: e.target.value,
                  }))
                }
                // placeholder="e.g., Finance, Software"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Target Role
              </label>
              <input
                type="text"
                value={setupData.Role || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({ ...prev, role: e.target.value }))
                }
                placeholder="e.g., Product Manager, Team Lead"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={setupData.Company || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({ ...prev, role: e.target.value }))
                }
                placeholder="e.g., Microsoft, Google"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <select className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium !text-gray-700 border border-gray-300" value={setupData.Experience || ""}>
              <option value="">Select experience level</option>
                <option value="0-2">0-2 years (Entry Level)</option>
                <option value="3-5">3-5 years (Mid Level)</option>
                <option value="6-10">6-10 years (Senior Level)</option>
                <option value="10+">10+ years (Lead/Principal)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Hobbies
              </label>
              <input
                value={setupData.Hobbies || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    hobbies: e.target.value,
                  }))
                }
                placeholder="e.g., Swimming, Cooking"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-2">
                Achievements
              </label>
              <input
                value={setupData.Achievements || ""}
                onChange={(e) =>
                  setSetupData((prev) => ({
                    ...prev,
                    achievements: e.target.value,
                  }))
                }
                placeholder="e.g., Academic, Sports"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-gray-700"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Setup Your Interview
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedInterviewType} Preparation
              </p>
            </div>
            <button
              onClick={() => setShowSetupModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {selectedInterviewType === "Technical Interview" && (
                  <FileText className="h-5 w-5 text-blue-600" />
                )}
                {selectedInterviewType === "General Interview" && (
                  <Users className="h-5 w-5 text-blue-600" />
                )}
                {selectedInterviewType === "HR Interview" && (
                  <Building className="h-5 w-5 text-blue-600" />
                )}
                {selectedInterviewType === "Case Study Interview" && (
                  <FileText className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedInterviewType}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedInterviewType === "Technical Interview" &&
                    "Provide context to get more relevant technical questions"}
                  {selectedInterviewType === "General Interview" &&
                    "Help us understand your background for better questions"}
                  {selectedInterviewType === "HR Interview" &&
                    "Share your hobbies, interests, experience for cultural fit questions"}
                  {selectedInterviewType === "Case Study Interview" &&
                    "Practice analyzing real-world business scenarios and problem-solving"}
                </p>
              </div>
            </div>
          </div>
          {renderSetupForm()}
        </div>
        <div className="p-6 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => setShowSetupModal(false)}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={proceedWithInterview}
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Start Interview</span>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default PopupForm;
