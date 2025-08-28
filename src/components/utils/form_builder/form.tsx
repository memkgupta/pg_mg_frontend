import React from 'react'
import { BaseField, FormField } from './types'
import FormContext, { FormProvider } from './FormContext'
import { renderField } from './FieldRenderer'
import { z } from 'zod'

const CustomForm = ({fields}:{fields:BaseField<unknown>[]}) => {
    
  return (
    <div>
        <FormProvider fields={fields} onSubmit={(d)=>{}} schema={z.object({})}>
           <>
            {
                fields.map(field=>(renderField(field as FormField)))
            }
           </>
        </FormProvider>
    </div>
  )
}

export default CustomForm