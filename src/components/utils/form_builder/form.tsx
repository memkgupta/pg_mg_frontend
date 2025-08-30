import React from 'react'
import { BaseField, FieldState, FormField } from './types'
import FormContext, { FormProvider, useFormContext } from './FormContext'
import { renderField } from './FieldRenderer'
import { z, ZodAny, ZodError, ZodTypeAny } from 'zod'
import { cn, parseStyle } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FormStyle } from '@/types'

const CustomForm = ({fields,styling,schema,onSubmit}:{fields:FormField[],styling?:FormStyle,schema:ZodTypeAny,onSubmit:(data:any)=>void}) => {
    const parsedStyle = parseStyle(styling);
   
  return (
    <div>
        <FormProvider styling={parsedStyle} fields={fields} onSubmit={onSubmit} schema={schema}>
           
            {
                fields.map(field=>(renderField(field )))
            }
             
           
          
        </FormProvider>
    </div>
  )
}

export default CustomForm