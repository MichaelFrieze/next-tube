import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  // viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  // viewerReaction,
}: VideoReactionsProps) => {
  console.log("videoId", videoId);
  let viewerReaction: "like" | "dislike" | null = null;

  if (likes > dislikes) {
    viewerReaction = "like";
  }

  if (dislikes > likes) {
    viewerReaction = "dislike";
  }

  if (likes === dislikes) {
    viewerReaction = null;
  }

  return (
    <div className="flex flex-none items-center">
      <Button
        onClick={() => {}}
        disabled={false}
        variant="secondary"
        className="gap-2 rounded-l-full rounded-r-none pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => {}}
        disabled={false}
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
