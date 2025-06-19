<script setup lang="ts">
import { reactive, computed } from 'vue'
import './DynamicForm.scss'
import { InputFieldConfig, SelectFieldConfig, CheckboxFieldConfig, FieldConfig } from './types'

const props = defineProps<{
  fields: FieldConfig[]
}>()
const emit = defineEmits<{ (e: 'submit', data: Record<string, any>): void }>()

const formData = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string | null>>({})

props.fields.forEach(field => {
  if (field.type === 'checkbox') {
    formData[field.name] = false
  } else {
    formData[field.name] = ''
  }
  errors[field.name] = null
})

const validateField = (field: FieldConfig, value: any): string | null => {
  if (field.required) {
    if (field.type === 'checkbox') {
      if (!value) return 'Обязательное поле'
    } else {
      if (!value || value.toString().trim() === '') return 'Обязательное поле'
    }
  }
  if (field.type === 'input' && field.validation) {
    if (field.validation.minLength && value.length < field.validation.minLength) {
      return `Минимум ${field.validation.minLength} символов`
    }
    if (field.validation.maxLength && value.length > field.validation.maxLength) {
      return `Максимум ${field.validation.maxLength} символов`
    }
    if (field.validation.pattern && !field.validation.pattern.test(value)) {
      return 'Неверный формат'
    }
    if (field.validation.custom) {
      const customError = field.validation.custom(value)
      if (customError) return customError
    }
  }
  return null
}

const validateForm = () => {
  props.fields.forEach(field => {
    errors[field.name] = validateField(field, formData[field.name])
  })
}

const isFormValid = computed(() => {
  return props.fields.every(field => {
    if (field.required) {
      return !validateField(field, formData[field.name])
    }
    if (formData[field.name]) {
      return !validateField(field, formData[field.name])
    }
    return true
  })
})

const handleInput = (field: FieldConfig, value: any) => {
  formData[field.name] = value
  errors[field.name] = validateField(field, value)
}

const handleSubmit = (e: Event) => {
  e.preventDefault()
  validateForm()
  if (isFormValid.value) {
    emit('submit', { ...formData })
  }
}
</script>

<template>
  <form class="dynamic-form" @submit="handleSubmit" novalidate>
    <div v-for="field in fields" :key="field.name" class="form-group">
      <label v-if="field.type !== 'checkbox'" :for="field.name" class="form-label">{{ field.label }}<span v-if="field.required" class="required">*</span></label>
      <template v-if="field.type === 'input'">
        <input
          :id="field.name"
          :name="field.name"
          type="text"
          class="form-input"
          v-model="formData[field.name]"
          @input="handleInput(field, formData[field.name])"
          :aria-required="field.required ? 'true' : 'false'"
        />
      </template>
      <template v-else-if="field.type === 'select'">
        <select
          :id="field.name"
          :name="field.name"
          class="form-select"
          v-model="formData[field.name]"
          @change="handleInput(field, formData[field.name])"
          :aria-required="field.required ? 'true' : 'false'"
        >
          <option value="" disabled>Выберите...</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </template>
      <template v-else-if="field.type === 'checkbox'">
        <label class="form-checkbox">
          <input
            type="checkbox"
            :id="field.name"
            :name="field.name"
            v-model="formData[field.name]"
            @change="handleInput(field, formData[field.name])"
            :aria-required="field.required ? 'true' : 'false'"
          />
          {{ field.label }}<span v-if="field.required" class="required">*</span>
        </label>
      </template>
      <div v-if="errors[field.name]" class="form-error">{{ errors[field.name] }}</div>
    </div>
    <button type="submit" class="form-submit" :disabled="!isFormValid">Зарегистрироваться</button>
  </form>
</template> 