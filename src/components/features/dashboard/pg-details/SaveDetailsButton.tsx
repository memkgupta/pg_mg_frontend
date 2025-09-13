"use client"
import { Button } from '@/components/ui/button'
import { usePgDetails } from '@/context/PgDetailsContext'
import React from 'react'

const SaveDetailsButton = () => {
    const {isSubmitting,onSubmit} = usePgDetails()
  return (
    <Button disabled={isSubmitting} onClick={onSubmit} >SaveDetailsButton</Button>
  )
}

export default SaveDetailsButton