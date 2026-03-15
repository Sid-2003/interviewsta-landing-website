import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { djangoClient } from "../../api/client";

const FALLBACK_TOPICS = [
  { topic_slug: "profitability",          topic_name: "Profitability",          topic_icon: "📉" },
  { topic_slug: "market_entry",           topic_name: "Market Entry",           topic_icon: "🌍" },
  { topic_slug: "growth_strategy",        topic_name: "Growth Strategy",        topic_icon: "📈" },
  { topic_slug: "mergers_acquisitions",   topic_name: "M&A",                    topic_icon: "🤝" },
  { topic_slug: "pricing_strategy",       topic_name: "Pricing Strategy",       topic_icon: "💲" },
  { topic_slug: "operations",             topic_name: "Operations",             topic_icon: "⚙️" },
  { topic_slug: "competitive_response",   topic_name: "Competitive Response",   topic_icon: "⚔️" },
  { topic_slug: "digital_transformation", topic_name: "Digital Transformation", topic_icon: "💡" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value ?? "—"}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TopicPerformanceDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    djangoClient
      .get("/case-study-performance/")
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load topic performance data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center animate-pulse">
        <p className="text-gray-400 text-sm">Loading topic performance…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  // Build radar chart data — merge attempted topics with all 8 topics for full radar shape
  const attemptedMap = Object.fromEntries(data.map((d) => [d.topic_slug, d]));
  const radarData = FALLBACK_TOPICS.map((t) => {
    const entry = attemptedMap[t.topic_slug];
    return {
      topic: t.topic_name,
      icon: t.topic_icon,
      avg_score: entry?.avg_score ?? null,
      avg_framework_adherence: entry?.avg_framework_adherence ?? null,
      attempts: entry?.attempts ?? 0,
    };
  });

  const hasAnyData = data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Consulting Topic Performance</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {hasAnyData
              ? `${data.length} of 8 topics attempted`
              : "No case study topics attempted yet"}
          </p>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      {!hasAnyData ? (
        <div className="p-10 text-center">
          <p className="text-gray-400 text-sm">
            Complete a Case Study interview with a specific topic to see your performance breakdown here.
          </p>
          <a
            href="/video-interview"
            className="inline-block mt-4 text-purple-600 hover:text-purple-700 text-sm font-semibold underline"
          >
            Start a Case Study Interview →
          </a>
        </div>
      ) : (
        <div className="p-6">
          {/* Radar Chart */}
          <div className="h-72 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickCount={5}
                />
                <Radar
                  name="Avg Score"
                  dataKey="avg_score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.25}
                  dot={{ r: 3, fill: "#8b5cf6" }}
                />
                <Radar
                  name="Framework Mastery"
                  dataKey="avg_framework_adherence"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.15}
                  dot={{ r: 3, fill: "#f97316" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Topic attempt cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {radarData.map((t) => (
              <div
                key={t.topic}
                className={`rounded-xl border p-3 text-center transition-all ${
                  t.attempts > 0
                    ? "border-purple-200 bg-purple-50/50"
                    : "border-gray-100 bg-gray-50 opacity-50"
                }`}
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <p className="text-xs font-semibold text-gray-700 leading-tight">{t.topic}</p>
                {t.attempts > 0 ? (
                  <>
                    <p className="text-lg font-bold text-purple-700 mt-1">{t.avg_score}%</p>
                    <p className="text-xs text-gray-400">{t.attempts} attempt{t.attempts !== 1 ? "s" : ""}</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Not attempted</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
