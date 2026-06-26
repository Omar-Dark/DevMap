"use client";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2 } from "lucide-react";
import RoadmapApiAxiosInstance from "@/app/api/axiosInstance";
import { apiRoutes } from "@/app/api/apiRoutes";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "@/app/redux/Slices/userSlice";
import { ProfileImageUploaderProps } from "@/app/types/UI";

const ProfileImageUploader = ({ initialImage, setOpenImage, alt, setProfile }: ProfileImageUploaderProps) => {
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState<string>(initialImage || "");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        const res = await RoadmapApiAxiosInstance.put(apiRoutes.Users.uploadImage.route, formData, { headers: { "Content-Type": "multipart/form-data" } });
        if (res.data?.success) {
          setImageSrc(res.data.imageURL);
          setProfile((prev) => prev ? { ...prev, imageURL: res.data.imageURL } : prev);
          dispatch(updateUser({ imageURL: res.data.imageURL }));
          toast.success("Image uploaded successfully");
        } else { toast.error(res.data?.message || "Failed to upload image"); }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(axiosError.message || "Something went wrong");
      } finally { setLoading(false); }
    }
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      const res = await RoadmapApiAxiosInstance.delete(apiRoutes.Users.deleteImage.route);
      if (res.data?.success) {
        setImageSrc(initialImage ?? "");
        setProfile((prev) => prev ? { ...prev, imageURL: "" } : prev);
        dispatch(updateUser({ imageURL: "" }));
        toast.success("Image deleted successfully");
      } else { toast.error(res.data?.message || "Failed to delete image"); }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="relative shrink-0">
      <div
        onClick={() => setOpenImage(true)}
        className="w-20 h-20 rounded-full border-2 border-border cursor-pointer overflow-hidden hover:border-primary transition-colors"
      >
        <Image
          className="w-full h-full object-cover"
          alt={alt || "Profile Picture"}
          src={imageSrc}
          width={80}
          height={80}
        />
      </div>
      {imageSrc === initialImage ? (
        <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-secondary transition-colors border-2 border-background">
          {loading ? <Loader2 size={11} className="animate-spin text-white" /> : <Plus size={11} className="text-white" />}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <button
          onClick={handleDeleteImage}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-destructive/80 transition-colors border-2 border-background"
        >
          {loading ? <Loader2 size={11} className="animate-spin text-white" /> : <Trash2 size={11} className="text-white" />}
        </button>
      )}
    </div>
  );
};

export default ProfileImageUploader;
