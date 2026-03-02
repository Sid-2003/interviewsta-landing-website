import React, { useEffect } from 'react'

const useStopReload = () => {
    useEffect(() => {
        const handlebeforeunload = (e) => {
          e.preventDefault();
        }
        window.addEventListener('beforeunload', handlebeforeunload);
        // const c = window.addEventListener('')
    
        return () => {
          window.removeEventListener('beforeunload', handlebeforeunload);
        }
      },[])
}

export default useStopReload