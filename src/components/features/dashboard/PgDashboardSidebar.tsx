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
import { Home, Inbox, Calendar, Search, Settings, CalendarClockIcon, Bed, AlertTriangle, Wallet, ChevronDown } from "lucide-react"
import { IconReservedLine } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { PgSelector } from './PgSelector'
const PgDashboardSidebar = () => {
    const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  {title:"Bookings",url:"/dashboard/bookings",icon:CalendarClockIcon},
  {title:"Room",url:"/dashboard/room",icon:Bed},
  {title:"Complaints",url:"/dashboard/complaints",icon:AlertTriangle},
  {title:"Payments",url:"/dashboard/payments",icon:Wallet}
  /* ... more items ... */
]

  return (
    <Sidebar className="mt-17 h-[calc(100vh-5rem)] fixed" variant='floating' collapsible='icon' >
        <SidebarHeader>
    <PgSelector/>
  </SidebarHeader>
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

export default PgDashboardSidebar