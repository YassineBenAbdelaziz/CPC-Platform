import axios  from "../api/axios";


const url = 'tag/' ;

export const getAlltags = async () => {
    const res = await axios.get(url);
    return await res.data ;
};

export const getTag = async (id) => {
    const res = await axios.get(url);
    return await res.data ;
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
    const res = await axios.post(url, body);
    return await res.data ;
};

export const deleteTags = async (body) => {
    const res = await axios.delete(url, {data: body});
    return await res.data ;
};

export const createTags = async (body) => {
    const res = await axios.post(url, body);
    return await res.data ;
};


export const updateTags = async (body) => {
    const res = await axios.patch(url, body);
    return await res.data ;
};