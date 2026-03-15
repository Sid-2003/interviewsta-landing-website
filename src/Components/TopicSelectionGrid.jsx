import { motion } from "framer-motion";

const TopicSelectionGrid = ({ topics, selectedTopic, onSelect }) => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {topics.map((topic, idx) => (
          <motion.div
            key={topic.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(topic.slug)}
            className={`rounded-2xl border-2 cursor-pointer p-4 transition-all duration-200 bg-white
              ${selectedTopic?.slug === topic.slug
                ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-lg"
                : "border-gray-200 hover:border-purple-300 hover:shadow-md"
              }`}
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${topic.color || "from-purple-400 to-pink-500"} flex items-center justify-center mb-2 shadow-md text-lg`}
            >
              {topic.icon || "📋"}
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">
              {topic.name}
            </h3>
            <p className="text-xs text-gray-500 leading-snug mb-2 line-clamp-2">
              {topic.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {(topic.frameworks || []).slice(0, 2).map((fw) => (
                <span
                  key={fw}
                  className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 border border-gray-200 whitespace-nowrap"
                >
                  {fw}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Any Topic card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelect("")}
        className="w-full rounded-2xl border-2 border-dashed border-gray-300 hover:border-purple-300 hover:bg-purple-50/40 cursor-pointer p-4 flex items-center gap-4 transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-lg shadow-md flex-shrink-0">
          🎲
        </div>
        <div>
          <h3 className="font-bold text-gray-700 text-sm">
            Any Topic — Surprise me!
          </h3>
          <p className="text-xs text-gray-400">
            A random consulting case from all 8 topics
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TopicSelectionGrid;
