import { axios } from '@/utils/request'
export const getUsers = (params) => {
  return axios({
    url: '/users',
    method: 'get',
    params: params,
  })
}
export const createUsers = (params) => {
  return axios({
    url: '/users',
    method: 'post',
    data: params,
  })
}
export const modifyUser = (id, params) => {
  return axios({
    url: '/users/' + id,
    method: 'put',
    data: params,
  })
}

export const deleteUsers = (id) => {
  return axios({
    url: '/users/' + id,
    method: 'delete',
  })
}

export const login = (params) => {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: params,
  })
}

export const getPermission = (params) => {
  return axios({
    url: '/auth/permissions',
    method: 'get',
    params: params,
  })
}

export const deletePermission = (id) => {
  return axios({
    url: '/auth/permissions/' + id,
    method: 'delete',
  })
}

export const createPermission = (params) => {
  return axios({
    url: '/auth/permissions',
    method: 'post',
    data: params,
  })
}

export const getRoles = (params) => {
  return axios({
    url: '/auth/roles',
    method: 'get',
    params: params,
  })
}

export const deleteRole = (id) => {
  return axios({
    url: '/auth/roles/' + id,
    method: 'delete',
  })
}

export const createRole = (params) => {
  return axios({
    url: '/auth/roles',
    method: 'post',
    data: params,
  })
}

export const modifyPermission = (id, params) => {
  return axios({
    url: '/auth/permissions/' + id,
    method: 'put',
    data: params,
  })
}

export const modifyRole = (id, params) => {
  return axios({
    url: '/auth/roles/' + id,
    method: 'put',
    data: params,
  })
}

export const createMenu = (params) => {
  return axios({
    url: '/auth/menus',
    method: 'post',
    data: params,
  })
}

export const modifyMenu = (id, params) => {
  return axios({
    url: '/auth/menus/' + id,
    method: 'put',
    data: params,
  })
}

export const getMenus = (params) => {
  return axios({
    url: '/auth/menus',
    method: 'get',
    params: params,
  })
}

export const deleteMenu = (id) => {
  return axios({
    url: '/auth/menus/' + id,
    method: 'delete',
  })
}
