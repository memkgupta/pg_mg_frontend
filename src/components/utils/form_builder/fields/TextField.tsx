import React from 'react'
import { BaseField } from '../types'
import { useFormContext } from '../FormContext'
import { Input } from '@/components/ui/input';

const TextField = ({field}:{field:BaseField<string>}) => {
    const {fields:states} = useFormContext();
    const state = states.find(s=>s.fieldId == field.fieldId);
    if(!state){
        return (<></>)
    }
    const [value,setValue] =state.state;
  return (
    <div>
        <Input value={value as string} onChange={(v)=>{
            setValue(v.target.value);
            if(field.onChange)
            {
                field.onChange(v.target.value,state.state);
            }
        }}>
        </Input>
    </div>
  )
}

export default TextField