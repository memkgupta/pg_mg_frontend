"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomForm from "@/components/utils/form_builder/form";
import { FormField, FormFieldTypeEnum } from "@/components/utils/form_builder/types";
import { usePgDetails } from "@/context/PgDetailsContext";



export default function PgBasicInfoForm() {
  const {details,setDetails} = usePgDetails()
  
  const basicDetailsFields:FormField[] = [
    {
      fieldType:FormFieldTypeEnum.TEXT,
      default:details!.basic.name,
      label:"Name",
      fieldId:"name",
      onChange(value, state) {
          setDetails("basic",value,false,"name");
      },
      
    },
    {
       fieldType:FormFieldTypeEnum.TEXT_AREA,
      default:details!.basic.description,
      label:"Description",
      fieldId:"description",
      onChange(value, state) {
          setDetails("basic",value,false,"description");
      },
    }
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
   
        <CustomForm fields={basicDetailsFields} styling={{
          cols:{md:1,lg:1,sm:1},
          gapBetweenFields:5,
        
        }}/>
      </CardContent>
    </Card>
  );
}
