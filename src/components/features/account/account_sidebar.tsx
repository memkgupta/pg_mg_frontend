import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Home, Inbox, Calendar, Search, Settings, CalendarClockIcon, Bed, AlertTriangle, Wallet } from "lucide-react"
import { IconReservedLine } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
const AccountSidebar = () => {
    const items = [
  { title: "Home", url: "/account", icon: Home },
  { title: "Inbox", url: "/account/inbox", icon: Inbox },
  {title:"Bookings",url:"/account/bookings",icon:CalendarClockIcon},
  {title:"Room",url:"/account/room",icon:Bed},
  {title:"Complaints",url:"/account/complaints",icon:AlertTriangle},
  {title:"Payments",url:"/account/payments",icon:Wallet}
  /* ... more items ... */
]

  return (
    <Sidebar className="mt-17 h-[calc(100vh-5rem)] fixed" variant='floating' collapsible='icon' >
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter  >
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/account/settings"
                className={cn(
                  "flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
                )}
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

export default AccountSidebar