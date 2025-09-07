"use client"
import { APIResponse, IPg } from '@/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation'
import { useApiGet } from '@/hooks/api_hooks'
import api from '@/services/api'



export interface PgDashboardState{
    currentPg?:Partial<IPg>,
    pgs:Partial<IPg>[],
    isLoading:boolean
}
interface PgContextProps extends PgDashboardState{
    selectPg:(id:string)=>void,
    
}
const PgContext = createContext<PgContextProps|undefined>(undefined)

const PgProvider = ({children}:{children:React.ReactNode}) => {
    const {isLoading:isUserLoading,user} = useAuth()
    const[isLoading,setIsLoading]=useState(true);
    const router = useRouter()
    useEffect(()=>{
        if(!isUserLoading)
        {
              if(!user || user.role!="pg")
  {
    router.replace("/not-found");
  }
  const initializePgState = async()=>{
    const res = await api.get<APIResponse<Partial<IPg>[]>>(`/pg/my-pgs`,{},)
    const data = res.data.data;
    if(data)
    {
        setPgs(data)
        setCurrentPg(data[0])
    }
    setIsLoading(false);
  }
        initializePgState()
        }
    },[isUserLoading])
    const[currentPg,setCurrentPg] = useState<Partial<IPg>|undefined>(undefined)
    const[pgs,setPgs]=useState<Partial<IPg>[]>([])
    return (
    <PgContext.Provider value={{
        currentPg:currentPg,
        isLoading,
        selectPg:(id)=>{setCurrentPg(pgs.find(p=>p.id == id))},
        pgs
    }}>
        {children}
    </PgContext.Provider>
  )
}
export const usePg = ()=>{
    const context = useContext(PgContext);
    if(!context)
    {
        throw new Error("Context not found")
    }
    return context;
}
export default PgProvider