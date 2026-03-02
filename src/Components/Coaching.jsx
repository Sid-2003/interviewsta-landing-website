import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send,
  User,
  Bot,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Star,
  SquarePen,
  Play
} from 'lucide-react';
import { v4 as uuidv4 } from "uuid";

import api from "../service/api";
const Coaching = () => {
  
  const [url,setUrl] = useState({});

  const startMessage = [   //Current opened session's chat messages, will be cached in backend with TTL
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI interview coach. I'm here to help you prepare for your upcoming interviews. What would you like to work on today?",
      timestamp: "Now"
    }
  ]
  const [messages, setMessages] = useState(startMessage);
  const [inputMessage, setInputMessage] = useState('');


  const [currentSession,setCurrentSession] = useState({});  // Sets the current open session's, if nothing we would have new chat as opened this would be changed once the data opens 
  const [allSessions,setAllSessions] = useState([{}]); // All the current user's sessions

  const socket = useRef(null);

  const coachingTopics = [
    {
      title: 'Behavioral Interview Prep',
      description: 'Master the STAR method and common behavioral questions',
      duration: '30 minutes',
      difficulty: 'Beginner'
    },
    {
      title: 'Technical Interview Strategy',
      description: 'Approach technical problems with confidence',
      duration: '45 minutes',
      difficulty: 'Intermediate'
    },
    {
      title: 'Salary Negotiation',
      description: 'Learn how to negotiate your worth effectively',
      duration: '25 minutes',
      difficulty: 'Advanced'
    },
    {
      title: 'Executive Interview Skills',
      description: 'Present yourself as a strong leader',
      duration: '40 minutes',
      difficulty: 'Advanced'
    }
  ];

  const quickPrompts = [
    "Help me answer 'Tell me about yourself'",
    "How do I explain gaps in my resume?",
    "What are good questions to ask interviewers?",
    "How do I handle stress interview questions?"
  ];

  useEffect(()=>{
    const fetchSessions = async () => {
      // console.log("this is the user", user);
            try{

      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "coaching-sessions/",
        {
          method: "GET",
          
        }
      )
      if(!response.ok){
        throw response.error;
      }
      // console.log(await response.json());
      const data = await response.json();
      // console.log(data);
      // console.log("This is the list of coaching sessions -> ",data);
      setAllSessions(data);
    }
      catch (err){
        console.error("This is the error",err)
      }
    }
    fetchSessions();
    
  },[]);

  useEffect(() => {
    const retrieveMessages = async () => {
    if(Object.keys(currentSession).length !== 0)
    {
        // console.log("Hereeeee");
                const response = await fetch(`http://localhost:8000/api/messages/?session=${currentSession["session_id"]}`,
          {
            method:"GET",
            headers:{
              "Content-Type": "application/json",
              
            }
          }
        )
        // console.log(response);
        if(response.ok)
        {
          const data = await response.json();
          setMessages(data);
          // console.log(data);
        }
    }
  }
  retrieveMessages();
    
  },[currentSession])


  useEffect(() => {
    if(Object.keys(url?.url ?? {}).length){
      const ws = new WebSocket(url.url)
      socket.current = ws;

      ws.onopen = () => {
        socket.current.send(JSON.stringify({
          "data":url.first_message
        }))
      }
      ws.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        // console.log("Here is the message",parsedData);
        const aiResponse = {
          id: uuidv4(),
          type: 'ai',
          content: parsedData.Content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      return () =>{
        ws.close();
      }
    }
    
  },[url])
  


  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
        // New Session needs to be created
    const newMessage = {
      id: uuidv4(),
      type: 'human',
      content: inputMessage,
      timestamp: new Date()
    };

    if(Object.keys(currentSession).length === 0){
      try{
        const inputData = {
          title: inputMessage.slice(0,30),
          tags: ["work","hard"]
        }
        const response = await api.post('coaching-sessions/', JSON.stringify(inputData))
        if(!response.ok){
          throw response.error;
        }
        const dataSession = await response.json();

        setAllSessions((prev) => [dataSession,...prev])
        setCurrentSession(dataSession);

        const response1 = await api.post('messages/', {
            content:inputMessage,
            type:'human',
            session:dataSession.session_id
        })
        if(!response1.ok){
          throw response1.error
        }
        const dataMessage = await response1.json();
        setMessages([dataMessage]);
        // console.log("Create new message for the session",dataMessage);

        // setSessionCreated((e) => e+=1);
        setUrl({url:`ws://localhost:8000/ws/coaching/xyz/${dataSession.session_id}`,first_message:inputMessage});
  
      } catch(err){
        console.error("This is the error encountered",err);
    }
    } else {

      const response1 = await api.post('messages/', {
          content:inputMessage,
          type:'human',
          session:currentSession.session_id
      })
      if(!response1.ok){
        throw response1.error
      }
      const dataMessage = await response1.json();
      setMessages((prev) => [...prev,dataMessage]);

      socket.current.send(JSON.stringify({
        "data":inputMessage
      }))
    }

    // if(messages.at(0) !== startMessage){
    //   setMessages((prev) => [...prev,in])
    // }
    setInputMessage('');

  };


  
  
  const handleNewChatClick = (e) => {
    setCurrentSession({});
    setMessages(startMessage);
  }

  const handleSelectSession = (index) => {
    setCurrentSession(allSessions[index]);
  }

  

  // useEffect(()=>{
  //   setCurrentSession(allSessions[0]);
  // },[allSessions])

  return (
    <div className="max-h-[calc(100vh-5rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Interview Coaching</h1>
          <p className="text-gray-600 mt-2">Get personalized coaching to ace your interviews</p>
        </div> */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-7rem)] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Interview Coach</h3>
                    <p className="text-sm text-green-600">● Online</p>
                  </div>
                  {/* <div className="absolute right-5 top-[0%] w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <SquarePen className="w-5 h-5 text-white" />
                  </div> */}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'human' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-md ${
                      message.type === 'human' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'human' 
                          ? 'bg-blue-600' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        {message.type === 'human' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.type === 'human'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {/* <p className={`text-xs mt-1 ${
                          message.type === 'human' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompts */}
              {/* {currentSession} */}
              <div className="px-6 py-2">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(prompt)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask your interview coach anything..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-3 text-gray-400 hover:text-gray-600">
                    <Mic className="h-5 w-5" />
                  </button>
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 h-[calc(100vh-7rem)] overflow-y-scroll">
            {/* Coaching Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className={`w-full h-10 rounded-lg p-3 border border-gray-100 mb-4 ${Object.keys(currentSession).length === 0? "bg-blue-50 border-blue-100" : "text-black/50" } flex items-center hover:cursor-pointer hover:bg-blue-50 hover:border-blue-100 font-medium space-x-2`}
              onClick={handleNewChatClick}> 
                <SquarePen className={`w-5 h-5 ${Object.keys(currentSession).length === 0? "":"text-black/50"}`} />
                <p>New Chat</p>
                </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h3>
              <div className="space-y-3">
                {allSessions.map((conversation, index) => (
                  <div key={index} className={`border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer ${currentSession === conversation?"bg-blue-50 border-blue-300":""}`}
                  onClick = {(e)=> handleSelectSession(index)}>
                    <p className="text-sm text-gray-900 mb-2 line-clamp-2">{conversation.title}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{conversation.timeSince}</span>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{conversation.responses} responses</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>View All Conversations</span>
              </button>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Coaching Topics</h3>
              <div className="space-y-3">
                {coachingTopics.map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{topic.title}</h4>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Play className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs mb-2">{topic.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{topic.duration}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Today's Tip</h3>
              <p className="text-gray-700 text-sm mb-3">
                Practice the "2-minute rule" - be able to explain any point on your resume in under 2 minutes with specific examples.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-600">Rated 4.9/5 by users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coaching;