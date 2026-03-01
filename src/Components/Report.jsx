import React from "react";

const InterviewReport = () => {
    const reportData = {
      overallScore: 78,
      duration: formatTime(sessionDuration),
      interviewType: selectedInterviewType,
      date: new Date().toLocaleDateString(),
      skills: {
        communication: { score: 85, feedback: 'Excellent verbal communication with clear articulation and good pace.' },
        technical: { score: 72, feedback: 'Good technical knowledge, but could improve problem-solving approach.' },
        problemSolving: { score: 80, feedback: 'Strong analytical thinking with structured approach to problems.' },
        leadership: { score: 75, feedback: 'Shows potential for leadership with good decision-making skills.' },
        cultural: { score: 82, feedback: 'Great cultural fit with strong team collaboration mindset.' }
      },
      strengths: [
        'Clear and confident communication style',
        'Strong technical foundation in core concepts',
        'Good problem-solving methodology',
        'Positive attitude and enthusiasm',
        'Relevant experience for the role'
      ],
      improvements: [
        'Practice more complex algorithmic problems',
        'Improve time management during technical questions',
        'Provide more specific examples in behavioral responses',
        'Work on explaining technical concepts more simply'
      ],
      recommendations: [
        'Focus on system design concepts for senior roles',
        'Practice coding problems on platforms like LeetCode',
        'Prepare more STAR method examples',
        'Research company-specific interview formats'
      ]
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Interview Report</h1>
                <p className="text-gray-600 mt-2">{reportData.interviewType} • {reportData.date} • {reportData.duration}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportTranscript}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
                <button
                  onClick={() => {
                    setShowInterviewReport(false);
                    setInterviewStarted(false);
                    setMessages([]);
                    setSelectedInterview(null);
                    setSelectedInterviewType('');
                    setSetupData({});
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  New Interview
                </button>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="8" fill="none"
                    strokeLinecap="round" strokeDasharray={`${reportData.overallScore * 2.51} 251`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{reportData.overallScore}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
              <p className="text-gray-600 text-sm">Above Average Performance</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{reportData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-medium">{messages.filter(m => m.type === 'ai').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Responses</span>
                  <span className="font-medium">{messages.filter(m => m.type === 'user').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-medium">23s</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendation</h3>
              <p className="text-gray-700 text-sm mb-3">
                Strong performance with room for technical improvement. Ready for mid-level positions.
              </p>
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Interview Ready</span>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills Assessment</h2>
            <div className="space-y-6">
              {Object.entries(reportData.skills).map(([skill, data]) => (
                <div key={skill}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">{skill.replace(/([A-Z])/g, ' $1')}</h3>
                    <span className="text-lg font-bold text-gray-900">{data.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${data.score}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600 text-sm">{data.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {reportData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-orange-500 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {reportData.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {reportData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conversation Log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversation Transcript</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${message.type === 'ai' ? 'text-blue-600' : 'text-gray-900'}`}>
                      {message.type === 'ai' ? 'AI Interviewer' : 'Candidate'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                      {message.duration && ` • ${message.duration}s`}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };