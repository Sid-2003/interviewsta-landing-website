import { useEffect, useCallback } from "react";
import { VideoInterviewinitialstate,videointerviewReducer } from "../Reducers/videointerviewreducer";
import { sessionInitialstate,sessionReducer } from "../Reducers/sessionreducer";
import { redixsessionInitialState,redixsessionReducer } from "../Reducers/redixsessionreducer";
import { interviewTypeInitialState, interviewTypeReducer } from "../Reducers/interviewtype";
import { authInitialState, authReducer } from "../Reducers/authReducer";
import { createContext,useContext,useReducer } from "react";
import authService from "../service/auth";
import { setAccessToken, clearAccessToken } from "../service/api";

const rootReducer = (state, action) => ({
    videoInterview: videointerviewReducer(state.videoInterview, action),
    session: sessionReducer(state.session, action),
    redixsession: redixsessionReducer(state.redixsession, action),
    interviewType: interviewTypeReducer(state.interviewType, action),
    auth: authReducer(state.auth, action)
  });
  
  // Combined initial state object
  const rootInitialState = {
    videoInterview: VideoInterviewinitialstate,
    session: sessionInitialstate,
    redixsession: redixsessionInitialState,
    interviewType: interviewTypeInitialState,
    auth: authInitialState
  };
const VideoInterviewContext = createContext(undefined);

export const VideoInterviewProvider = ({ children }) => {
    const [state,dispatch] = useReducer(rootReducer,rootInitialState);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to get user profile (will use refresh token cookie if access token expired)
                const response = await authService.me();
                const userData = response.data;
                
                // Store role in localStorage for persistence
                localStorage.setItem('role', userData.role);
                
                const user = {
                    email: userData.email,
                    displayName: userData.name,
                    phone: userData.phone || '',
                    country: userData.country || '',
                };
                dispatch({ 
                    type: 'AUTH_SUCCESS', 
                    payload: { user, role: userData.role } 
                });
            } catch (error) {
                try {
                    const refreshResponse = await authService.refresh();
                    setAccessToken(refreshResponse.data.access);
                    const response = await authService.me();
                    const userData = response.data;
                    localStorage.setItem('role', userData.role);
                    const user = {
                        email: userData.email,
                        displayName: userData.name,
                        phone: userData.phone || '',
                        country: userData.country || '',
                    };
                    dispatch({ 
                        type: 'AUTH_SUCCESS', 
                        payload: { user, role: userData.role } 
                    });
                } catch (refreshError) {
                    // Both failed - user is not authenticated
                    console.error("Authentication check failed:", refreshError);
                    localStorage.removeItem('role');
                    clearAccessToken();
                    dispatch({ type: 'AUTH_LOGOUT' });
                }
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = useCallback(async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const { access, user } = response.data;
            
            // Store access token in memory
            setAccessToken(access);
            
            // Store role in localStorage
            localStorage.setItem('role', user.role);
            
            const userObj = {
                email: user.email,
                displayName: user.name,
                phone: user.phone || '',
                country: user.country || '',
            };
            
            dispatch({ 
                type: 'AUTH_SUCCESS', 
                payload: { user: userObj, role: user.role } 
            });
            
            return { success: true, user: userObj, role: user.role };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    }, []);

    // Register function
    const register = useCallback(async (name, email, password, role = 'student', phone = '', country = '') => {
        try {
            const response = await authService.register(name, email, password, role, phone, country);
            const { access, user } = response.data;
            
            setAccessToken(access);
            localStorage.setItem('role', user.role);
            
            const userObj = {
                email: user.email,
                displayName: user.name,
                phone: user.phone || '',
                country: user.country || '',
            };
            
            dispatch({ 
                type: 'AUTH_SUCCESS', 
                payload: { user: userObj, role: user.role } 
            });
            
            return { success: true, user: userObj, role: user.role };
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, error: error.response?.data || 'Registration failed' };
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear everything regardless of API call success
            localStorage.clear();
            sessionStorage.clear();
            clearAccessToken();
            dispatch({ type: 'AUTH_LOGOUT' });
        }
    }, []);

    // Google login function
    const googleLogin = useCallback(async (code, role = 'student') => {
        try {
            const redirectUri = `${window.location.origin}/auth/callback`;
            console.log('GoogleLogin called with:', { code: code?.substring(0, 20) + '...', redirectUri, role });
            
            const response = await authService.googleLogin(code, redirectUri, role);
            console.log('Google auth response:', response.data);
            
            const { access, user } = response.data;
            
            if (!access || !user) {
                console.error('Missing access token or user data:', response.data);
                return { success: false, error: 'Invalid response from server' };
            }
            
            setAccessToken(access);
            localStorage.setItem('role', user.role);
            
            const userObj = {
                email: user.email,
                displayName: user.name,
                phone: user.phone || '',
                country: user.country || '',
            };
            
            dispatch({ 
                type: 'AUTH_SUCCESS', 
                payload: { user: userObj, role: user.role } 
            });
            
            console.log('Google login successful!', { user: userObj, role: user.role });
            return { success: true, user: userObj, role: user.role };
        } catch (error) {
            console.error("Google login failed:", error);
            console.error("Error details:", error.response?.data);
            return { success: false, error: error.response?.data?.error || error.message || 'Google login failed' };
        }
    }, []);

    // GitHub login function
    const githubLogin = useCallback(async (code, role = 'student') => {
        try {
            const redirectUri = `${window.location.origin}/auth/callback`;
            const response = await authService.githubLogin(code, redirectUri, role);
            const { access, user } = response.data;
            
            setAccessToken(access);
            localStorage.setItem('role', user.role);
            
            const userObj = {
                email: user.email,
                displayName: user.name,
                phone: user.phone || '',
                country: user.country || '',
            };
            
            dispatch({ 
                type: 'AUTH_SUCCESS', 
                payload: { user: userObj, role: user.role } 
            });
            
            return { success: true, user: userObj, role: user.role };
        } catch (error) {
            console.error("GitHub login failed:", error);
            return { success: false, error: error.response?.data?.error || 'GitHub login failed' };
        }
    }, []);

    const updateProfile = useCallback(async (data) => {
        try {
            const response = await authService.updateProfile(data);
            const updated = response.data;
            if (updated) {
                const payload = {};
                if (updated.phone !== undefined) payload.phone = updated.phone;
                if (updated.country !== undefined) payload.country = updated.country;
                if (Object.keys(payload).length) dispatch({ type: 'AUTH_UPDATE_PROFILE', payload });
            }
            return { success: true, data: updated };
        } catch (error) {
            console.error("Update profile failed:", error);
            return { success: false, error: error.response?.data || 'Update failed' };
        }
    }, []);

    const contextValue = {
        state,
        dispatch,
        login,
        register,
        logout,
        googleLogin,
        githubLogin,
        updateProfile,
    };

    return (
        <VideoInterviewContext.Provider value={contextValue}>
            {children}
        </VideoInterviewContext.Provider>
    )
}


export const useVideoInterview = () => {
    const context = useContext(VideoInterviewContext);
    if (context === undefined) {
        throw new Error('useVideoInterview must be used within a VideoInterviewProvider');
    }
    return context;
}; 
