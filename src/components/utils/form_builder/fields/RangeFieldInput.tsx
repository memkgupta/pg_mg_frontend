import { Slider } from '@/components/ui/slider'
import React from 'react'
import { useFormContext } from '../FormContext';
import {  RangeField } from '../types';

const RangeFieldInput = ({field}:{field:RangeField}) => {
     const {fields:states} = useFormContext();
        const state = states.find(s=>s.fieldId == field.fieldId);
        if(!state){
            return (<></>)
        }
        const [value,setValue] =state.state;
  return (
    <div>
         <Slider
        id={field.fieldId}
        value={value}
        onValueChange={setValue}
        min={field.min}
        max={field.max}
        step={1}
        className="w-full"
      />
    </div>
  )
}

export default RangeFieldInput