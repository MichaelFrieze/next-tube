"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { UserCircle } from "lucide-react";

export const AuthButton = () => {
  // TODO: add different auth states
  return (
    <>
      <ClerkLoading>
        <div>
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <div className="h-7 w-7">
            <UserButton />
            {/* TODO: add menu items for studio and user profile */}
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500"
            >
              <UserCircle />
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
      </ClerkLoaded>
    </>
  );
};
