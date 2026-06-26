import { apiRoutes } from "@/app/api/apiRoutes";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { DeleteUserModalProps } from "@/app/types/admin";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const DeleteUserModal = ({
  onCancel,
  setUserData,
  userId,
}: DeleteUserModalProps) => {
  const handleDeleteUser = async () => {
    try {
      await RoadmapApiAxiosInstance.delete(
        apiRoutes.Users.deleteUserById.route(userId),
      );
      setUserData((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user._id !== userId),
      }));
      toast.success("User deleted successfully");
      onCancel((prev) => ({ ...prev, open: false }));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.message || "Something went wrong");
      console.error("Failed to delete user:", error);
    }
  };
  return (
    <div>
      <p className="text-lg sm:text-xl font-bold text-center">
        Are you sure you want to delete this user
      </p>
      <div className="flex justify-end items-center gap-4 mt-5">
        <button
          onClick={() => onCancel((prev) => ({ ...prev, open: false }))}
          className="px-5 py-2.5 cursor-pointer rounded-xl border border-border bg-card text-foreground font-medium transition-all duration-200 hover:bg-border active:scale-95"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteUser}
          className="px-5 py-2.5 cursor-pointer rounded-xl bg-destructive text-destructive-foreground font-semibold shadow-md transition-all duration-200 hover:bg-destructive/90 hover:shadow-lg active:scale-95"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default DeleteUserModal;
