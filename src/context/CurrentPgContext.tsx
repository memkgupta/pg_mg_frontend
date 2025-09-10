import { APIResponse, IPg, IRoomCategory } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { usePg } from "./PgContext";
import PageLoader from "@/components/common/Loader";
import api from "@/services/api";


export interface CurrentPgState{
    details:Partial<IPg>,
    categories:Partial<IRoomCategory>[],

}
export interface CurrentPgContextProps extends CurrentPgState{
    setDetails:(details:IPg)=>void,
    addCategory:(categories:Partial<IRoomCategory>)=>void,
    isLoading:boolean,
    error:string|undefined
}
const CurrentPgContext = createContext<CurrentPgContextProps|undefined>(undefined)

export const CurrentPgProvider = ({children}:{children:React.ReactNode})=>{
    const {currentPg,isLoading} = usePg()
    const [loadingDetails,setLoadingDetails] = useState(true);
    const [error,setError] = useState<string|undefined>(undefined);
    const[details,setDetails] = useState<Partial<IPg>|undefined>(undefined);
    const[categories,setCategories] = useState<Partial<IRoomCategory>[]>([])
    useEffect(()=>{
       const init = async()=>{
        try{
 const res =await api.get<APIResponse<IRoomCategory[]>>(`/pg/admin/room/room-categs`,{
                params:{
                    pg_id:currentPg!.id
                }
            })
            if(res.data.success)
            {
                setCategories(res.data.data!)

            }
        }
        catch(error:any)
        {
            setError(error.messaage)
        }
        finally{
setLoadingDetails(false);
        }
       
            
       }
        if(!isLoading && currentPg)
        {
            setDetails(currentPg)
            init();
        }
    },[isLoading,currentPg])
    return(
        <>
        {
            isLoading ? <PageLoader/>:(
                <>
                   {
                    loadingDetails || !details ? <PageLoader/> :(
                        error ? error.toString() :
                        <>
                        <CurrentPgContext.Provider value={{
                            categories:categories,
                            addCategory:(categ)=>{
                                setCategories(prev=>([...prev,categ]))
                            },
                            details:details,
                            error:error,
                            isLoading:loadingDetails,
                            setDetails:setDetails

                        }}>
                            {children}
                        </CurrentPgContext.Provider>
                        </>
                    )
                   }
                </>
            )
        }
            
        </>
    )
}

export const useCurrentPg = ()=>{
    const context = useContext(CurrentPgContext)
    if(!context)
    {
        throw new Error("Context not found");
    }
    return context;
}