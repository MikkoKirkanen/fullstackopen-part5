import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL + 'login'

const login = (loginObj) => {
  return axios.post(baseUrl, loginObj).then((res) => res.data)
}

export default { login }
