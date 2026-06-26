"use client";

import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import { containerVariants } from "@/app/types/variants";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import { UsersProps, UserProps } from "@/app/types/api";
import { WindowProps } from "@/app/types/UI";
import { useDebounce } from "@/app/hooks/useDebounce";
import Image from "next/image";
import { BsArrowDown } from "react-icons/bs";

import Modal from "../../UI/Modal";
import ViewProfileModal from "./ViewProfileModal";
import EditProfileModal from "../../Profile/EditProfileModal";
import DeleteUserModal from "./DeleteUserModal";
import UsersTableLoading from "./UserTableLoading";
import UsersNotFound from "./UserNotFound";
import UserActions from "./UserActions";
import DropDownMenu from "../../UI/DropDownMenu";
import { roleTypeProps } from "@/app/types/admin";

const UsersTab = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [usersData, setUsersData] = useState<UsersProps | null>(null);
  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);

  const [editWindow, setEditWindow] = useState<WindowProps>({
    open: false,
    userId: "",
  });

  const [profileWindow, setProfileWindow] = useState<WindowProps>({
    open: false,
    userId: "",
  });

  const [deleteWindow, setDeleteWindow] = useState<WindowProps>({
    open: false,
    userId: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loadUsersLoading, setLoadUsersLoading] = useState(true);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [role, setRole] = useState<roleTypeProps>("select a role");

  const debouncedSearch = useDebounce(searchQuery, 1000);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const filters = {
          q: debouncedSearch,
          page: currentPage,
          limit: 10,
          ...(role !== "select a role" ? { isAdmin: role === "Admin" } : {}),
        };

        const res = await RoadmapApiAxiosInstance.get(
          apiRoutes.Users.getAllUsers.route(filters),
        );

        if (res.data.success) {
          setUsersData((prev) => {
            if (currentPage === 1 || !prev) {
              return res.data;
            }

            return {
              ...res.data,
              users: [
                ...prev.users,
                ...res.data.users.filter(
                  (newUser: UserProps) =>
                    !prev.users.some((u) => u._id === newUser._id),
                ),
              ],
            };
          });
        }
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        toast.error(
          axiosError.message || "Something went wrong",
        );
      } finally {
        setUserLoading(false);
        setLoadUsersLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch, currentPage, role]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, role]);

  const loadMoreUsers = () => {
    if ((usersData?.totalPages ?? 0) > currentPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleToggleRole = async (userId: string) => {
    try {
      const res = await RoadmapApiAxiosInstance.put(
        apiRoutes.Users.toggleRole.route(userId),
      );

      if (res.data.success) {
        setUsersData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            users: prev.users.map((user) =>
              user._id === userId ? { ...user, isAdmin: !user.isAdmin } : user,
            ),
          };
        });
        setOpenUserId(null);
      }

      toast.success(res.data.message);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        "Failed to toggle role: " + (axiosError.message || ""),
      );
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = usersData?.users.find((u) => u._id === userId) || null;
    setSelectedUser(user);
    setDeleteWindow({ open: true, userId });
    setOpenUserId(null);
  };

  const handleUpdateUser = (userId: string) => {
    const user = usersData?.users.find((u) => u._id === userId) || null;
    setSelectedUser(user);
    setEditWindow({ open: true, userId });
    setOpenUserId(null);
  };

  const handleViewProfile = (userId: string) => {
    const user = usersData?.users.find((u) => u._id === userId) || null;
    setSelectedUser(user);
    setProfileWindow({ open: true, userId });
    setOpenUserId(null);
  };

  return (
    <>
      {userLoading ? (
        <UsersTableLoading />
      ) : (
        <div className="p-8 rounded-3xl bg-card border border-border shadow-lg backdrop-blur-sm my-16 h-150 overflow-y-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 p-5 rounded-2xl bg-muted/40 border border-border">
            <h4 className="text-xl sm:text-2xl font-bold">
              All Users ({usersData?.totalUsers ?? 0})
            </h4>

            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <div className="relative group">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  placeholder="Search users..."
                  className="bg-background rounded-xl border border-border pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all w-64"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropDownMenu
                onChange={(value) =>
                  setRole(
                    value === "clear"
                      ? "select a role"
                      : (value as roleTypeProps),
                  )
                }
                option={role}
                optionList={["User", "Admin", "clear"]}
              />
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {usersData?.users.length === 0 ? (
              <UsersNotFound
                searchQuery={searchQuery}
                onReset={() => setSearchQuery("")}
              />
            ) : (
              usersData?.users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col sm:grid items-stretch sm:items-center sm:grid-cols-5 gap-4 sm:gap-0 p-4 rounded-2xl border border-border bg-background hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between sm:contents">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          user.imageURL ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={user.username || "user"}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border border-border object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.username}</span>
                        <span className="text-xs text-muted-foreground sm:hidden">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="sm:hidden">
                      <UserActions
                        isOpen={openUserId === user._id}
                        onToggle={() =>
                          setOpenUserId((prev) =>
                            prev === user._id ? null : (user._id ?? ""),
                          )
                        }
                        onClose={() => setOpenUserId(null)}
                        handleDelete={() => handleDeleteUser(user._id ?? "")}
                        handleEditProfile={() =>
                          handleUpdateUser(user._id ?? "")
                        }
                        handleToggleRole={() =>
                          handleToggleRole(user._id ?? "")
                        }
                        handleViewProfile={() =>
                          handleViewProfile(user._id ?? "")
                        }
                      />
                    </div>
                  </div>

                  <span className="hidden sm:block text-muted-foreground truncate">
                    {user.email}
                  </span>

                  <div className="flex items-center justify-between sm:justify-start">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold border w-fit ${
                        user.isAdmin
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>

                    <span className="text-xs text-muted-foreground sm:hidden">
                      {user.createdAt
                        ? new Date(user.createdAt).toDateString()
                        : ""}
                    </span>
                  </div>

                  <span className="hidden sm:block text-muted-foreground">
                    {user.createdAt
                      ? new Date(user.createdAt).toDateString()
                      : ""}
                  </span>

                  <div className="hidden sm:flex justify-end">
                    <UserActions
                      isOpen={openUserId === user._id}
                      onToggle={() =>
                        setOpenUserId((prev) =>
                          prev === user._id ? null : (user._id ?? ""),
                        )
                      }
                      onClose={() => setOpenUserId(null)}
                      handleDelete={() => handleDeleteUser(user._id ?? "")}
                      handleEditProfile={() => handleUpdateUser(user._id ?? "")}
                      handleToggleRole={() => handleToggleRole(user._id ?? "")}
                      handleViewProfile={() =>
                        handleViewProfile(user._id ?? "")
                      }
                    />
                  </div>
                </div>
              ))
            )}
          </motion.div>

          {usersData && currentPage < (usersData.totalPages ?? 0) && (
            <div className="flex justify-center my-8">
              <button
                onClick={loadMoreUsers}
                disabled={loadUsersLoading}
                className="group relative px-6 py-3 cursor-pointer rounded-2xl bg-primary text-white font-semibold shadow-md hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  {loadUsersLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Users
                      <BsArrowDown size={16} />
                    </>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {profileWindow.open && selectedUser && (
        <Modal
          title="User Profile"
          isOpen={profileWindow.open}
          onClose={() => setProfileWindow({ open: false, userId: "" })}
        >
          <ViewProfileModal user={selectedUser} />
        </Modal>
      )}

      {editWindow.open && selectedUser && (
        <Modal
          title="Edit User"
          isOpen={editWindow.open}
          onClose={() => setEditWindow({ open: false, userId: "" })}
        >
          <EditProfileModal
            profile={selectedUser}
            setUsersData={() => setUsersData}
            setEditProfile={(v) =>
              setEditWindow((prev) => ({
                ...prev,
                open: typeof v === "function" ? v(prev.open) : v,
              }))
            }
          />
        </Modal>
      )}

      {deleteWindow.open && selectedUser && (
        <Modal
          title="Delete User"
          isOpen={deleteWindow.open}
          onClose={() => setDeleteWindow({ open: false, userId: "" })}
        >
          <DeleteUserModal
            userId={deleteWindow.userId ?? ""}
            setUserData={() => setUsersData}
            onCancel={() => setDeleteWindow({ open: false, userId: "" })}
          />
        </Modal>
      )}
    </>
  );
};

export default UsersTab;
