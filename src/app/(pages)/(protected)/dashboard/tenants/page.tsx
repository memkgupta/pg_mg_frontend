"use client"
import PageLoader from '@/components/common/Loader'
import { PaginatedView } from '@/components/common/PaginatedView'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CustomForm from '@/components/utils/form_builder/form'
import { FormField, FormFieldTypeEnum } from '@/components/utils/form_builder/types'
import { useCurrentPg } from '@/context/CurrentPgContext'
import { usePg } from '@/context/PgContext'
import { useApiGet } from '@/hooks/api_hooks'
import { parseParams } from '@/lib/utils'
import { ITenant, Page } from '@/types'
import { format } from 'date-fns'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from 'zod'

export const tenantFilterFormFields: FormField[] = [
  {
    fieldId: "name",
    fieldType: FormFieldTypeEnum.TEXT,
    label: "Name",
    placeholder: "Search by name",
    default: "",
    suffix:"~"
  },
  {
    fieldId: "is_active",
    fieldType: FormFieldTypeEnum.SELECT,
    label: "Status",
    options: [
      { key: "active", label: "Active", value: "true" }
    ],
    default: "true",
    
  },

]

const tenantFilterFormSchema = z.object({
    name:z.string().optional(),
    is_active:z.string().optional().default("true").transform((d)=>d.toLowerCase()==="true")
})

const Tenants = () => {
     const {currentPg} = usePg()
     const[params,setParams] = useState<Record<string,any>>({
        pg_id:currentPg?.id
     });
    
     const handleApplyFilter = (data: Record<string, any>) => {
       const parsedParams = parseParams(data,tenantFilterFormFields)
     
       setParams(prev => ({ ...prev, ...parsedParams }))
     }
    const {data:tenantPage,isFetching} = useApiGet<Page<ITenant>>(`/pg/admin/tenant`,{
        params:params
    },{queryKey:[
        "pg-dashboard-tenants",currentPg?.id,{...params}
    ]})
  return (
   <>
   
   {isFetching ? <PageLoader/> :(
    <>
    <div className=" border-r p-4">
            <CustomForm
              fields={tenantFilterFormFields}
              styling={{
                gapBetweenFields: 5,
                buttonSubmitColor: 'green-500 text-black hover:bg-green-600 cursor-pointer',
                cols: { md: 3, lg: 3, sm: 1 },
              }}
               onSubmit={(data)=>{handleApplyFilter(data)}}
              schema={tenantFilterFormSchema}
            />
          </div>

    {
        tenantPage && 
        <PaginatedView page={tenantPage}  onPageChange={(page) => { setParams(params => ({ ...params, page: page })) }}>
            <>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Move-in Date</TableHead>
                <TableHead>Date</TableHead>
                
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantPage.data.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.phoneNumber}</TableCell>
                  <TableCell>{t.roomId}</TableCell>
                  <TableCell>{format(t.moveInDate,"PPP")}</TableCell>
                  <TableCell>{format(t.createdAt,"PPP")}</TableCell>
                  
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                       t.isActive
                          ? "bg-green-100 text-green-700"
                         
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {t.isActive}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/tenants/${t.id}`} className='p-2 rounded-md bg-green-400' >
                        View
                      </Link>
                    
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </>
        </PaginatedView>
    }
    </>
   )}
   </>
  )
}

export default Tenants