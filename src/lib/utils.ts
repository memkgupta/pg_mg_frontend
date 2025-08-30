import { FormStyle } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const defaultFormStyle: Required<FormStyle> = {
  gapBetweenFields: 4,
  cols: { sm: 1, md: 2, lg: 3 },
  buttonSubmitColor: "blue-500",
  formPadding: 1,
  formMargin: 1,
  containerClassName:``,
  fieldClassName:``
}

export function parseStyle(style: Partial<FormStyle> = {}) {
  const merged = {
    ...defaultFormStyle,
    ...style,
    cols: {
      ...defaultFormStyle.cols,
      ...style.cols,
    },
  }

  // gap
  const gapClass = `gap-${merged.gapBetweenFields}`

  // grid columns
  const colClasses = [
    merged.cols.sm ? `grid-cols-${merged.cols.sm}` : "",
    merged.cols.md ? `md:grid-cols-${merged.cols.md}` : "",
    merged.cols.lg ? `lg:grid-cols-${merged.cols.lg}` : "",
  ]
    .filter(Boolean)
    .join(" ")

  // padding
  const paddingClass = `p-${merged.formPadding}`

  // margin
  const marginClass = `m-${merged.formMargin}`

  // button color
  const buttonClass = `bg-${merged.buttonSubmitColor} text-white`

  return {
    container: `grid ${gapClass} ${colClasses} ${paddingClass} ${marginClass}`,
    button: `${buttonClass} px-4 py-2 rounded`,
  }
}