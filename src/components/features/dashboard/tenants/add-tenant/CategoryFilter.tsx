"use client";
import { z } from "zod";
import { FormFieldTypeEnum, FormField } from "@/components/utils/form_builder/types";
import CustomForm from "@/components/utils/form_builder/form";

const categoryFilterSchema = z.object({
  category: z.string(),
});

export default function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: { id?: string; name?: string }[];
  selectedCategory?: string;
  setSelectedCategory: (id: string) => void;
}) {
  const fields: FormField[] = [
    {
      fieldId: "category",
      fieldType: FormFieldTypeEnum.SELECT,
      label: "Category",
      options: categories.map((c) => ({ value: c.id!, label: c.name!, key: c.id! })),
      default: selectedCategory || categories[0]?.id || "",
      onChange: (id) => setSelectedCategory(id),
    },
  ];

  return <CustomForm fields={fields} schema={categoryFilterSchema} />;
}
