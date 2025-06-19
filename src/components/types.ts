export type InputFieldConfig = {
  type: 'input'
  label: string
  name: string
  required?: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | null
  }
}

export type SelectFieldConfig = {
  type: 'select'
  label: string
  name: string
  required?: boolean
  options: { label: string; value: string }[]
}

export type CheckboxFieldConfig = {
  type: 'checkbox'
  label: string
  name: string
  required?: boolean
}

export type FieldConfig = InputFieldConfig | SelectFieldConfig | CheckboxFieldConfig 