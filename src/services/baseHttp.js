import axios from "axios";


const BASE_URL = "http://54.194.238.190:8080/";
const BASE_URL_FB = "https://react-http2-66530-default-rtdb.firebaseio.com/";

export const httpService = {
  get(endpoint, b) {
    return ajax(endpoint, b);
  },
  post(endpoint, data, b) {
  
    console.log(` httpsService: endpoint: ${endpoint} , data/reqObj ${JSON.stringify(data)}`)
    return ajax(endpoint, data, "POST", b);
  },
  put(endpoint, data, b) {
    return ajax(endpoint, data, "PUT", b);
   },
  delete(endpoint, data, b) {
    return ajax(endpoint, data, "DELETE", b);
  },
};

const ajax = async (endpoint,  data = null, method="GET", base=BASE_URL) => {
  
  try {
    
    const res = await axios({
      url: `${base}${endpoint}`,
      method,
      data,
      body: JSON.stringify(data),
    });
    
    return res.data.content;
  } catch (err) {
    const _data = JSON.stringify(data)
    const customErrorMessage =`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: ${_data}`
    const error = {...err, customErrorMessage}
    console.log(
      customErrorMessage
    );
    console.dir(err);
    if (err.response && err.response.status === 401) {
      sessionStorage.clear();
      if (method === "GET") window.location.assign("/");
    
    }
    throw error;   
  }
}
