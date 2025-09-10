import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

export interface Page<T> {
  data: T[]
  next: number | null
  prev: number | null
  totalResults: number
}

interface PaginatedViewProps<T> {
  page: Page<T>
  onPageChange: (page: number) => void
  children: React.ReactNode
}

export function PaginatedView<T>({ page, onPageChange, children }: PaginatedViewProps<T>) {
  return (
    <div className="flex flex-col min-h-screen"> 
     <p className="text-3xl font-extrabold text-black">Total {page.totalResults} Results found</p>
      <div className="flex-1 p-4">{children}</div>

    
      <div className="flex items-center justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Total Results: {page.totalResults}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!page.prev}
            onClick={() => page.prev && onPageChange(page.prev)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={!page.next}
            onClick={() => page.next && onPageChange(page.next)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
