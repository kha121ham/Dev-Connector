import axios from "axios";

const setAuthToken = token =>{
    if (token) {
        // eslint-disable-next-line no-unused-expressions
        axios.defaults.headers.common['x-auth-token']=token;
    }
    else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;