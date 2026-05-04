import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      type="button"
      size="lg"
      className="rounded-none"
      onClick={() => navigate("/")}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      홈으로
    </Button>
  );
};
