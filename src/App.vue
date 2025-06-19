<script setup lang="ts">
import DynamicForm from './components/DynamicForm.vue'
import { InputFieldConfig, SelectFieldConfig, CheckboxFieldConfig, FieldConfig } from './components/types'

const registrationFields: FieldConfig[] = [
  {
    type: 'input',
    label: 'Логин',
    name: 'login',
    required: true,
    validation: {
      minLength: 3,
      maxLength: 255,
    },
  },
  {
    type: 'input',
    label: 'Email',
    name: 'email',
    required: false,
    validation: {
      pattern: /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i,
      custom: (value: string) => {
        if (value && !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(value)) {
          return 'Введите корректный email'
        }
        return null
      },
    },
  },
  {
    type: 'input',
    label: 'Пароль',
    name: 'password',
    required: true,
    validation: {
      minLength: 6,
    },
  },
  {
    type: 'select',
    label: 'Роль',
    name: 'role',
    required: true,
    options: [
      { label: 'Админ', value: 'admin' },
      { label: 'Пользователь', value: 'user' },
    ],
  },
  {
    type: 'checkbox',
    label: 'Согласие с политикой конфиденциальности',
    name: 'privacy',
    required: true,
  },
]

const handleSubmit = (data: Record<string, any>) => {
  alert('Регистрация успешна!\n' + JSON.stringify(data, null, 2))
}
</script>

<template>
  <main class="register-bg">
    <DynamicForm :fields="registrationFields" @submit="handleSubmit" />
  </main>
</template>
