<template>
  <q-page padding>
    <q-table
      title="Пользователи"
      separator="cell"
      :data="data"
      :columns="columns"
      :filter="filter"
      row-key="name"
      selection="multiple"
      no-data-label="Нет данных"
      no-results-label="Нет данных"
    >
      <template v-slot:top-right>
        <q-input borderless debounce="400" v-model="filter" placeholder="Поиск">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn color="primary" :disable="loading" icon="person_add" class="q-ml-md">
          <q-tooltip>Создать</q-tooltip>
        </q-btn>
        <q-btn color="primary" :disable="loading" icon="mode_edit" class="q-ml-md">
          <q-tooltip>Редактировать</q-tooltip>
        </q-btn>
        <q-btn color="red" :disable="loading" icon="person_off" class="q-ml-md">
          <q-tooltip>Удалить</q-tooltip>
        </q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  name: 'UsersReferences',
  data () {
    return {
      filter: '',
      loading: false,
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
          name: 'user1',
          role: 'USER',
          active: true
        },
        {
          name: 'user2',
          role: 'USER',
          active: true
        },
        {
          name: 'user3',
          role: 'USER',
          active: false
        }
      ]
    }
  }
}
</script>
