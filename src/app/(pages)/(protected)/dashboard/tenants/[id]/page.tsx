"use client"
import PageLoader from '@/components/common/Loader'
import { usePg } from '@/context/PgContext'
import { useApiGet } from '@/hooks/api_hooks'
import { ITenant, ITenantStatus } from '@/types'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import TenantHeader from '@/components/features/dashboard/tenants/details/TenantHeader'
import TenantStatus from '@/components/features/dashboard/tenants/details/TenantStatus'
import TenantInfoGrid from '@/components/features/dashboard/tenants/details/TenantInfoGrid'
import TenantRoomInfo from '@/components/features/dashboard/tenants/details/TenantRoomInfo'
import TenantMetadata from '@/components/features/dashboard/tenants/details/TenantMetaData'
import TenantActions from '@/components/features/dashboard/tenants/details/TenantActions'
import { format } from 'date-fns'
const ViewTenant = ({params}:{params:{id:string}}) => {
    const {currentPg} = usePg()
    const {data:tenant,isFetching} = useApiGet<ITenant>(`/pg/admin/tenant/${params.id}`,{
        params:{
            pg_id:currentPg?.id
        }
    },{
        queryKey:["tenant-details",params.id]
    });

  return (
    <div>
        {
            isFetching ? <PageLoader/>:
            (
              tenant &&  <>
                    {
                        tenant.status === ITenantStatus.PENDING &&
                        <div className='flex justify-end'>
                            <Alert variant={"destructive"} className='bg-yellow-200 mx-5 w-1/2'>
                            <AlertTriangleIcon/>
                            <AlertTitle>Verification Pending</AlertTitle>
                            <AlertDescription className='flex justify-between items-center'>
                                <span>
                                    Verification of tenant is pending ..
                                </span>
                                <Button>Verify now</Button>
                            </AlertDescription>
                            
                        </Alert>
                        </div>
                    }
                    <div className="container mx-auto py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <TenantHeader name={tenant.name} email={tenant.email} />
        </CardHeader>
        <CardContent className="space-y-6">
          <TenantStatus isActive={tenant.isActive} />
        {tenant.phoneNumber &&  <TenantInfoGrid phone={tenant.phoneNumber} discount={tenant.discount} />}
        {tenant.room &&  <TenantRoomInfo room={tenant.room} />}
        {tenant.createdAt && tenant.updatedAt &&  <TenantMetadata createdAt={format(tenant.createdAt,"PPP")} updatedAt={format(tenant.updatedAt,"PPP")} />}
          <TenantActions />
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