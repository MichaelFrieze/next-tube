import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";

import { VideoGetOneOutput } from "../../types";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId, isLoaded } = useAuth();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link prefetch href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <div className="flex min-w-0 flex-col gap-1">
            <UserInfo size="lg" name={user.name} />
            <span className="line-clamp-1 text-sm text-muted-foreground">
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {clerkUserId === user.clerkId ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link prefetch href={`/studio/videos/${videoId}`}>
            Edit video
          </Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={user.viewerSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
};
