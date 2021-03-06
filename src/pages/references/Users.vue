<template>
  <q-page padding>
    <q-table
      title="Пользователи"
      separator="cell"
      :data="users"
      :columns="columns"
      :filter="filter"
      :rows-per-page-options="[10, 20, 50]"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="Нет данных"
      no-results-label="Нет данных"
      rows-per-page-label="Записей на странице"
    >
      <template v-slot:top-right>
        <q-input borderless debounce="400" v-model="filter" placeholder="Поиск">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn color="primary" :disable="loading" icon="person_add" class="q-ml-md" @click="createNewUser">
          <q-tooltip>Создать</q-tooltip>
        </q-btn>
<!--        <q-btn color="primary" :disable="loading" icon="mode_edit" class="q-ml-md">-->
<!--          <q-tooltip>Редактировать</q-tooltip>-->
<!--        </q-btn>-->
        <q-btn color="red" :disable="loading" icon="person_off" class="q-ml-md">
          <q-tooltip>Удалить</q-tooltip>
        </q-btn>
      </template>
    </q-table>

    <q-dialog v-model="createDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Новый пользователь</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newUser.name" label="Имя"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ОК" @click="confirmEdit"  />
          <q-btn flat label="Отмена" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
const defaultUsers = [
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
      selected: [],
      createDialog: false,
      newUser: {}
    }
  },
  computed: {
    users () {
      return this.$store.getters.users.map(stored => {
        return {
          name: stored.name,
          role: stored.role,
          active: stored.active
        }
      })
    }
  },
  mounted () {
    this.initUsers()
  },
  methods: {
    initUsers () {
      if (this.$store.getters.users.length === 0) {
        this.$store.commit('users', defaultUsers)
      }
    },
    createNewUser () {
      this.createDialog = true
    }
  }
}
</script>
