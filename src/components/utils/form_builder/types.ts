import { z, ZodTypeAny } from "zod"

export interface FormContextProps<T extends ZodTypeAny>{
    onSubmit?:(formData:z.infer<T> )=>void,
    styling?:React.CSSProperties,
    fields:FieldState[],
    errors:{fieldId:string,message:string}[],
    setErrors:(errs:{fieldId:string,message:string}[])=>void
}
export interface FieldState<T = any> {
  fieldId: string;
  state: [T, React.Dispatch<React.SetStateAction<T>>];
}
export enum FormFieldTypeEnum{
    RADIO="radio",
    EMAIL="email",
    PHONE_NUMBER="phone_number",
    CHECKBOX="check_box",
    TEXT="text",
    RANGE="range",
    TEXT_AREA="text_area",
    MULTI_TEXT="multi_text",
    DATE_RANGE="date_range",
    CHECKBOX_GROUP="checkbox_group",
    CUSTOM="custom",
    SELECT="select",

}


export interface BaseField<T> {
  fieldType: FormFieldTypeEnum; // discriminator
  valueType?: T;
  fieldId: string;
  label: string;
  placeholder?: string;
  default:T;
  onChange?: (
    value: T,
    state: [T, React.Dispatch<React.SetStateAction<T>>]
  ) => void;
  errorMessage?: boolean;
  error?: string;
  prefix?: string;
  suffix?: string;
}

// ✅ Range
export interface RangeField extends BaseField<number[]> {
  fieldType: FormFieldTypeEnum.RANGE;
  min?: number;
  max?: number;
  step?:number
}

// ✅ Radio
export interface RadioField<T extends string = string> extends BaseField<T> {
  fieldType: FormFieldTypeEnum.RADIO;
  options: { label: string; value: T; key: string }[];
}

// ✅ Phone
export interface PhoneField extends BaseField<string> {
  fieldType: FormFieldTypeEnum.PHONE_NUMBER;
  prefix?: string; // changed to optional string instead of literal "+91"
}

// ✅ Date Range
export interface DateRangeField
  extends BaseField<{ from: Date; to?: Date }> {
  fieldType: FormFieldTypeEnum.DATE_RANGE;
  numberOfMonths?: number;
}

// ✅ ComboBox
export interface ComboBoxField extends BaseField<string> {
  fieldType: FormFieldTypeEnum.SELECT; // or EMAIL? double-check
  options: { label: string; value: string; key: string }[];
}

// ✅ Checkbox (single)
export interface CheckBoxField extends BaseField<boolean> {
  fieldType: FormFieldTypeEnum.CHECKBOX;
  defaultChecked?: boolean;
}

// ✅ Checkbox Group (multi)
export interface CheckboxGroupOption {
  label: string;
  value: string;
}

export interface CheckboxGroupField extends BaseField<string[]> {
  fieldType: FormFieldTypeEnum.CHECKBOX_GROUP; // ⚡ if you want distinct enum, add CHECKBOX_GROUP
  options: CheckboxGroupOption[];
}

// ✅ Text
export interface TextField extends BaseField<string> {
  fieldType: FormFieldTypeEnum.TEXT;
}

// ✅ TextArea
export interface TextAreaField extends BaseField<string> {
  fieldType: FormFieldTypeEnum.TEXT_AREA;
  rows?: number;
}

// ✅ Multi-Text
export interface MultiTextField extends BaseField<string[]> {
  fieldType: FormFieldTypeEnum.MULTI_TEXT;
}

// ✅ Email
export interface EmailField extends BaseField<string> {
  fieldType: FormFieldTypeEnum.EMAIL;
}

// ✅ Custom
export interface CustomField extends BaseField<any> {
  fieldType: FormFieldTypeEnum.CUSTOM;
  customField: React.ReactNode;
}
export type FormField =
  | RangeField
  | RadioField
  | PhoneField
  | DateRangeField
  | ComboBoxField
  | CheckBoxField
  | CheckboxGroupField
  | TextField
  | TextAreaField
  | MultiTextField
  | EmailField
  | CustomField;
