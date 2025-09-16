"use client"
import PageLoader from '@/components/common/Loader'
import { usePg } from '@/context/PgContext'
import { useApiGet } from '@/hooks/api_hooks'
import { ITenant, ITenantStatus } from '@/types'
import React, { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import TenantHeader from '@/components/features/dashboard/tenants/details/TenantHeader'
import TenantStatus from '@/components/features/dashboard/tenants/details/TenantStatus'
import TenantInfoGrid from '@/components/features/dashboard/tenants/details/TenantInfoGrid'
import TenantRoomInfo from '@/components/features/dashboard/tenants/details/TenantRoomInfo'
import TenantMetadata from '@/components/features/dashboard/tenants/details/TenantMetaData'
import TenantActions from '@/components/features/dashboard/tenants/details/TenantActions'
import { format } from 'date-fns'
import TenantVerificationModal from '@/components/features/dashboard/tenants/verification/VerifyTenantModal'
import api from '@/services/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ViewTenant = ({params}:{params:{id:string}}) => {
  const {currentPg} = usePg()
  const [isFinalising,setIsFinalising] = useState(false);
  const [isRemoving,setIsRemoving] = useState(false);

  const {data:tenant,isFetching} = useApiGet<ITenant>(`/pg/admin/tenant/${params.id}`,{
      params:{ pg_id:currentPg?.id }
  },{
      queryKey:["tenant-details",params.id]
  });

  const handleFinalise = async()=>{
      try{
          setIsFinalising(true)
          await api.put(`/pg/admin/tenant/finalize/${params.id}`,{},{
              params:{ pg_id:currentPg?.id }
          })
      } finally{
          setIsFinalising(false)
      }
  }

  const handleRemove = async()=>{
      try{
          setIsRemoving(true)
          await api.delete(`/pg/admin/tenant/${params.id}`,{
              params:{ pg_id:currentPg?.id }
          })
          alert("Tenant removed ✅")
      } finally{
          setIsRemoving(false)
      }
  }

  return (
    <div>
      {isFetching ? <PageLoader/> :
        tenant && (
          <>
            {/* Verification Alerts */}
            {!tenant.verification && (
              <div className='flex justify-end'>
                <Alert variant={"destructive"} className='bg-yellow-200 mx-5 w-1/2'>
                  <AlertTriangleIcon/>
                  <AlertTitle>Verification Pending</AlertTitle>
                  <AlertDescription className='flex justify-between items-center'>
                    <span>Verification of tenant is pending ..</span>
                    <TenantVerificationModal tenant={tenant}/>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {tenant.verification && tenant.status === ITenantStatus.PENDING && (
              <div className='flex justify-end'>
                <Alert variant={"destructive"} className='bg-yellow-200 mx-5 w-1/2'>
                  <AlertTriangleIcon/>
                  <AlertTitle>Finalise Tenant</AlertTitle>
                  <AlertDescription className='flex justify-between items-center'>
                    <span>Tenant is not finalised yet ...</span>
                    <Button onClick={handleFinalise} disabled={isFinalising}>
                      {isFinalising ? "Finalising..." : "Finalise"}
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Tenant Card */}
            <div className="container mx-auto py-8 max-w-3xl">
              <Card>
                <CardHeader>
                  <TenantHeader name={tenant.name} email={tenant.email} />
                </CardHeader>
                <CardContent className="space-y-6">
                  <TenantStatus isActive={tenant.isActive} />
                  {tenant.phoneNumber && <TenantInfoGrid phone={tenant.phoneNumber} discount={tenant.discount} />}
                  {tenant.room && <TenantRoomInfo room={tenant.room} />}
                  {tenant.createdAt && tenant.updatedAt && (
                    <TenantMetadata 
                      createdAt={format(tenant.createdAt,"PPP")} 
                      updatedAt={format(tenant.updatedAt,"PPP")} 
                    />
                  )}
                  <TenantActions />

                  {/* 🚨 Remove Tenant Button with Confirmation */}
                {tenant.isActive &&  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Remove Tenant</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently remove tenant <b>{tenant.name}</b>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove} disabled={isRemoving}>
                          {isRemoving ? "Removing..." : "Yes, Remove"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>}
                </CardContent>
              </Card>
            </div>
          </>
        )
      }
    </div>
  )
}

export default ViewTenant
