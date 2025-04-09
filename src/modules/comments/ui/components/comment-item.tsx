import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentsGetManyOutput } from "../../types";

interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div>
      <div className="flex gap-4">
        <Link prefetch href={`/users/${comment.userId}`}>
          <UserAvatar
            size={"lg"}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link prefetch href={`/users/${comment.userId}`}>
            <div className="mb-0.5 flex items-center gap-2">
              <span className="pb-0.5 text-sm font-medium">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              <Button
                disabled={false}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => {}}
              >
                <ThumbsUpIcon className={cn("fill-black")} />
              </Button>
              <span className="text-xs text-muted-foreground">{0}</span>
              <Button
                disabled={false}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => {}}
              >
                <ThumbsDownIcon className={cn("fill-black")} />
              </Button>
              <span className="text-xs text-muted-foreground">{1}</span>
            </div>
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="s}ize-4" />
              Reply
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
