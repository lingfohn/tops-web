import { axios } from '@/utils/request'
export const getProjects = (params) => {
  return axios({
    url: '/projects',
    method: 'get',
    params: params,
  })
}

export const createProject = (params) => {
  return axios({
    url: '/projects',
    method: 'post',
    data: params,
  })
}

export const deleteProject = (id) => {
  return axios({
    url: '/projects/'+id,
    method: 'delete'
  })
}

export const getApplications = (params) => {
  return axios({
    url: '/applications',
    method: 'get',
    params: params,
  })
}

export const createApplication = (params) => {
  return axios({
    url: '/applications',
    method: 'post',
    data: params,
  })
}

export const deleteApplication = (id) => {
  return axios({
    url: '/applications/' + id,
    method: 'delete',
  })
}

export const getApplication = (id) => {
  return axios({
    url: '/applications/' + id,
    method: 'get',
  })
}

export const getInstances = (appId, params) => {
  return axios({
    url: '/applications/' + appId + '/instances',
    method: 'get',
    params: params,
  })
}

export const createInstance = (appId, params) => {
  return axios({
    url: '/applications/' + appId + '/instances',
    method: 'post',
    data: params,
  })
}

export const loadInstanceTag = (insId,params) => {
  return axios({
    url: '/instances/' + insId + '/tags',
    method: 'get',
    params: params,
  })
}

export const createInstanceBuild = (insId,params) => {
  return axios({
    url: '/instances/' + insId + '/builds',
    method: 'post',
    data: params,
  })
}