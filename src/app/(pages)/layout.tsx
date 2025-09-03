import Navbar from '@/components/features/navbar/navbar'
import React from 'react'

const PageLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='space-y-3'>
        <Navbar/>
        {children}
    </div>
  )
}

export default PageLayout