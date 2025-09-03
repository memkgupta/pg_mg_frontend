import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import { AlertTriangle, Bed, CalendarClock, Home, Inbox, Wallet } from "lucide-react";

export function FloatingDockDemo() {
const links = [
  {
    title: "Home",
    icon: <Home className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/account",
  },
  {
    title: "Inbox",
    icon: <Inbox className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/account/inbox",
  },
  {
    title: "Bookings",
    icon: <CalendarClock className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/account/bookings",
  },
  {
    title: "Room",
    icon: <Bed className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/account/room",
  },
  {
    title: "Complaints",
    icon: <AlertTriangle className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/account/complaints",
  },
  {
    title: "Payments",
    icon: <Wallet className="h-full w-full text-white dark:text-neutral-300" />,
    href: "/account/payments",
  },
];
  return (
    <div className="relative flex items-center justify-center h-[35rem] w-full bg-gra">
      <FloatingDock
       
        items={links}
      />
    </div>
  );
}
