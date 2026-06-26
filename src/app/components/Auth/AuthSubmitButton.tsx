"use client";
import { Loader2 } from "lucide-react";

const AuthSubmitButton = ({
  loading,
  onHandleSubmit,
  text,
}: {
  loading: boolean;
  onHandleSubmit: () => void;
  text: string;
}) => {
  return (
    <button
      onClick={onHandleSubmit}
      disabled={loading}
      className="btn-primary w-full py-3 rounded-xl justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <><Loader2 size={15} className="animate-spin" /> Processing...</>
      ) : (
        text
      )}
    </button>
  );
};

export default AuthSubmitButton;
