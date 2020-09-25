import { PageLayout } from '@/layouts'
const authModle = {
  path: '/auth',
  name: 'auth',
  redirect: '/auth/user',
  component: () => import('@/layouts/PageLayout'),
  meta: { title: '权限管理', keepAlive: true, icon: 'thunderbolt' },
  children: [
    {
      path: '/auth/user',
      name: 'userList',
      component: () => import('@/views/auth/users/UserList'),
      meta: { title: '用户列表', keepAlive: true },
    },
    {
      path: '/auth/permission',
      name: 'permissionList',
      component: () => import('@/views/auth/permission/PermissionList'),
      meta: { title: '权限管理', keepAlive: true },
    },
    {
      path: '/auth/role',
      name: 'roleList',
      component: () => import('@/views/auth/role/RoleList'),
      meta: { title: '角色管理', keepAlive: true },
    },
    {
      path: '/auth/menu',
      name: 'menuList',
      component: () => import('@/views/auth/menu/MenuList'),
      meta: { title: '菜单管理', keepAlive: true },
    },
  ],
}

export default authModle
