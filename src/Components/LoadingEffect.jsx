import React,{useState,useEffect} from 'react';
import LoadingCard from './Experimental/LoadingCard';
import LoadingWrapper from './Experimental/LoadingWrapper';

const LoadingEffect = () => {
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      setTimeout(() => setIsLoading(false), 3000);
    }, []);
  
    return (
      
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold">Content Title</h3>
          <LoadingWrapper isLoading={isLoading}>
          <p>This content will be wrapped with loading animation</p>
          </LoadingWrapper>
        </div>
    );
}

export default LoadingEffect