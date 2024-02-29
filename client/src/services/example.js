import axios  from "../api/axios";



const url = 'example/' ;

export const getAllSubmissions = async (id) => {
    const res = axios.get(url);
    return res.data ;
};

export const findByProblem  = async (id) => { 
    const res = await axios.get(`${url}/findByProblem/${id}`);
    return await res.data ;
}


export const getSubmission = async (id) => {
    const res = axios.get(url);
    return res.data ;
};



export const createSubmission = async (body) => {
    const res = axios.post(url,body);
    return res.data ;
};

