import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ searchQuery, onSearchChange, placeholder = "Search interview topics, companies, skills..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Search className="h-5 w-5 text-white" />
          </div>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-16 pr-12 py-4 border-2 border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white shadow-lg hover:shadow-xl transition-all duration-300 placeholder:text-gray-400"
        />
        {searchQuery && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:from-red-200 hover:to-red-300 hover:text-red-600 transition-all duration-300 shadow-sm"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;

