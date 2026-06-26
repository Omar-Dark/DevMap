import { convertToQueryString } from "../helper";
import { FiltersProps, QuestionsFilterProps } from "../types/api";
export const apiRoutes = {
  Auth: {
    login: {
      route: "/api/v1/auth/login",
    },
    signup: {
      route: "/api/v1/auth/signup",
    },
    logout: {
      route: "/api/v1/auth/logout",
    },
  },
  Users: {
    getProfile: {
      route: "/api/v1/users/profile",
    },
    updateProfile: {
      route: "/api/v1/users/profile",
    },
    deleteProfile: {
      route: "/api/v1/users/profile",
    },
    uploadImage: {
      route: `/api/v1/users/profile/upload-image`,
    },

    deleteImage: {
      route: `/api/v1/users/profile/delete-image`,
    },
    changePassword: {
      route: "/api/v1/users/profile/change-password",
    },
    getAllUsers: {
      route: (filters: FiltersProps) =>
        `/api/v1/users?${convertToQueryString(filters)}`,
    },
    getUserById: {
      route: (userId: string) => `/api/v1/users/${userId}`,
    },
    deleteUserById: {
      route: (userId: string) => `/api/v1/users/${userId}`,
    },
    updateUserById: {
      route: (userId: string) => `/api/v1/users/${userId}`,
    },
    toggleRole: {
      route: (userId: string) => `/api/v1/users/${userId}/role`,
    },
  },
  Quiz: {
    getAllQuizzes: {
      route: "/api/v1/quiz",
    },
    getQuizById: {
      route: (quizId: string) => `/api/v1/quiz/${quizId}`,
    },
    updateQuizById: {
      route: (quizId: string) => `/api/v1/quiz/${quizId}`,
    },
    deleteQuizById: {
      route: (quizId: string) => `/api/v1/quiz/${quizId}`,
    },
    createQuiz: {
      route: `/api/v1/quiz`,
    },
    exportQuizToPDF: {
      route: (quizId: string) => `api/v1/quiz/${quizId}/export/pdf`,
    },
    exportQuizToJSON: {
      route: (quizId: string) => `api/v1/quiz/${quizId}/export/pdf`,
    },
    exportQuizToCSV: {
      route: (quizId: string) => `api/v1/quiz/${quizId}/export/pdf`,
    },
  },
  Question: {
    getQuestionFromQuiz: {
      route: (quizId: string, questionId: string) =>
        `/api/v1/quiz/${quizId}/questions/${questionId}`,
    },
    updateQuestionFromQuiz: {
      route: (quizId: string, questionId: string) =>
        `/api/v1/quiz/${quizId}/questions/${questionId}`,
    },
    deleteQuestionFromQuiz: {
      route: (quizId: string, questionId: string) =>
        `/api/v1/quiz/${quizId}/questions/${questionId}`,
    },
    createQuestionFromQuiz: {
      route: (quizId: string) => `/api/v1/quiz/${quizId}/questions`,
    },
    submitQuizAnswers: {
      route: (quizId: string) => `/api/v1/quiz/${quizId}/questions/submit`,
    },
    restartQuizAnswers: {
      route: (quizId: string) => `/api/v1/quiz/${quizId}/questions/restart`,
    },
    getAllQuestionsByQuiz: {
      route: (quizId: string, filters: QuestionsFilterProps) =>
        `/api/v1/quiz/${quizId}/questions?${convertToQueryString(filters)}`,
    },
  },
  Roadmap: {
    getAllRoadmaps: {
      route: `/api/v1/roadmap`,
    },
    getRoadmapById: {
      route: (roadmapId: string) => `/api/v1/roadmap/${roadmapId}`,
    },
    updateRoadmapById: {
      route: (roadmapId: string) => `/api/v1/roadmap/${roadmapId}`,
    },
    deleteRoadmapById: {
      route: (roadmapId: string) => `/api/v1/roadmap/${roadmapId}`,
    },
    createRoadmap: {
      route: `/api/v1/roadmap`,
    },
    getProgress: {
      route: (roadmapId: string) => `/api/v1/roadmap/${roadmapId}/progress`,
    },
    exportRoadmapToPDF: {
      route: (roadmapId: string) =>
        `/api/v1/roadmap/${roadmapId}/progress/export/pdf`,
    },
    exportRoadmapToJSON: {
      route: (roadmapId: string) =>
        `/api/v1/roadmap/${roadmapId}/progress/export/json`,
    },
    exportRoadmapToCSV: {
      route: (roadmapId: string) =>
        `/api/v1/roadmap/${roadmapId}/progress/export/csv`,
    },
  },
  Section: {
    getAllRoadmapSections: {
      route: (roadmapId: string) => `/api/v1/roadmap/${roadmapId}/sections`,
    },
    createSectionToRoadmap: {
      route: (roadmapId: string) => `/api/v1/roadmap/${roadmapId}/sections`,
    },
    getSectionToRoadmap: {
      route: (roadmapId: string, sectionId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}`,
    },
    updateSectionToRoadmap: {
      route: (roadmapId: string, sectionId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}`,
    },
    deleteSectionToRoadmap: {
      route: (roadmapId: string, sectionId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}`,
    },
    toggleCompletionSection: {
      route: (roadmapId: string, sectionId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}/complete`,
    },
  },
  Resource: {
    getAllResourcesToSection: {
      route: (roadmapId: string, sectionId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}/resources`,
    },
    createResourceToRoadmap: {
      route: (roadmapId: string, sectionId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}/resources`,
    },
    getResourceByIdToRoadmap: {
      route: (roadmapId: string, sectionId: string, resourceId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}/resources/${resourceId}`,
    },
    updateResourceByIdToRoadmap: {
      route: (roadmapId: string, sectionId: string, resourceId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}/resources/${resourceId}`,
    },
    deleteResourceByIdToRoadmap: {
      route: (roadmapId: string, sectionId: string, resourceId: string) =>
        `/api/v1/roadmap/${roadmapId}/sections/${sectionId}/resources/${resourceId}`,
    },
  },
  Project: {
    getAllProjects: {
      route: (filters: FiltersProps) =>
        `/api/v1/project?${convertToQueryString(filters)}`,
    },
    createProject: {
      route: `/api/v1/project`,
    },
    getProjectById: {
      route: (projectId: string) => `/api/v1/project/${projectId}`,
    },
    updateProjectById: {
      route: (projectId: string) => `/api/v1/project/${projectId}`,
    },
    deleteProjectById: {
      route: (projectId: string) => `/api/v1/project/${projectId}`,
    },
    exportProjectToPDF: {
      route: (projectId: string) => `/api/v1/project/${projectId}/export/pdf`,
    },
    exportProjectToJSON: {
      route: (projectId: string) => `/api/v1/project/${projectId}/export/json`,
    },
    exportProjectToCSV: {
      route: (projectId: string) => `/api/v1/project/${projectId}/export/csv`,
    },
  },
  Steps: {
    getAllSteps: {
      route: (projectId: string) => `/api/v1/project/${projectId}/steps`,
    },
    createStep: {
      route: (projectId: string) => `/api/v1/project/${projectId}/steps`,
    },
    updateStep: {
      route: (projectId: string, stepId: string) =>
        `/api/v1/project/${projectId}/steps/${stepId}`,
    },
    toggleStep: {
      route: (projectId: string, stepId: string) =>
        `/api/v1/project/${projectId}/steps/${stepId}`,
    },
    deleteStep: {
      route: (projectId: string, stepId: string) =>
        `/api/v1/project/${projectId}/steps/${stepId}`,
    },
  },
  AI: {
    chat: {
      // Backend AI chat endpoint — uses same NEXT_PUBLIC_BASE_URL and x-api-key
      // Common patterns: /api/v1/ai/chat, /api/v1/chat, /api/v1/ai/message
      // The mobile app uses this same endpoint successfully
      route: `/api/v1/ai/chat`,
    },
  },
};
