import { Control, Controller, FieldValues, Path } from 'react-hook-form'

import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormField
