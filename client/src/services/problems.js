
import axios  from "../api/axios";

const url = 'problem/'



export const getProblem  = async (id) => { 
    const res = await axios.get(`${url}${id}`);
    return await res.data ;
}

export const getProblems = async (body) => {
    const res = await axios.post(`${url}problemPage`, body);
    return await res.data ;

}

export const getProblemStatus = async (id) => {
    const res = await axios.get(`${url}problemStatus/${id}` );
    return await res.data ;
}

export const addproblem = async (body) =>  {
    const res = await axios.post(url, body);
    return await res.data ;
}



