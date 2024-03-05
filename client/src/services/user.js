import axios  from "../api/axios";



const url = 'user/' ;

export const getAllUsers = async () => {
    return await axios.get(url); 
};

export const getUser = async (id) => {
    const res = await axios.get(url);
    return res.data ;
};

export const getCurrentUser = async () => {
    const res = await axios.get(`${url}current`);
    return await res.data ;
};

export const getProfile = async (username) => {
    console.log(username);
    const res = await axios.get(`${url}profile/${username}`);
    return await res.data ;
}

export const login = async (body) => {
    const res = await axios.post(`${url}login`,body);
    return await res.data ;
}

export const signup = async (body) => {
    return await axios.post(`${url}register`,body);
};

export const logout = async() => {
    const res = await axios.get(`${url}logout`);
    return await res.data ;
}


export const editProfile = async (id, formData) => {
    const res = await axios.patch(url + id, formData);
    return await res.data;
}
