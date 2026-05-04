import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors text-sm h-11"
    >
      <ArrowLeft className="h-4 w-4" />
      뒤로 가기
    </button>
  );
};
