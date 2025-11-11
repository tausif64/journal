"use client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  location?: string;
  onClick?: () => void;
}

const BackButton = ({ location, onClick }: BackButtonProps) => {
  const navigate = useRouter();

  const handleClick = () => {
    if (location && location.length > 0) {
      navigate.push(location);
    } else {
      navigate.back();
    }
    // ✅ Only call onClick if it was passed
    onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm cursor-pointer"
    >
      <ArrowLeft className="size-4" />
      <span className="hidden sm:inline">Back</span>
    </Button>
  );
};

export default BackButton;
