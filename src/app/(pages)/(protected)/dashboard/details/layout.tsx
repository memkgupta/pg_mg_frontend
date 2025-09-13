import PgDetailsProvider from '@/context/PgDetailsContext'
import React from 'react'

const PgDetailsLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <PgDetailsProvider>
            {children}
        </PgDetailsProvider>
        
    </div>
  )
}

export default PgDetailsLayout