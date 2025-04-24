"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FieldPath, FieldValues, Control } from "react-hook-form";

function getValueByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

type BaseProps<TOption extends Record<string, any>> = {
  options: TOption[];
  labelKey: string;
  valueKey: keyof TOption;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onSelect?: (selected: TOption | null) => void;
  noResultText?: string;
  className?: string;
};

type WithForm<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  value?: never;
  onChange?: never;
};

type WithoutForm<TOption> = {
  control?: never;
  name?: never;
  value: TOption | null;
  onChange: (value: TOption | null) => void;
};

type Props<
  TFieldValues extends FieldValues = any,
  TOption extends Record<string, any> = any
> = BaseProps<TOption> & (WithForm<TFieldValues> | WithoutForm<TOption>);

export const GenericCombobox = <
  TFieldValues extends FieldValues = any,
  TOption extends Record<string, any> = any
>({
  control,
  name,
  options,
  labelKey,
  valueKey,
  label,
  placeholder = "Sélectionner une option",
  required = false,
  disabled = false,
  onSelect,
  noResultText = "Aucun résultat trouvé",
  className,
  value,
  onChange,
}: Props<TFieldValues, TOption>) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((item) =>
        String(getValueByPath(item, labelKey))
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  const renderCombo = (
    selectedOption: TOption | null,
    handleChange: (value: TOption | null) => void
  ) => (
    <Combobox
      value={selectedOption}
      onChange={(option) => {
        handleChange(option);
        if (onSelect) onSelect(option);
      }}
      disabled={disabled}
    >
      <div className={cn("relative", className)}>
        <ComboboxInput
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(item: TOption) =>
            item ? getValueByPath(item, labelKey) ?? "" : ""
          }
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full border border-input bg-background rounded-md px-3 py-2 pr-10 outline-none text-sm shadow-none ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </ComboboxButton>

        <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-lg">
          {filteredOptions.length === 0 ? (
            <div className="cursor-default select-none py-2 px-4 text-sm text-muted-foreground">
              {noResultText}
            </div>
          ) : (
            <>
              <ComboboxOption
                value={null}
                className={({ focus }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-10 pr-4 text-sm",
                    focus ? "bg-accent text-accent-foreground" : ""
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={cn(
                        "block truncate italic text-muted-foreground",
                        selected ? "font-medium" : "font-normal"
                      )}
                    >
                      Aucune sélection
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
              {
                filteredOptions.map((item) => (
                  <ComboboxOption
                    key={String(item[valueKey])}
                    value={item}
                    className={({ focus }) =>
                      cn(
                        "relative cursor-default select-none py-2 pl-10 pr-4 text-sm",
                        focus ? "bg-accent text-accent-foreground" : ""
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={cn(
                            "block truncate",
                            selected ? "font-medium" : "font-normal"
                          )}
                        >
                          {getValueByPath(item, labelKey)}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </ComboboxOption>
                ))
              }
            </>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );

  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const selectedOption = options.find((opt) => opt[valueKey] === field.value) ?? null;

          return (
            <FormItem>
              {label && <FormLabel>
                {label} {required && <span className="text-destructive">*</span>}
              </FormLabel>}
              <FormControl>
                {renderCombo(selectedOption, (opt) => {
                  const value = opt ? opt[valueKey] : ""; // on stocke juste l’ID
                  field.onChange(value);
                  if (onSelect) onSelect(opt ?? null);
                })}
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      {renderCombo(value ?? null, onChange!)}
    </div>
  );
};


// Usage example
// ✅ Exemple sans react-hook-form :
// const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

// <GenericCombobox
//   value={selectedCategory}
//   onChange={setSelectedCategory}
//   options={categories}
//   labelKey="name"
//   valueKey="id"
//   label="Catégorie"
// />


// ✅ Exemple avec react-hook-form :

//  <GenericCombobox
//   control={control}
//   name="category"
//   options={categories}
//   labelKey="name"
//   valueKey="id"
//   label="Catégorie"
// /> 
