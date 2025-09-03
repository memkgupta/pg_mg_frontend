import { BookingProvider } from '@/context/BookingContext'
import React from 'react'

const BookingLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <BookingProvider>
            {children}
        </BookingProvider>
    </div>
  )
}

export default BookingLayout