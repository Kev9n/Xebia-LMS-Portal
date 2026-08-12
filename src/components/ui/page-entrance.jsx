import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Staged fade+slide entrance for page sections on load.
 * @param {{ className?: string, as?: keyof typeof motion, children: React.ReactNode }} props
 */
export function PageEntrance({ className, as = "div", children }) {
  const Component = motion[as] ?? motion.div;
  return (
    <Component variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </Component>
  );
}

export function PageEntranceItem({ className, as = "div", children }) {
  const Component = motion[as] ?? motion.div;
  return (
    <Component variants={item} className={className}>
      {children}
    </Component>
  );
}
