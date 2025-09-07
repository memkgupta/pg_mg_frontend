"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const messages = [
  {
    id: 1,
    sender: "Tenant: Rahul Sharma",
    subject: "Pending Rent Reminder",
    body: "Your rent for September is due. Please pay soon.",
    type: "rent",
    status: "unread",
    createdAt: "2025-09-05",
  },
  {
    id: 2,
    sender: "Tenant: Priya Singh",
    subject: "Maintenance Request",
    body: "The ceiling fan in Room 203 is not working.",
    type: "maintenance",
    status: "read",
    createdAt: "2025-09-04",
  },
  {
    id: 3,
    sender: "System",
    subject: "Backup Completed",
    body: "Your database backup was successfully created.",
    type: "system",
    status: "unread",
    createdAt: "2025-09-03",
  },
];

export default function InboxPage() {
  const [filter, setFilter] = useState("all");

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) => msg.type === filter);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📥 Admin Inbox</h1>

      <Tabs defaultValue="all" onValueChange={(val) => setFilter(val)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="tenant">Tenant</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <div className="grid gap-4">
            {filteredMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`${
                  msg.status === "unread" ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold">{msg.subject}</h2>
                    <span className="text-xs text-gray-500">
                      {msg.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{msg.body}</p>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">
                      From: {msg.sender}
                    </span>
                    <Button size="sm" variant="outline">
                      Mark as {msg.status === "unread" ? "Read" : "Unread"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
