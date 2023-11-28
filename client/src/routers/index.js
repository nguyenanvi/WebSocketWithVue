import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Home',
    },
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    meta: {
      title: 'Chat view',
    },
    component: () => import('@/views/ChatView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      title: 'Settings',
    },
    component: () => import('@/views/SettingView.vue')
  },
  // {
  //   path: '/admin',
  //   children: [
  //     {
  //       path: '',
  //       name: 'AdminHome',
  //       meta: {
  //         title: 'Admin Home',
  //         sidebarIcon: 'house',
  //         showInSidebar: 'ADMIN',
  //         requiresAuth: true,
  //         userType: 'ADMIN'
  //       },
  //       component: () => import('@/views/employee/HomeView.vue')
  //     },
  //     {
  //       path: 'signin',
  //       name: 'AdminSignin',
  //       meta: {
  //         title: 'Signin',
  //         userType: 'ADMIN'
  //       },
  //       component: () => import('@/views/employee/authentication/Signin.vue')
  //     },
  //     {
  //       path: 'signup',
  //       name: 'AdminSignup',
  //       meta: {
  //         title: 'Signup',
  //         userType: 'ADMIN'
  //       },
  //       component: () => import('@/views/employee/authentication/Signup.vue')
  //     },
  //     {
  //       path: 'product',
  //       name: 'AdminProductsList',
  //       meta: {
  //         title: 'Product management',
  //         sidebarIcon: 'basket-shopping',
  //         showInSidebar: 'ADMIN',
  //         requiresAuth: true,
  //         userType: 'ADMIN'
  //       },
  //       component: () => import('@/views/employee/product/ProductList.vue')
  //     },
  //     {
  //       path: 'product/add',
  //       name: 'AdminProductAdd',
  //       meta: {
  //         title: 'Add new product',
  //         requiresAuth: true,
  //         userType: 'ADMIN'
  //       },
  //       component: () => import('@/views/employee/product/ProductAdd.vue')
  //     },
  //     {
  //       path: 'product/edit/:id',
  //       name: 'AdminProductEdit',
  //       meta: {
  //         title: 'Edit product',
  //         requiresAuth: true,
  //         userType: 'ADMIN'
  //       },
  //       component: () => import('@/views/employee/product/ProductEdit.vue')
  //     },
  //     // {
  //     //   path: 'employee',
  //     //   name: 'AdminEmployeesList',
  //     //   meta: {
  //     //     title: 'Employee management',
  //     //     sidebarIcon: 'person-chalkboard',
  //     //     showInSidebar: 'ADMIN',
  //     //     requiresAuth: true,
  //     //     userType: 'ADMIN'
  //     //   },
  //     //   component: () => import('@/views/employee/employee/EmployeeList.vue')
  //     // },
  //     // {
  //     //   path: 'employee/add',
  //     //   name: 'AdminEmployeeAdd',
  //     //   meta: {
  //     //     title: 'Add new employee',
  //     //     requiresAuth: true,
  //     //     userType: 'ADMIN'
  //     //   },
  //     //   component: () => import('@/views/employee/employee/EmployeeAdd.vue')
  //     // },
  //     // {
  //     //   path: 'employee/edit/:id',
  //     //   name: 'AdminEmployeeEdit',
  //     //   meta: {
  //     //     title: 'Edit employee',
  //     //     requiresAuth: true,
  //     //     userType: 'ADMIN'
  //     //   },
  //     //   component: () => import('@/views/employee/employee/EmployeeEdit.vue')
  //     // },
  //     {
  //       path: 'order',
  //       name: 'AdminOrdersList',
  //       meta: {
  //         title: 'Order management',
  //         sidebarIcon: 'receipt',
  //         showInSidebar: 'ADMIN',
  //         requiresAuth: true,
  //         userType: 'ADMIN'
  //       },
  //       component: () => import('@/views/employee/order/OrderList.vue')
  //     },
  //   ]
  // },
  {
    path: "/:pathMatch(.*)*",
    title: "Page not found",
    component: import('@/views/NotFound.vue')
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router