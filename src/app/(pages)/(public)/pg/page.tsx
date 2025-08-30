"use client"
import PageLoader from '@/components/common/Loader'
import { PaginatedView } from '@/components/common/PaginatedView'
import { PgCard } from '@/components/features/pg/pg_card'
import CustomForm from '@/components/utils/form_builder/form'
import { FormField, FormFieldTypeEnum } from '@/components/utils/form_builder/types'
import { useApiGet } from '@/hooks/api_hooks'
import { IPg, Page } from '@/types'
import { useState } from 'react'
import { z } from 'zod'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export const pgFiltersSchema = z.object({
  city: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  name: z.string().optional().default("")
})

export const pgFilterFormFields: FormField[] = [
  {
    fieldId: "name",
    fieldType: FormFieldTypeEnum.TEXT,
    label: "Name",
    placeholder: "Search by name",
    default: "",
    suffix:"~"
  },
  {
    fieldId: "city",
    fieldType: FormFieldTypeEnum.SELECT,
    label: "City",
    options: [
      { key: "dankaur", label: "Dankaur", value: "dankaur" }
    ],
    default: "",
    
  },
  {
    fieldId: "amenities",
    fieldType: FormFieldTypeEnum.CHECKBOX_GROUP,
    label: "Amenities",
    options: [
      { label: "AC", value: "AC" },
      { label: "WiFi", value: "WiFi" }
    ],
    default: [],
    suffix:"@>"
  }
]

const Pgs = () => {
  const [params, setParams] = useState<Record<string,any>>({
    page: 1,
    limit: 10,
  })
  const { data: page, isFetching } = useApiGet<Page<IPg>>(`/pg`, {
    params: params
  }, { queryKey: ["pgs", params] })
const handleApplyFilter = (data: Record<string, any>) => {
  const parsedParams = Object.entries(data).reduce<Record<string, any>>(
    (acc, [key, value]) => {
      const suffix = pgFilterFormFields.find(field => field.fieldId === key)?.suffix
      if (suffix) {
        if(suffix=="@>" && Array.isArray(value))
        {
            acc[key+suffix]=(value.join(",")).toString()
        }
        else{
acc[ key+suffix ] = value
        }
        
      }
      return acc
    },
    {}
  )

  setParams(prev => ({ ...prev, ...parsedParams }))
}
  return (
    <div>
      { <>
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* ===== Filter box for <md (collapsible top) ===== */}
          <div className="md:hidden">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className={`
                  mt-2 border rounded-lg overflow-hidden
                  data-[state=closed]:animate-collapsible-up
                  data-[state=open]:animate-collapsible-down
                `}>
                <CustomForm
                  fields={pgFilterFormFields}
                  styling={{
                    gapBetweenFields: 5,
                    buttonSubmitColor: 'green-500 text-black hover:bg-green-600 cursor-pointer',
                    cols: { md: 1, lg: 1, sm: 1 },
                  }}
                  onSubmit={(data)=>{handleApplyFilter(data)}}
                  schema={pgFiltersSchema}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* ===== Filter box for >=md (sidebar left) ===== */}
          <div className="hidden md:block md:w-1/4 border-r p-4">
            <CustomForm
              fields={pgFilterFormFields}
              styling={{
                gapBetweenFields: 5,
                buttonSubmitColor: 'green-500 text-black hover:bg-green-600 cursor-pointer',
                cols: { md: 1, lg: 1, sm: 1 },
              }}
               onSubmit={(data)=>{handleApplyFilter(data)}}
              schema={pgFiltersSchema}
            />
          </div>

          {/* ===== Paginated content ===== */}
          {isFetching || !page ? <PageLoader /> :<div className="flex-1">
            <PaginatedView page={page} onPageChange={(page) => { setParams(params => ({ ...params, page: page })) }}>
              <div className="flex justify-center w-full p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {page.data.map((pg, index) => <PgCard pg={pg} key={index} />)}
                </div>
              </div>
            </PaginatedView>
          </div>}
        </div>
      </>}
    </div>
  )
}

export default Pgs
