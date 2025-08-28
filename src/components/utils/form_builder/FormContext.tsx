import React, { createContext, ReactNode, useContext } from 'react'
import { FieldState, FormContextProps, BaseField } from './types';
import { ZodTypeAny } from 'zod';
import GenericForm from './form';
export const FormContext = createContext<FormContextProps<any>|null>(null);
interface FormProviderProps<TSchema extends ZodTypeAny> {
  schema: TSchema;
  fields: BaseField<any>[];
  onSubmit: (data: any) => void;
  styling?: React.CSSProperties;
  children: ReactNode;
}
export function FormProvider<TSchema extends ZodTypeAny>({
  schema,
  fields,
  onSubmit,
  styling,
  children,
}: FormProviderProps<TSchema>) {
    const states:FieldState[] = fields.map(field=>({
        fieldId:field.fieldId,
        state:React.useState()
    }))
  return (
    <FormContext.Provider value={{ fields:states, onSubmit, styling }}>
      <GenericForm fields={fields}/>
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