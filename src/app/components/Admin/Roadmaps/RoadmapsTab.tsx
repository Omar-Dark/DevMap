"use client";

import { FaPlus, FaRegFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FiChevronRight, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { difficultyStyle } from "../../Roadmap/RoadmapItem";
import ActiveModal from "./ActiveModal";
import {
  ActiveModalPayloadDataProps,
  ModalTypeProps,
  ActiveModalStateProps,
} from "@/app/types/admin";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { roadmapProps } from "@/app/types/api";
import QuizTabLoading from "../Quizzes/QuizTabLoading";
import { sectionDataProps } from "@/app/types/roadmap";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RoadmapsTab = () => {
  const [openRoadmap, setOpenRoadmap] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [roadmaps, setRoadmaps] = useState<roadmapProps[]>([]);
  const [sections, setSections] = useState<sectionDataProps[]>([]);
  const [activeModal, setActiveModal] = useState<ActiveModalStateProps>({
    type: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSections, setLoadingSections] = useState<boolean>(false);
  const toggleModal = (
    e: React.MouseEvent,
    payload?: ActiveModalPayloadDataProps,
    type?: ModalTypeProps,
  ) => {
    e.stopPropagation();
    setActiveModal({ type: type ? type : null, payload });
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await RoadmapApiAxiosInstance.get(
          apiRoutes.Roadmap.getAllRoadmaps.route,
        );
        if (res.data?.success) {
          setRoadmaps(res.data?.roadmap);
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
    fetchRoadmaps();
  }, []);

  const handleOpenRoadmap = async (
    isRoadmapOpen: boolean,
    roadmap: roadmapProps,
  ) => {
    setOpenRoadmap(isRoadmapOpen ? null : roadmap._id!);

    if (!roadmap._id) return;

    setLoadingSections(true);

    try {
      const res = await RoadmapApiAxiosInstance.get(
        apiRoutes.Section.getAllRoadmapSections.route(roadmap._id!),
      );
      if (res.data.success) {
        setSections(res.data?.sections);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.message || "Something went wrong");
    } finally {
      setLoadingSections(false);
    }
  };

  return (
    <>
      {loading ? (
        <QuizTabLoading />
      ) : (
        <div className="space-y-6 my-10">
          <div className="flex justify-between">
            <h4 className="sm:text-xl text-lg font-bold">Roadmaps</h4>
            <button
              onClick={(e) => toggleModal(e, undefined, "ADD_ROADMAP")}
              className="p-2 rounded-lg bg-primary text-white cursor-pointer hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <FaPlus /> New Roadmap
            </button>
          </div>

          {roadmaps.map((roadmap) => {
            const isRoadmapOpen = String(openRoadmap) === roadmap?._id;

            return (
              <motion.div
                key={roadmap?._id}
                layout
                className="rounded-2xl transition-all border bg-card text-card-foreground shadow-sm border-border"
              >
                <div
                  className="flex sm:items-center justify-between p-5 cursor-pointer flex-col sm:flex-row items-end gap-4"
                  onClick={() => handleOpenRoadmap(isRoadmapOpen, roadmap)}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: isRoadmapOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronRight size={25} />
                    </motion.div>

                    <div>
                      <h3 className="font-semibold text-base sm:text-xl hover:text-primary transition">
                        {roadmap?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {roadmap?.numberOfSections} sections
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground">
                    <FiEdit2
                      size={27}
                      onClick={(e) => toggleModal(e, roadmap, "EDIT_ROADMAP")}
                      className="hover:text-primary cursor-pointer rounded-lg hover:bg-primary/20 p-1 transition-all"
                    />
                    <FiTrash2
                      size={27}
                      onClick={(e) => toggleModal(e, roadmap, "DELETE_ROADMAP")}
                      className="hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/20 p-1 transition-all"
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isRoadmapOpen && (
                    <motion.div
                      key={`roadmap-content-${roadmap?._id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="px-5 pb-5 space-y-5">
                        {roadmap?.description && (
                          <p className="text-sm text-muted-foreground">
                            {roadmap?.description}
                          </p>
                        )}

                        {loadingSections ? (
                          <AiOutlineLoading3Quarters
                            className="w-6 h-6 animate-spin mx-auto my-5 text-primary font-bold"
                            size={25}
                          />
                        ) : (
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">
                              Sections ({sections?.length})
                            </h4>
                            <button
                              onClick={(e) =>
                                toggleModal(e, roadmap, "ADD_SECTION")
                              }
                              className="flex items-center gap-2 cursor-pointer border-border text-sm px-3 py-1.5 rounded-lg border hover:bg-muted transition"
                            >
                              <FiPlus size={14} /> Add Section
                            </button>
                          </div>
                        )}

                        <div className="space-y-4">
                          {sections?.map((section) => {
                            const isSectionOpen = openSection === section?._id;

                            return (
                              <motion.div
                                layout
                                key={section?._id}
                                className="rounded-xl border bg-muted/40 border-border"
                              >
                                <div
                                  className="flex justify-between items-center p-4 cursor-pointer flex-col sm:flex-row gap-5"
                                  onClick={() =>
                                    setOpenSection(
                                      isSectionOpen
                                        ? null
                                        : (section?._id ?? ""),
                                    )
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      animate={{
                                        rotate: isSectionOpen ? 90 : 0,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <FiChevronRight size={16} />
                                    </motion.div>

                                    <div>
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium">
                                          {section?.title}
                                        </span>
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded-full ${difficultyStyle(
                                            section.difficulty,
                                          )}`}
                                        >
                                          {section.difficulty}
                                        </span>
                                      </div>

                                      {section.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {section.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 text-muted-foreground">
                                    <FiEdit2
                                      size={25}
                                      onClick={(e) => {
                                        toggleModal(e, section, "EDIT_SECTION");
                                      }}
                                      className="hover:text-primary cursor-pointer rounded-lg hover:bg-primary/20 p-1 transition-all"
                                    />
                                    <FiTrash2
                                      size={25}
                                      onClick={(e) => {
                                        toggleModal(
                                          e,
                                          section,
                                          "DELETE_SECTION",
                                        );
                                      }}
                                      className="hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/20 p-1 transition-all"
                                    />
                                  </div>
                                </div>

                                <AnimatePresence initial={false}>
                                  {isSectionOpen && (
                                    <motion.div
                                      key={`section-content-${section._id}`}
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{
                                        height: "auto",
                                        opacity: 1,
                                      }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-6 pb-4 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                          <span className="text-muted-foreground">
                                            Resources (
                                            {section.resources.length})
                                          </span>

                                          <button
                                            onClick={(e) =>
                                              toggleModal(
                                                e,
                                                section,
                                                "ADD_RESOURCE",
                                              )
                                            }
                                            className="flex items-center gap-2 cursor-pointer border-border text-sm px-3 py-1.5 rounded-lg border hover:bg-muted transition"
                                          >
                                            <FiPlus size={14} /> Add
                                          </button>
                                        </div>

                                        <div className="space-y-2">
                                          {section.resources.map((resource) => (
                                            <motion.div
                                              key={resource._id}
                                              initial={{
                                                opacity: 0,
                                                y: 10,
                                              }}
                                              animate={{
                                                opacity: 1,
                                                y: 0,
                                              }}
                                              exit={{
                                                opacity: 0,
                                                y: 10,
                                              }}
                                              transition={{
                                                duration: 0.2,
                                              }}
                                              className="flex justify-between items-center p-3 rounded-lg bg-card border border-border flex-col sm:flex-row gap-5"
                                            >
                                              <div className="flex items-center gap-3 text-sm">
                                                <FaRegFileAlt className="text-primary" />
                                                {resource?.title}
                                              </div>

                                              <div className="flex items-center gap-3 text-muted-foreground">
                                                <FiEdit2
                                                  size={22}
                                                  onClick={(e) => {
                                                    toggleModal(
                                                      e,
                                                      {
                                                        _id: resource?._id,
                                                        sectionId: section?._id,
                                                        roadmapId: roadmap?._id,
                                                        title: resource?.title,
                                                        url: resource?.url,
                                                        type: resource?.type,
                                                      },
                                                      "EDIT_RESOURCE",
                                                    );
                                                  }}
                                                  className="hover:text-primary cursor-pointer rounded-lg hover:bg-primary/20 p-1 transition-all"
                                                />
                                                <FiTrash2
                                                  size={22}
                                                  onClick={(e) =>
                                                    toggleModal(
                                                      e,
                                                      {
                                                        _id: resource?._id,
                                                        sectionId: section?._id,
                                                        roadmapId: roadmap?._id,
                                                      },
                                                      "DELETE_RESOURCE",
                                                    )
                                                  }
                                                  className="hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/20 p-1 transition-all"
                                                />
                                              </div>
                                            </motion.div>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <ActiveModal
        setRoadmaps={setRoadmaps}
        setSections={setSections}
        modal={activeModal}
        onClose={() => setActiveModal({ type: null })}
      />
    </>
  );
};
export default RoadmapsTab;
