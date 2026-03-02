export const authInitialState = {
  user: null, // The Firebase user object
  role: null, // User role: student, teacher, or admin
  loading: true, // CRITICAL: Must start as true
  error: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      // The payload will be the Firebase user object and role
      return { 
        ...state, 
        user: action.payload.user || action.payload, 
        role: action.payload.role || null,
        loading: false, 
        error: null 
      };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, role: null, loading: false, error: null };
    case 'UPDATE_ROLE':
      return { ...state, role: action.payload };
    case 'AUTH_UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : state.user,
      };
    default:
      return state;
  }
};