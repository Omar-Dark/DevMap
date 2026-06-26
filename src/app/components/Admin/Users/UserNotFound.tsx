"use client";

import { UsersNotFoundProps } from "@/app/types/UI";
import { motion } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";

const UsersNotFound = ({ searchQuery, onReset }: UsersNotFoundProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl"></div>
        <div className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center border border-border shadow-lg">
          <IoSearchOutline size={28} className="text-accent-foreground" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">
        No Users Found
      </h3>

      <p className="text-muted-foreground mt-2 max-w-md">
        {searchQuery
          ? `We couldn't find any users matching "${searchQuery}".`
          : "There are currently no users available."}
      </p>

      {searchQuery && (
        <button
          onClick={onReset}
          className="mt-6 px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          Clear Search
        </button>
      )}
    </motion.div>
  );
};

export default UsersNotFound;
