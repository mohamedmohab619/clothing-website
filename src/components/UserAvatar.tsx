"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconAnkh, IconCreditCard, IconDashboard, IconLogout, IconNotification, IconUserCircle, IconUsers } from "@tabler/icons-react";
import { ShieldUser, User } from "lucide-react";


export function UserAvatar() {
  const { data: session, isPending: loading } = authClient.useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    authClient.admin.hasPermission({ permissions: { user: ['list'] } }).then((data) => {
      if (data.data?.success) {
        setIsAdmin(true);
      }
    });
  }, []);

  if (loading) {
    return (
      <Skeleton className="h-8 w-8 rounded-lg" />
    );
  }

  if (session == null) {
    return (
      <Link
        href="/auth"
        className={cn(
          buttonVariants({ size: "sm" }),
          "rounded-lg px-4 tracking-wide"
        )}
      >
        Sign Up
      </Link>
    );
  }

  function handleLogout() {
    authClient.signOut();
    router.push("/");
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="cursor-pointer">
        {/* <Avatar className="h-8 w-8 rounded-lg grayscale"> */}
        {/*   <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
        {/* </Avatar> */}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="user"
          className="relative"
        >
          <User className="size-5" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <div className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session.user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Profile Button */}
          <DropdownMenuItem className="cursor-pointer" render={<Link href="/profile" />}>
            <IconUserCircle />
            Profile
          </DropdownMenuItem>


          {/* Organizations Button */}
          <DropdownMenuItem className="cursor-pointer" render={<Link href="/organizations" />}>
            <IconUsers />
            Organizations
          </DropdownMenuItem>

          {/* Admin Button */}
          {/* {isAdmin && */}
          {/*   <DropdownMenuItem className="cursor-pointer" asChild> */}
          {/*     <Link href="/admin"> */}
          {/*       <ShieldUser /> */}
          {/*       Admin */}
          {/*     </Link> */}
          {/*   </DropdownMenuItem> */}
          {/* } */}

          <DropdownMenuItem className="cursor-pointer">
            <IconCreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <IconNotification />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleLogout}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
