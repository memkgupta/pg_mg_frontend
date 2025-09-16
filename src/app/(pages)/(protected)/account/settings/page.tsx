"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NotificationPreferencesPage = () => {
  // ✅ Dummy Data
  const dummyPrefs = {
    enabledChannels: ["EMAIL", "PUSH"],
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    maxPerDay: 30,
    maxPerWeek: 120,
    fallbackChannel: "SMS",
    locale: "en",
    timezone: "Asia/Kolkata",
    providerPreferences: { SMS: "TWILIO", EMAIL: "SES" },
  };

  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState<any>(dummyPrefs);

  useEffect(() => {
    setForm(dummyPrefs); // preload dummy data
  }, []);

  const handleChannelToggle = (channel: string) => {
    setForm((prev: any) => {
      const exists = prev.enabledChannels.includes(channel);
      return {
        ...prev,
        enabledChannels: exists
          ? prev.enabledChannels.filter((c: string) => c !== channel)
          : [...prev.enabledChannels, channel],
      };
    });
  };

  const handleSubmit = async () => {
    setIsPending(true);
    setTimeout(() => {
      console.log("Saved Preferences:", form);
      alert("Preferences updated ✅ (dummy save)");
      setIsPending(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Notification Channels */}
          <div>
            <Label className="mb-2 block">Enabled Channels</Label>
            <div className="flex flex-wrap gap-4">
              {["EMAIL", "SMS", "PUSH", "WHATSAPP"].map((ch) => (
                <div key={ch} className="flex items-center space-x-2">
                  <Checkbox
                    checked={form.enabledChannels.includes(ch)}
                    onCheckedChange={() => handleChannelToggle(ch)}
                  />
                  <span>{ch}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div className="flex space-x-6">
            <div>
              <Label>Quiet Hours Start</Label>
              <Input
                type="time"
                value={form.quietHoursStart || ""}
                onChange={(e) => setForm({ ...form, quietHoursStart: e.target.value })}
              />
            </div>
            <div>
              <Label>Quiet Hours End</Label>
              <Input
                type="time"
                value={form.quietHoursEnd || ""}
                onChange={(e) => setForm({ ...form, quietHoursEnd: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* Limits */}
          <div className="flex space-x-6">
            <div>
              <Label>Max per Day</Label>
              <Input
                type="number"
                value={form.maxPerDay}
                onChange={(e) => setForm({ ...form, maxPerDay: +e.target.value })}
              />
            </div>
            <div>
              <Label>Max per Week</Label>
              <Input
                type="number"
                value={form.maxPerWeek}
                onChange={(e) => setForm({ ...form, maxPerWeek: +e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* Fallback Channel */}
          <div>
            <Label>Fallback Channel</Label>
            <Select
              value={form.fallbackChannel || ""}
              onValueChange={(val) => setForm({ ...form, fallbackChannel: val })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                {["EMAIL", "SMS", "PUSH", "WHATSAPP"].map((ch) => (
                  <SelectItem key={ch} value={ch}>
                    {ch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Locale & Timezone */}
          <div className="flex space-x-6">
            <div>
              <Label>Locale</Label>
              <Input
                value={form.locale}
                onChange={(e) => setForm({ ...form, locale: e.target.value })}
              />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferencesPage;
