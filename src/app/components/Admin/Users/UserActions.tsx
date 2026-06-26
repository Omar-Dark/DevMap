"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { GoShieldCheck } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { menuVariants } from "@/app/types/variants";
import { UserActionsProps } from "@/app/types/UI";
import { IoEyeOutline } from "react-icons/io5";

const UserActions = ({
  isOpen,
  onToggle,
  onClose,
  handleDelete,
  handleEditProfile,
  handleToggleRole,
  handleViewProfile,
}: UserActionsProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-muted transition-all cursor-pointer"
      >
        <FiMoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <ul className="text-sm">
              <li>
                <button
                  onClick={handleViewProfile}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-all w-full"
                >
                  <IoEyeOutline /> View Profile{" "}
                </button>
              </li>
              <li
                onClick={() => handleAction(handleEditProfile)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-all"
              >
                <MdModeEdit />
                Edit Profile
              </li>

              <li
                onClick={() => handleAction(handleToggleRole)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-all"
              >
                <GoShieldCheck />
                Toggle Role
              </li>

              <div className="h-px bg-border mx-2" />

              <li
                onClick={() => handleAction(handleDelete)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-all text-destructive"
              >
                <FaTrash />
                Delete User
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserActions;
