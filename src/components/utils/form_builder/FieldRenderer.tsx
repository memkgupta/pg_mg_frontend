import { BaseField, CheckBoxField, EmailField, FormField, FormFieldTypeEnum, MultiTextField, RadioField } from "./types";

// import CustomFieldRenderer from "./CustomFieldRenderer";
import RadioFieldInput from "./fields/RadioFieldInput";
import EmailInputField from "./fields/EmailInputField";
import PhoneFieldInput from "./fields/PhoneFieldInput";
import CheckboxFieldInput from "./fields/CheckBoxFieldInput";
import MultiTextFieldInput from "./fields/MultiTextFieldInput";
import TextField from "./fields/TextField";
import RangeFieldInput from "./fields/RangeFieldInput";
import { DateRangePicker } from "./fields/DateRangePicker";


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

    case FormFieldTypeEnum.RANGE:
      return <RangeFieldInput field={field} />;

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
