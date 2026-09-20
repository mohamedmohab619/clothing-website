"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SettingsTab() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in-50 duration-300">
      {/* Notifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Notification Preferences
        </h2>
        <p className="text-xs text-muted-foreground">
          Control how AVEN contacts you regarding orders and offers
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-3">
            <Checkbox id="notif-orders" defaultChecked />
            <div className="space-y-0.5 leading-none">
              <Label htmlFor="notif-orders" className="text-sm font-semibold cursor-pointer">
                Order & Shipping Updates
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive real-time tracking alerts and delivery notifications
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox id="notif-sales" defaultChecked />
            <div className="space-y-0.5 leading-none">
              <Label htmlFor="notif-sales" className="text-sm font-semibold cursor-pointer">
                Flash Sales & VIP Discounts
              </Label>
              <p className="text-xs text-muted-foreground">
                Be the first to hear about seasonal drops and up to 40% promotions
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox id="notif-restock" defaultChecked />
            <div className="space-y-0.5 leading-none">
              <Label htmlFor="notif-restock" className="text-sm font-semibold cursor-pointer">
                Restock & Back In Stock Alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Notifications when sold out sizes or favorited styles return
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="pt-6 border-t border-border space-y-4">
        <h3 className="text-lg font-bold text-foreground">Security & Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Current Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">New Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => toast.success("Password changed successfully")}
          className="text-xs uppercase tracking-wider font-semibold"
        >
          Update Password
        </Button>
      </div>
    </div>
  );
}
