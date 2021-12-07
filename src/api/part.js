import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://inventoryspring.herokuapp.com/api/v1/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });