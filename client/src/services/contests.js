import axios  from "../api/axios";



const url = 'contest/' ;

export const getUpcomingContests = async () => {
    const res = await axios.get(`${url}upcoming`);
    return await res.data ;
}


export const getPreviousContests = async (body) => {
    const res = await axios.post(`${url}previous`, body);
    return await res.data ;
}

export const addContest = async (body) => {
    return await axios.post(`${url}add`,body);
}
