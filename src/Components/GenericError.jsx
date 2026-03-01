import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';


const GenericError = ({
  title = 'Something Went Wrong',
  message = 'We encountered an unexpected error',
//   details = 'Don\'t worry, our team has been notified and we\'re looking into it.'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlebeforeunload = (e) => {
      navigate(-1);
    }
    window.addEventListener('beforeunload', handlebeforeunload);

    return () => {
      window.removeEventListener('beforeunload', handlebeforeunload);
    }
  }, []); 

  const handleRetry = () => {
    navigate(-1);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/manage');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full mb-6 shadow-lg"
            >
              <AlertCircle className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h1>

            <p className="text-gray-600 text-lg mb-2">
              {message}
            </p>

            {/* <p className="text-gray-500 mb-8">
              {details}
            </p> */}

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Refresh Page</span>
              </motion.button>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoBack}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Go Back</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoHome}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </motion.button>
              </div>
            </div>

            
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          {/* <p className="text-sm text-gray-500">
            Need help?{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </a>
          </p> */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GenericError;
