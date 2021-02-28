const routes = [
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'cemetery-areas', component: () => import('pages/CemeteryAreas.vue') },
      { path: 'users', component: () => import('pages/references/Users.vue') },
      { path: 'reports', component: () => import('pages/Reports.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') }
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
