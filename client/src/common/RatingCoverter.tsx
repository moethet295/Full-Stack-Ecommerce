import { Star } from "lucide-react";

interface RatingCoverterProps {
  count: number;
}

function RatingCoverter({ count }: RatingCoverterProps) {
  return (
    <div className="flex gap-1 my-2">
      {Array.from({
        length: count > 5 ? 5 : count,
      }).map((_, i) => (
        <Star
          className="fill-yellow-400 text-yellow-400"
          key={i}
        />
      ))}
    </div>
  );
}

export default RatingCoverter;