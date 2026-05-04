import { useNavigate } from "react-router-dom";
import { ExternalLink, LogIn, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuestCheckout: () => void;
}

export const CheckoutDialog = ({ open, onOpenChange, onGuestCheckout }: CheckoutDialogProps) => {
  const navigate = useNavigate();

  const goAuth = (mode: "signin" | "signup") => {
    onOpenChange(false);
    navigate(`/auth?mode=${mode}&redirect=/cart`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">결제 방법을 선택하세요</DialogTitle>
          <DialogDescription>
            로그인 후 결제하시면 주문 내역을 확인하실 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button size="lg" className="rounded-none justify-start" onClick={() => goAuth("signin")}>
            <LogIn className="mr-2 h-4 w-4" /> 로그인 후 결제
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-none justify-start"
            onClick={() => goAuth("signup")}
          >
            <UserPlus className="mr-2 h-4 w-4" /> 회원가입 후 결제
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-none justify-start"
            onClick={() => {
              onOpenChange(false);
              onGuestCheckout();
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" /> 비회원으로 결제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
