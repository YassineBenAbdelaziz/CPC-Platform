import axios  from "../api/axios";



const url = 'submission/' ;


export const getAllSubmissions = async (submissionUrl, body) => {
    const res = await axios.post(`${url}${submissionUrl}`, body);
    return await res.data ;

}

export const getSubmission = async (id) => {
    const res = await axios.get(`${url}${id}`);
    return await res.data ;
};



export const createSubmission = async (body) => {
    const res = await axios.post(url,body);
    return res.data ;
};

