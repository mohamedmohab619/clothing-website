"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "../types";
import { Button } from "@/components/ui/button";

interface PresonalTabProps {
  user: UserData,
}

export function PersonalTab({ user }: PresonalTabProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs animate-in fade-in-50 duration-300">
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Personal Information
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your account details and profile information
        </p>
      </div>

      {/* TODO: implement function */}
      <form onSubmit={() => { }} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-xs font-semibold">
              First Name
            </Label>
            <Input
              id="firstName"
              value={user.name}
              placeholder="First Name"
              required
            />
          </div>
          {/* <div className="space-y-1.5"> */}
          {/*   <Label htmlFor="lastName" className="text-xs font-semibold"> */}
          {/*     Last Name */}
          {/*   </Label> */}
          {/*   <Input */}
          {/*     id="lastName" */}
          {/*     value={lastName} */}
          {/*     placeholder="Last Name" */}
          {/*     required */}
          {/*   /> */}
          {/* </div> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={""}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="birthDate" className="text-xs font-semibold">
              Date of Birth
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={""}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button type="submit" size="lg" className="uppercase tracking-wider font-semibold text-xs px-8">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
