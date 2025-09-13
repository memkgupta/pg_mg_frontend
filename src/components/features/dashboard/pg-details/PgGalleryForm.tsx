import React from "react";

import { usePgDetails } from '@/context/PgDetailsContext';
import { FormField, FormFieldTypeEnum } from "@/components/utils/form_builder/types";
import CustomForm from "@/components/utils/form_builder/form";

import api from "@/services/api";
import { useCurrentPg } from "@/context/CurrentPgContext";
import { APIResponse } from "@/types";
import ImageSelector from "@/components/common/image-selector/ImageSelector";
import { SelectedImage } from "@/components/common/image-selector/types";

const PgGalleryForm = () => {
  const { details, setDetails } = usePgDetails();
  const {details:currentPg} = useCurrentPg()
  if (!details) return null;

  // Dynamically create the MultiImage field from the context
  const uploadImageToPg = async(image:SelectedImage)=>{
    const res = await api.post<APIResponse<{id:string,url:string}>>(`/pg/admin/details/image`,{
      url:image.url,
      
    },{
      params:{
        pg_id:currentPg.id
      }
    })
    if(!res.data.success)
    {
      throw new Error("Somthing went wrong")
    }
    return res.data.data;
  }
  const removePgImage = async(id:string)=>{
      await api.delete(`/pg/admin/details/image/${id}`,{
      params:{
        pg_id:currentPg.id
      }
    });
   
  }
  const handleImageAdd = async(image:SelectedImage):Promise<SelectedImage>=>{
    const upload = await uploadImageToPg(image);
    if(!upload)
    {
      throw new Error("Something went wrong");
    }
    return {...image,id:upload.id};
  }
  const handleReplaceImages = async(image:SelectedImage):Promise<void>=>{
    await api.put(`/pg/admin/details/image/${image.id}`,{url:image.url},{params:{
      pg_id:currentPg.id
    }});
   
  }
  return (
    <div className="space-y-4">
      <ImageSelector 
        maxFiles={4}
        onChange={handleImageAdd}
        onRemove={removePgImage}
        onReplace={handleReplaceImages}
      
      
      />
    </div>
  );
};

export default PgGalleryForm;