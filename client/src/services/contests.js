import axios  from "../api/axios";



const url = 'contest/' ;

export const getContests = async () => {
    const res = await axios.get(`${url}`);
    return await res.data ;
}


