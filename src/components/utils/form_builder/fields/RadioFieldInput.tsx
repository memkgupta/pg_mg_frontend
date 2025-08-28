import React from 'react'
import { RadioField } from '../types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFormContext } from '../FormContext';

function RadioFieldInput<T extends string>({field}:{field:RadioField<T>})
{
     const {fields:states} = useFormContext();
    const state = states.find(s=>s.fieldId == field.fieldId);
    if(!state){
        return (<></>)
    }
    const [value,setValue] =state.state;
return(
     <div className="space-y-3">
      <Label>{field.label}</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => {
            setValue(val);
            if(field.onChange)
            {
                field.onChange(val as T,state.state)
            }
        }}
        className="space-y-2"
      >
        {field.options.map((opt) => (
          <div key={opt.key} className="flex items-center space-x-2">
            <RadioGroupItem value={opt.value} id={opt.value} />
            <Label htmlFor={opt.value}>{opt.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
)
}
export default RadioFieldInput