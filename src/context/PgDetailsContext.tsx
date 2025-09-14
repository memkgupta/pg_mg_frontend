"use client"
import PageLoader from '@/components/common/Loader'
import api from '@/services/api'
import { APIResponse, PgAddressDetails, PgBasicDetails, PgDetails, PgImage, PgOwnerInfo } from '@/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useCurrentPg } from './CurrentPgContext'
import { toast } from 'sonner'
export interface PgDetailsContextState {
    details:PgDetails
}
export interface PgDetailsContextProps extends PgDetailsContextState{
    setDetails:<S extends keyof PgDetails>(section:S,value:any,push?:boolean,fieldId?:keyof PgDetails[S])=>void,
    isLoading:boolean,
    error?:string,
    setError:(error:string)=>void,
    onSubmit:()=>Promise<void>,
    isSubmitting:boolean
}
const defaultPgDetails: PgDetails = {
  basic: { name: "", description: "" },
  address: { address: "", city: "", state: "", pincode: "" },
  amenities: [],
  gallery: [],
  owner: { ownerName: "", contactNumber: "", email: "" },
};

const PgDetailsContext = createContext<PgDetailsContextProps>({details:defaultPgDetails,isLoading:true,setDetails:(section,fieldId,value)=>{},setError:(error)=>{},onSubmit: async()=>{},isSubmitting:false})
const PgDetailsProvider = ({children}:{children:React.ReactNode}) => {
    const {details:currentPg} = useCurrentPg()
    const [details,setDetails] = useState<PgDetails>(defaultPgDetails)
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState<string|undefined>(undefined)
    const [isSubmitting,setIsSubmitting] = useState(false);
    const handleChangeDetails = <S extends keyof PgDetails>(
  section: S,
  value: any,
   push?: boolean,
  fieldId?: keyof PgDetails[S],
 
) => {
  setDetails(prev => {
    if (!prev) return prev; // still undefined → nothing to update

    const prevSection = prev[section];

    // Case 1: updating a field in an object section
    if (fieldId) {
      if (typeof prevSection === "object" && !Array.isArray(prevSection)) {
        return {
          ...prev,
          [section]: {
            ...prevSection,
            [fieldId]: value,
          },
        };
      }
    }

    // Case 2: pushing into an array section
    if (!fieldId && Array.isArray(prevSection)) {
      return {
        ...prev,
        [section]: push ? [...prevSection, value] : prevSection,
      };
    }

    // fallback: return unchanged
    return prev;
  });
};
const handleSubmit = async()=>{
   try{
    setIsSubmitting(true)
     const res = await api.put(`/pg/admin/details`,{
      basic:details.basic,
      amenities:details.amenities,
      owner:details.owner,
      address:details.address  
    },{
        params:{
            pg_id:currentPg.id
        }
    })
    if(res.data.success)
    {
        toast.success("Pg data updated")
    }
   }
   catch(error)
   {

   }
   finally{
    setIsSubmitting(false)
   }
}
useEffect(()=>{
    const init = async()=>{
        const res = await api.get<APIResponse<PgDetails>>(`/pg/admin/details`,{
            params:{
                pg_id:currentPg.id
            }
        })
        
        if(res.data.success)
        {
            const d = res.data.data
            setDetails(d!)
            setIsLoading(false);

        }
        else{
            setError(res.data.message)
        }
    }
    init()
},[])
  return (
    <PgDetailsContext.Provider value={{
        details,
        error,
        setError,
        setDetails:handleChangeDetails,
        isLoading,
        onSubmit:handleSubmit,
        isSubmitting
    }}>
        <>
        {isLoading || !details ? <PageLoader/> :(
            <>
            {
                error ? error : children
            }</>
        )}
        </>
      
    </PgDetailsContext.Provider>
  )
}

export default PgDetailsProvider

export const usePgDetails = ()=>{
    const context = useContext(PgDetailsContext)
    if(!context)
    {
        throw new Error("Context not found")
    }
    return context;
}