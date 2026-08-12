import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

// Quick counter animation component
function AnimatedCounter({ value }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
  className,
  iconClassName,
  sparkline,
}) {
  return (
    <div
      className={clsx(
        "relative group glass rounded-2xl border border-white/20 dark:border-white/5 hover:border-primary/50 shadow-sm p-6 flex flex-col justify-between hover:shadow-glow hover:-translate-y-1.5 transition-all duration-500 overflow-hidden",
        className,
      )}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />

      {/* Top Section */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
              <AnimatedCounter value={value} />
            </span>
          </div>
        </div>

        {Icon && (
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/50 dark:bg-black/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] border border-white/40 dark:border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
              iconClassName,
            )}
          >
            <Icon className="w-6 h-6 text-primary dark:text-primary-glow" />
          </div>
        )}
      </div>

      {/* Sparkline (optional placeholder) */}
      {sparkline && (
        <div className="h-10 w-full mb-4 relative z-10 flex items-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {sparkline.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="flex-1 bg-gradient-brand rounded-t-sm"
            />
          ))}
        </div>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50 relative z-10">
        {description && <p className="text-xs font-medium text-gray-500">{description}</p>}

        {trend && (
          <div className="flex items-center">
            {trend === "up" && (
              <div className="flex items-center text-[11px] font-bold text-[#01AC9F] bg-[#01AC9F]/10 px-2.5 py-1 rounded-full border border-[#01AC9F]/20 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                {trendValue}
              </div>
            )}
            {trend === "down" && (
              <div className="flex items-center text-[11px] font-bold text-[#FF6200] bg-[#FF6200]/10 px-2.5 py-1 rounded-full border border-[#FF6200]/20 shadow-sm">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                {trendValue}
              </div>
            )}
            {trend === "neutral" && (
              <div className="flex items-center text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                <Minus className="w-3.5 h-3.5 mr-1" />
                {trendValue}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
