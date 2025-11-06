// API基础配置
const API_BASE_URL = 'http://localhost:8080';

// 用户相关接口
export const USER_API = {
  LOGIN: `${API_BASE_URL}/user/login`,
  REGISTER: `${API_BASE_URL}/user/create`,
  PAGE: `${API_BASE_URL}/user/page`,
  DETAIL: (id: number) => `${API_BASE_URL}/user/${id}`,
  CREATE: `${API_BASE_URL}/user/create`,
  UPDATE: `${API_BASE_URL}/user/update`,
  DELETE: (id: number) => `${API_BASE_URL}/user/logicDelete/${id}`,
};

// 其他模块接口可以在这里继续添加
// export const PRODUCT_API = {
//   LIST: `${API_BASE_URL}/product/list`,
//   // ...
// };

export default API_BASE_URL;