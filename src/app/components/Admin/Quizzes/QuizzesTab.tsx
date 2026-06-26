"use client";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { FiChevronRight, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { ActiveQuizModalStateProps } from "@/app/types/admin";
import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { quizProps } from "@/app/types/roadmap";
import QuizTabLoading from "./QuizTabLoading";
import ActiveQuizModal from "./ActiveQuizModal";
import { QuestionProps } from "@/app/types/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import NotFoundQuestions from "./NotFoundQuestions";
const QuizzesTab = () => {
  const [openQuiz, setOpenQuiz] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [activeModal, setActiveModal] =
    useState<ActiveQuizModalStateProps | null>(null);
  const [Quizzes, setQuizzes] = useState<quizProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [Questions, setQuestions] = useState<QuestionProps>({
    page: 0,
    questions: [],
    totalPages: 0,
    totalQuestions: 0,
  });
  const [noQuestionsFound, setNoQuestionsFound] = useState<boolean>(false);
  const [loadingMoreMap, setLoadingMoreMap] = useState<Record<string, boolean>>(
    {},
  );
  const [pageMap, setPageMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await RoadmapApiAxiosInstance.get(
          apiRoutes.Quiz.getAllQuizzes.route,
        );
        if (res.data.success) {
          setQuizzes(res.data?.quizData);
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.message || "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleLoadMoreQuestions = async (quizId: string) => {
    if (!quizId || loadingMoreMap[quizId]) return;

    const nextPage = (pageMap[quizId] || 1) + 1;

    setLoadingMoreMap((prev) => ({
      ...prev,
      [quizId]: true,
    }));

    try {
      const res = await RoadmapApiAxiosInstance.get(
        apiRoutes.Question.getAllQuestionsByQuiz.route(quizId, {
          page: nextPage,
        }),
      );

      if (res.data.success) {
        setQuestions((prev) => {
          if (!prev) return res.data;

          return {
            ...res.data,
            questions: [
              ...(prev?.questions || []),
              ...(res.data?.questions || []),
            ],
          };
        });

        setPageMap((prev) => ({
          ...prev,
          [quizId]: nextPage,
        }));
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.message || "Something went wrong");
    } finally {
      setLoadingMoreMap((prev) => ({
        ...prev,
        [quizId]: false,
      }));
    }
  };

  const handleOpenQuiz = async (isQuizOpen: boolean, quiz: quizProps) => {
    setOpenQuiz(isQuizOpen ? null : quiz._id!);

    if (!quiz._id) return;

    setLoadingQuestions(true);
    setNoQuestionsFound(false);

    try {
      const res = await RoadmapApiAxiosInstance.get(
        apiRoutes.Question.getAllQuestionsByQuiz.route(quiz._id!, {}),
      );

      if (res.data.success) {
        setQuestions(res.data);

        setPageMap((prev) => ({
          ...prev,
          [quiz._id!]: res.data.page || 1,
        }));
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response?.status === 404) {
        setNoQuestionsFound(true);
        setQuestions({
          page: 1,
          questions: [],
          totalPages: 0,
          totalQuestions: 0,
        });
      }
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (loading) return <QuizTabLoading />;

  return (
    <>
      <div className="flex flex-col gap-5 my-20">
        <div className="flex justify-between items-center ">
          <h4 className="sm:text-xl text-lg font-bold">
            Quizzes ({Quizzes?.length})
          </h4>
          <button
            onClick={() => setActiveModal({ type: "ADD_QUIZ" })}
            className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <FaPlus /> New Quiz
          </button>
        </div>
        {Quizzes?.map((quiz) => {
          const isQuizOpen = openQuiz === quiz?._id;
          const selectedQuestion = Questions?.questions.find(
            (q) => q.quizId === quiz?._id,
          );
          return (
            <motion.div
              key={quiz?._id}
              layout
              className="rounded-2xl transition-all border bg-card text-card-foreground shadow-sm border-border"
            >
              <div
                className="flex sm:items-center justify-between p-5 cursor-pointer flex-col sm:flex-row items-end gap-4"
                onClick={() => handleOpenQuiz(isQuizOpen, quiz)}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isQuizOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronRight size={25} />
                  </motion.div>

                  <div>
                    <h3 className="font-semibold text-base sm:text-xl hover:text-primary transition">
                      {quiz?.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                  <FiEdit2
                    size={27}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal({ type: "EDIT_QUIZ", payload: quiz });
                    }}
                    className="hover:text-primary cursor-pointer rounded-lg hover:bg-primary/20 p-1 transition-all"
                  />
                  <FiTrash2
                    size={27}
                    onClick={() =>
                      setActiveModal({ type: "DELETE_QUIZ", payload: quiz })
                    }
                    className="hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/20 p-1 transition-all"
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isQuizOpen && (
                  <motion.div
                    key="roadmap-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="px-5 pb-5 space-y-5">
                      {quiz.description && (
                        <p className="text-sm text-muted-foreground">
                          {quiz.description}
                        </p>
                      )}

                      {loadingQuestions ? (
                        <AiOutlineLoading3Quarters
                          className="w-6 h-6 animate-spin mx-auto my-5 text-primary font-bold"
                          size={25}
                        />
                      ) : noQuestionsFound ? (
                        <NotFoundQuestions
                          onAddQuestion={() =>
                            setActiveModal({
                              type: "ADD_QUESTION",
                              payload: {
                                quizId: quiz?._id,
                                question: selectedQuestion?._id,
                                title: selectedQuestion?.question,
                                answers: selectedQuestion?.answers,
                                correctAnswer: selectedQuestion?.answer,
                              },
                            })
                          }
                        />
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">
                              Question ({Questions?.totalQuestions})
                            </h4>
                            <button
                              onClick={() =>
                                setActiveModal({
                                  type: "ADD_QUESTION",
                                  payload: {
                                    quizId: quiz?._id,
                                    question: selectedQuestion?._id,
                                    title: selectedQuestion?.question,
                                    answers: selectedQuestion?.answers,
                                    correctAnswer: selectedQuestion?.answer,
                                  },
                                })
                              }
                              className="flex items-center gap-2 cursor-pointer border-border text-sm px-3 py-1.5 rounded-lg border hover:bg-muted transition"
                            >
                              <FiPlus size={14} /> Add Question
                            </button>
                          </div>
                          <div className="space-y-4">
                            {Questions?.questions?.map((question, i) => {
                              const isQuestionOpen =
                                openQuestion === question?._id;
                              return (
                                <motion.div
                                  layout
                                  key={i}
                                  className="rounded-xl border bg-muted/40 border-border"
                                >
                                  <div
                                    className="w-full p-4 "
                                    onClick={() =>
                                      setOpenQuestion(
                                        isQuestionOpen ? null : question._id!,
                                      )
                                    }
                                  >
                                    <div>
                                      <div>
                                        <div className="flex items-center sm:gap-1 justify-between flex-col sm:flex-row gap-4">
                                          <div className="flex sm:gap-1 items-center flex-col sm:flex-row gap-4">
                                            <span className="font-bold w-8 h-8 flex items-center justify-center border border-border rounded-full p-2">
                                              {i + 1}
                                            </span>
                                            <span className="font-medium text-center sm:text-left">
                                              {question?.question}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-4 text-muted-foreground">
                                            <FiEdit2
                                              size={25}
                                              onClick={() =>
                                                setActiveModal({
                                                  type: `EDIT_QUESTION`,
                                                  payload: question,
                                                })
                                              }
                                              className="hover:text-primary cursor-pointer rounded-lg hover:bg-primary/20 p-1 transition-all"
                                            />
                                            <FiTrash2
                                              onClick={() =>
                                                setActiveModal({
                                                  type: `DELETE_QUESTION`,
                                                  payload: question,
                                                })
                                              }
                                              size={25}
                                              className="hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/20 p-1 transition-all"
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-5 justify-items-center w-full">
                                          {question?.options?.map(
                                            (option, i) => (
                                              <div
                                                key={i}
                                                className={`w-full text-sm cursor-pointer text-center sm:text-left sm:text-base text-muted-foreground font-bold p-2 hover:bg-muted transition-all rounded-lg ${option === question.answer && "text-primary bg-primary/20 hover:bg-primary/30"}`}
                                              >
                                                {option}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                          {(pageMap[quiz._id!] || 1) <
                            (Questions?.totalPages ?? 0) && (
                            <button
                              onClick={() => handleLoadMoreQuestions(quiz._id!)}
                              className="p-2 rounded-lg text-white bg-primary mx-auto my-5 w-full max-w-xs block font-bold cursor-pointer hover:bg-primary/80 transition-all"
                            >
                              Load More Questions
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      {activeModal && (
        <ActiveQuizModal
          setQuestions={setQuestions}
          setQuizzes={setQuizzes}
          modal={activeModal!}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
};

export default QuizzesTab;
