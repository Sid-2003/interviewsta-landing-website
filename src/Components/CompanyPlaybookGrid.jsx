import { motion } from "framer-motion";

const TOPIC_LABELS = {
  growth_strategy:        "Growth Strategy",
  market_entry:           "Market Entry",
  operations:             "Operations",
  digital_transformation: "Digital Transformation",
  competitive_response:   "Competitive Response",
  profitability:          "Profitability",
  pricing_strategy:       "Pricing Strategy",
  mergers_acquisitions:   "M&A",
};

const CompanyPlaybookGrid = ({ companies, selectedCompany, onSelect }) => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {companies.map((company, idx) => (
          <motion.div
            key={company.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(company.slug)}
            className={`rounded-2xl border-2 cursor-pointer p-4 transition-all duration-200 bg-white
              ${selectedCompany?.slug === company.slug
                ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200 shadow-lg"
                : "border-gray-200 hover:border-orange-300 hover:shadow-md"
              }`}
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${company.color || "from-orange-400 to-red-500"} flex items-center justify-center mb-2 shadow-md text-lg`}
            >
              {company.icon || "🏢"}
            </div>

            {/* Funny tagline as heading */}
            <h3 className="font-bold text-gray-900 text-sm mb-0.5 leading-tight">
              {company.tagline}
            </h3>

            {/* Brand name as subtext */}
            <p className="text-xs text-orange-600 italic leading-snug mb-2">
              {company.name}
            </p>

            {/* Era + topic chips */}
            <div className="flex flex-wrap gap-1">
              {company.era && (
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 border border-gray-200 whitespace-nowrap">
                  {company.era}
                </span>
              )}
              {company.topic && (
                <span className="text-xs bg-orange-50 text-orange-600 rounded-full px-2 py-0.5 border border-orange-200 whitespace-nowrap">
                  {TOPIC_LABELS[company.topic] || company.topic}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Surprise me card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onSelect("")}
        className="w-full rounded-2xl border-2 border-dashed border-gray-300 hover:border-orange-300 hover:bg-orange-50/40 cursor-pointer p-4 flex items-center gap-4 transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-lg shadow-md flex-shrink-0">
          🎲
        </div>
        <div>
          <h3 className="font-bold text-gray-700 text-sm">
            Surprise Me — Pick a Random Company!
          </h3>
          <p className="text-xs text-gray-400">
            Any of the 8 real startup playbooks, chosen at random
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyPlaybookGrid;
