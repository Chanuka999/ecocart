import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`p-0 w-6 h-6 ${
            handleRatingChange
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          }`}
          variant="ghost"
          onClick={
            handleRatingChange ? () => handleRatingChange(star) : undefined
          }
        >
          <StarIcon
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-primary text-primary"
                : "fill-muted stroke-muted-foreground"
            }`}
          />
        </Button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
