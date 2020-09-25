import { axios } from '@/utils/request'
export const getList = (parameter) => {
  return axios({
    url: 'https://randomuser.me/api',
    method: 'get',
    params: parameter,
  })
}
