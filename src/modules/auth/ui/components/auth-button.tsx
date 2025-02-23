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
import { ClapperboardIcon, UserCircle } from "lucide-react";

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
            <UserButton>
              <UserButton.MenuItems>
                {/* TODO: Add user profile menu button */}
                <UserButton.Link
                  label="Studio"
                  href="/studio"
                  labelIcon={<ClapperboardIcon className="size-4" />}
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
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
