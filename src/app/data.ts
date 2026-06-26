import { BiTrophy, BiBrain } from "react-icons/bi";
import { IoBookOutline } from "react-icons/io5";
import { FiTarget, FiUsers, FiZap } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { FaRegMap } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { LiaProjectDiagramSolid } from "react-icons/lia";

export const features = [
  {
    icon: IoBookOutline,
    title: "Curated Learning Paths",
    description:
      "Structured roadmaps with hand-picked resources from industry experts",
  },
  {
    icon: BiTrophy,
    title: "Track Your Progress",
    description:
      "Visual progress tracking, achievements, and milestones to keep you motivated",
  },
  {
    icon: BiBrain,
    title: "Comprehensive Quizzes",
    description:
      "Test your knowledge with quizzes and detailed mistake reviews",
  },
  {
    icon: FiTarget,
    title: "Real Resources",
    description: "Access curated articles, videos, and documentation",
  },
  {
    icon: FiZap,
    title: "AI Assistant",
    description:
      "Get personalized help and suggestions from our intelligent chatbot",
  },
  {
    icon: BiUser,
    title: "Join the Community",
    description: "Compete on leaderboards and share your achievements",
  },
];

export const adminTabs = [
  {
    id: "roadmaps",
    label: "Roadmaps",
    icon: FaRegMap,
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: IoMdHelpCircleOutline,
  },
  {
    id: "users",
    label: "Users",
    icon: FiUsers,
  },
  {
    id: "projects",
    label: "Projects",
    icon: LiaProjectDiagramSolid,
  },
];

export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
