import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL + 'blogs'
let headers = null

const setToken = (token) => {
  headers = { headers: {"Authorization" : `Bearer ${token}`} }
}

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data)
}

const create = (newBlog) => {
  return axios.post(baseUrl, newBlog, headers).then((res) => res.data);
};

const update = (blog, id) => {
  return axios.put(`${baseUrl}/${id}`, blog, headers).then((res) => res.data);
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`, headers).then((res) => res.data);
}

export default { setToken, getAll, create, update, remove }
