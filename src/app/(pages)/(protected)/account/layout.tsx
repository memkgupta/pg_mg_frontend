"use client"
import AccountSidebar from '@/components/features/account/account_sidebar'
import { FloatingDockDemo } from '@/components/features/account/floating_nav'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { Toaster } from 'sonner'

const AccountLayout = ({children}:{children:React.ReactNode}) => {
  return (
   <div className=''>
    <Toaster/>
    <div className='md:hidden'>
      {children}
          <FloatingDockDemo/>
    </div>
    <div className='hidden md:block'>
        <SidebarProvider>
            <AccountSidebar/>
            <main className='w-full mt-20'>
                <SidebarTrigger className='fixed'/>
{children}

            </main>
             
        </SidebarProvider>
       
    </div>
   </div>
  )
}

export default AccountLayout