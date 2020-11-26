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

export const getApplications = (params) => {
  return axios({
    url: '/applications',
    method: 'get',
    params: params,
  })
}
