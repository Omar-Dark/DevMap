import { Variants } from "framer-motion";
export const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

export const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};
export const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export const floatingOrbs = [
  {
    size: "w-96 h-96",
    color: "bg-[rgb(0,255,255)]",
    pos: "-top-32 -left-32",
    delay: 0,
  },
  {
    size: "w-80 h-80",
    color: "bg-[rgb(166,77,255)]",
    pos: "-bottom-24 -right-24",
    delay: 1.5,
  },
  {
    size: "w-48 h-48",
    color: "bg-[rgb(255,51,187)]",
    pos: "top-1/2 left-2/3",
    delay: 0.8,
  },
];

export const unAuthorizedContainerVariants:Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const UnAuthorizedItemVariants:Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
