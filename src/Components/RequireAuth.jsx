import React,{useEffect,useState} from 'react';
import Errorpage from './Errorpage';
import { Navigate } from 'react-router-dom';
// import { useVideoInterview } from '../Contexts/VideoInterviewContext';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';


const RequireAuth = ({children,  requiredState, navigateTo}) => {
    const context = useVideoInterview();
    
    // Safety check for context
    if (!context || !context.state) {
        console.error("RequireAuth - Context is undefined or missing state");
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    const { state, dispatch } = context;
    const { user, loading } = state.auth; // <-- Access the new auth slice

    useEffect(() => {
      console.log("RequireAuth - User Check:", user);
      console.log("Required State Check:", requiredState, state[requiredState]);
      console.log("Loading state:", loading);
    }, [loading, user]);
    
    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        ); 
    }
    
    // Redirect to login if not authenticated
    if (!user) {
        console.log("RequireAuth - No user, redirecting to login");
        return <Navigate to='/' replace />
    }
    
    // Check for required state (e.g., session for interview interface)
    if (requiredState) {
        if (!state[requiredState]) {
            console.log(`RequireAuth - Missing required state: ${requiredState}, redirecting`);
            return <Navigate to={navigateTo || '/manage'} replace />
        }
    }
    
    return children;
}

export default RequireAuth;