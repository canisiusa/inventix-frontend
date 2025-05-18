import React from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FieldPath, FieldValues, Control } from "react-hook-form";
import { useInfiniteSearchFetcher } from "@/hooks/useInfiniteSearchFetcher";

interface ComboboxAsyncProps<TFormSchema extends FieldValues, TItem> {
  name: FieldPath<TFormSchema>;
  control: Control<TFormSchema>;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  fetcher: (params: { search: string; page: number; limit: number }) => Promise<TItem[]>;
  limit?: number;
  onChange?: (selected: TItem | undefined) => void;
  initialValue?: TItem;
  getId: (item: TItem) => string;
  getLabel: (item: TItem) => string;
}

export const ComboboxAsync = <TFormSchema extends FieldValues, TItem>({
  name,
  control,
  label,
  placeholder = "Rechercher...",
  disabled,
  fetcher,
  limit = 20,
  onChange,
  initialValue,
  getId,
  getLabel,
}: ComboboxAsyncProps<TFormSchema, TItem>) => {

  const {
    items,
    setQuery,
    loading,
    listRef,
    onScroll,
  } = useInfiniteSearchFetcher<TItem>({
    initialQuery: "",
    limit,
    initialValue,
    fetcher,
    getId,
  });
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {

        return (
          <FormItem className="flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Combobox
                value={field.value}
                disabled={disabled}
                onChange={(val) => {
                  field.onChange(val);
                  const found = items.find((i) => getId(i) === val);
                  onChange?.(found);
                }}
              >

                <div className="relative">
                  <ComboboxInput
                    onChange={(e) => setQuery(e.target.value)}
                    displayValue={(value: string) =>
                      getLabel(items.find((i) => getId(i) === value)!) ?? ""
                    }
                    placeholder={placeholder}
                    className={cn(
                      "w-full border border-input bg-background rounded-md px-3 py-2 pr-10 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                  />
                  <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                  </ComboboxButton>
                  <ComboboxOptions
                    as="div"
                    ref={listRef}
                    onScroll={onScroll}
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-lg"
                  >
                    {items.map((item) => (
                      <ComboboxOption
                        key={getId(item)}
                        value={getId(item)}
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
                              {getLabel(item)}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </ComboboxOption>
                    ))}
                    {loading && (
                      <div className="text-center py-2 text-xs text-muted-foreground">
                        Chargement...
                      </div>
                    )}
                  </ComboboxOptions>
                </div>
              </Combobox>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
