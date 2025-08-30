import { BaseField, CheckBoxField, CheckboxGroupField, ComboBoxField, EmailField, FormField, FormFieldTypeEnum, MultiTextField, RadioField } from "./types";

// import CustomFieldRenderer from "./CustomFieldRenderer";
import RadioFieldInput from "./fields/RadioFieldInput";
import EmailInputField from "./fields/EmailInputField";
import PhoneFieldInput from "./fields/PhoneFieldInput";
import CheckboxFieldInput from "./fields/CheckBoxFieldInput";
import MultiTextFieldInput from "./fields/MultiTextFieldInput";
import TextField from "./fields/TextField";
import RangeFieldInput from "./fields/RangeFieldInput";
import { DateRangePicker } from "./fields/DateRangePicker";
import CheckboxGroupFieldInput from "./fields/CheckBoxGroupInput";
import ComboBoxFieldInput from "./fields/ComboBoxFieldInput";


export function renderField(field: FormField):React.ReactNode {
  switch (field.fieldType) {
    case FormFieldTypeEnum.RADIO:

      return <RadioFieldInput field={field as RadioField}/>;

    case FormFieldTypeEnum.EMAIL:
      return <EmailInputField field={field as BaseField<string>} />;

    case FormFieldTypeEnum.PHONE_NUMBER:
      return <PhoneFieldInput field={field} />;

    case FormFieldTypeEnum.CHECKBOX:
      return <CheckboxFieldInput field={field as CheckBoxField } />;

    case FormFieldTypeEnum.TEXT:
      return <TextField field={field as BaseField<string>} />;
    case FormFieldTypeEnum.CHECKBOX_GROUP:
      return <CheckboxGroupFieldInput field={field as CheckboxGroupField}/>
    case FormFieldTypeEnum.RANGE:
      return <RangeFieldInput field={field} />;
    case FormFieldTypeEnum.SELECT:
      return <ComboBoxFieldInput field={field as ComboBoxField}/>
    // case FormFieldTypeEnum.TEXT_AREA:
    //   return <TextAreaFieldInput field={field} />;

    case FormFieldTypeEnum.MULTI_TEXT:
      return <MultiTextFieldInput field={field} />;

    case FormFieldTypeEnum.DATE_RANGE:
      return <DateRangePicker field={field} />;

    // case FormFieldTypeEnum.CUSTOM:
    //   // delegate to a custom renderer function or component
    //   return <CustomFieldRenderer field={field} />;

    default:
      return null;
  }
}
