"use client";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { adminTypeProps } from "@/app/types/admin";
import RoadmapsTab from "@/app/components/Admin/Roadmaps/RoadmapsTab";
import QuizzesTab from "@/app/components/Admin/Quizzes/QuizzesTab";
import UsersTab from "@/app/components/Admin/Users/UsersTab";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import UnauthorizedPage from "@/app/components/Auth/UnauthorizedPage";
import ProjectsTab from "@/app/components/Admin/Projects/ProjectsTab";
import AdminTabs from "@/app/components/Admin/AdminTabs";
import AdminPageLoading from "@/app/components/Admin/AdminPageLoading";

const Page = () => {
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.user
  );
  const [currentTab, setCurrentTab] = useState<adminTypeProps>("roadmaps");

  if (loading) return <AdminPageLoading />;
  if (!isAuthenticated || !user?.isAdmin) return <UnauthorizedPage mode="admin" />;

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage roadmaps, quizzes, users, and more
            </p>
          </div>
        </div>

        <AdminTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <div className="mt-6">
          {currentTab === "roadmaps" && <RoadmapsTab />}
          {currentTab === "quizzes" && <QuizzesTab />}
          {currentTab === "users" && <UsersTab />}
          {currentTab === "projects" && <ProjectsTab />}
        </div>
      </div>
    </div>
  );
};

export default Page;
