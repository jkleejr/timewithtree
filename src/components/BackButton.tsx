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
      홈으로
    </Button>
  );
};
