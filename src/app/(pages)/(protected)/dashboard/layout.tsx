"use client"
import AccountSidebar from '@/components/features/account/account_sidebar'
import PgDashboardSidebar from '@/components/features/dashboard/PgDashboardSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useAuth } from '@/context/AuthContext'
import { CurrentPgProvider } from '@/context/CurrentPgContext'
import PgProvider from '@/context/PgContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const PgDashboardLayout = ({children}:{children:React.ReactNode}) => {

    return (
      <div className=''>
    <Toaster/>
    <div className='md:hidden'>
     Please switch to desktop
    </div>
    <PgProvider>
        <div className='hidden md:block'>
        <SidebarProvider>
            <PgDashboardSidebar/>
            <main className='w-full mt-20'>
                <SidebarTrigger className='fixed'/>
                <CurrentPgProvider>
                  {children}
                </CurrentPgProvider>


            </main>
             
        </SidebarProvider>
       
    </div>
    </PgProvider>
   </div>
  )
}

export default PgDashboardLayout