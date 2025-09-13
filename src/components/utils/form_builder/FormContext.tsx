import React, { createContext, ReactNode, useContext } from 'react'
import { FieldState, FormContextProps, BaseField } from './types';
import { ZodError, ZodTypeAny } from 'zod';
import GenericForm from './form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export const FormContext = createContext<FormContextProps<any>|null>(null);
interface FormProviderProps<TSchema extends ZodTypeAny> {
  schema?: TSchema;
  fields: BaseField<any>[];
  onSubmit?: (data: any) => void;
  styling: {
    container:string,
    button:string
  };
  children: ReactNode;
}
export function FormProvider<TSchema extends ZodTypeAny>({
  schema,
  fields,
  onSubmit,
  styling,
  children,
}: FormProviderProps<TSchema>) {
 const [formState, setFormState] = React.useState(
  Object.fromEntries(fields.map(f => [f.fieldId, f.default]))
);

const states: FieldState[] = fields.map(field => ({
  fieldId: field.fieldId,
  state: [
    formState[field.fieldId],
    (val: any) => setFormState(prev => ({ ...prev, [field.fieldId]: val }))
  ] as [any, (val: any) => void]
}));
    const [errors,setErrors] = React.useState<{fieldId:string,message:string}[]>([]);
    const handleSubmit = (d:FieldState[])=>{
       const data:any = {}
         d.forEach(state=>{
          data[state.fieldId] = state.state[0]
         })
       
        try {
      const parsed = schema!.parse(data)  
          setErrors([]);
          if(onSubmit){
                 onSubmit(parsed)
          }
 
    } catch (err) {
      if (err instanceof ZodError) {
        // convert Zod issues into field errors
        const errs: {fieldId:string,message:string}[] = []
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            errs.push({fieldId:issue.path[0] as string,message:issue.message})
          }
        })
       console.log(err);
       setErrors(errs)
      }
    }
    }
    return (
    <FormContext.Provider value={{ fields:states, onSubmit, styling,errors,setErrors }}>
      <div className={cn(styling?.container,`w-full`,'place-items-center')}>
   {children}
   {onSubmit && <div className='p-1 w-full mt-4'>
      <Button className={cn(styling?.button,`w-full`)}  onClick={()=>{handleSubmit(states)}}>Submit</Button>
   </div>}
 
      </div>

    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return ctx ;
}
export default FormContext