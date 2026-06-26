import { UserProps } from "@/app/types/api";
import Image from "next/image";
import { FaUserShield } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdCalendarToday, MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

const ViewProfileModal = ({ user }: { user: UserProps | null }) => {
  const roadmapCount = user?.progressData.roadmap.length;
  const projectCount = user?.progressData.project.length;
  const quizCount = user?.progressData.quiz.length;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-col sm:flex-row">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border">
          <Image
            src={
              user?.imageURL ??
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={user?.username || "user"}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {user?.username || "No username"}
            {user?.isAdmin ? (
              <FaUserShield className="text-primary" size={14} />
            ) : (
              <FaUser size={14} className="text-muted-foreground" />
            )}
          </h3>

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MdEmail size={14} />
            {user?.email || "No email"}
          </p>

          {user?.createdAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <MdCalendarToday size={12} />
              Joined {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {user?.bio && (
        <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground">
          {user?.bio}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
          <p className="text-lg font-semibold">{roadmapCount}</p>
          <p className="text-xs text-muted-foreground">Roadmaps</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
          <p className="text-lg font-semibold">{projectCount}</p>
          <p className="text-xs text-muted-foreground">Projects</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
          <p className="text-lg font-semibold">{quizCount}</p>
          <p className="text-xs text-muted-foreground">Quizzes</p>
        </div>
      </div>

      {quizCount! > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Latest Quiz</h4>

          {user?.progressData.quiz.slice(0, 1).map((quiz, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border p-4 bg-card shadow-sm"
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">{quiz.grade}</span>
                <span className="text-muted-foreground">
                  {quiz.percentage}%
                </span>
              </div>

              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>✔ {quiz.correctAnswers}</span>
                <span>✖ {quiz.wrongAnswers}</span>
                <span>{quiz.totalQuestions} Questions</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProfileModal;
