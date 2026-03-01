// Pure reducer module (no React)
export const VideoInterviewinitialstate = {
  Resume_and_jd: { resume: "", jd: "" },
  Technical: {
    Resume: "",
    interview_type_id: ""
  },
  HR: {
    Resume: "",
    interview_type_id: 2
  },
  CompanyWise: {
    Company: "",
    interview_type_id: "",
    Difficulty: "",
    Tags:""
  },
  SubjectWise: {
    Subject: "",
    interview_type_id: "",
    Difficulty: "",
    Tags:""
  },
  CaseStudy: {
    interview_type_id: "",
  },
  Communication: {
    interview_type_id: "",
  },
  Debate: {
    interview_type_id: "",
  },
  RoleBased: {
    role: "",
    interview_type_id: "",
  }
};

export const videointerviewReducer = (state, action) => {
  switch (action.type) {
    case "Resume_and_jd":
        return { ...state, Resume_and_jd: action.payload };
    case "Technical":
        return { ...state, Technical: action.payload};
    case "HR":
        return { ...state, HR: action.payload };
    case "CompanyWise":
        return { ...state, CompanyWise: action.payload};
    case "SubjectWise":
        return { ...state, SubjectWise: action.payload};
    case "CaseStudy":
        return { ...state, CaseStudy: action.payload};
    case "Communication":
        return { ...state, Communication: action.payload};
    case "Debate":
        return { ...state, Debate: action.payload};
    case "RoleBased":
        return { ...state, RoleBased: action.payload};
    case "Clear_all":
    case "Reset":
      return { ...VideoInterviewinitialstate };
    default:
      return state;
  }
};
