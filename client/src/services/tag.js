import axios  from "../api/axios";



const url = 'tag/' ;

export const getAlltags = async (id) => {
    const res = axios.get(url);
    return res.data ;
};

export const getTag = async (id) => {
    const res = axios.get(url);
    return res.data ;
};

export const findByProblem  = async (id) => { 
    const res = await axios.get(`${url}/findByProblem/${id}`);
    return await res.data ;
}


export const getTagCount = async () => {
    const res = await axios.get(`${url}count`);
    return await res.data ;
};

export const createTag = async (body) => {
    const res = axios.post(url,body);
    return res.data ;
};

