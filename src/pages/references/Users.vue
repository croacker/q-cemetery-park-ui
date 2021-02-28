<template>
  <q-page padding>
    <q-table
      title="Пользователи"
      separator="cell"
      :data="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
    />
  </q-page>
</template>

<script>
export default {
  name: 'UsersReferences',
  data () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Имя',
          align: 'left',
          field: 'name',
          sortable: true
        },
        { name: 'role', align: 'left', label: 'Роль', field: 'role', sortable: true },
        { name: 'active', align: 'left', label: 'Активен', field: 'active', format: val => val ? 'Да' : 'Нет', sortable: true }
      ],
      data: [
        {
          name: 'admin',
          role: 'ADMINISTRATOR',
          active: true
        },
        {
          name: 'user',
          role: 'USER',
          active: true
        }
      ]
    }
  }
}
</script>
