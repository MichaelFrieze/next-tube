"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

export const SuggestionsSection = ({
  videoId,
  isManual,
}: SuggestionsSectionProps) => {
  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const SuggestionsSectionSkeleton = () => {
  return (
    <>
      <div className="hidden space-y-3 md:block">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>...loading</div>
        ))}
      </div>
      <div className="block space-y-10 md:hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>...loading</div>
        ))}
      </div>
    </>
  );
};

const SuggestionsSectionSuspense = ({
  videoId,
  isManual,
}: SuggestionsSectionProps) => {
  console.log("videoId", videoId);
  console.log("isManual", isManual);

  return (
    <>
      <div>Suggestions</div>
      <div className="hidden space-y-3 md:block">
        {/* {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          )),
        )} */}
      </div>
      <div className="block space-y-10 md:hidden">
        {/* {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )} */}
      </div>
      {/* <InfiniteScroll
        isManual={isManual}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      /> */}
    </>
  );
};
