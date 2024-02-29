import { useQuery } from '@tanstack/react-query';
import { getProblemStatus } from './services/problems';


const GetProblemStatus = ({ id }) => {

    const {data, isPending, isError, error} = useQuery({
        queryKey : ['status',id],
        queryFn :  () => {
            return getProblemStatus(id);
        }
    });
    
    const status = data?.status
    if (status === "Accepted") {
        return (
            <div className="problem-status" style={{ color: '#02b102', fontSize: '20px' }} title={status}>&#x2713;</div>
        )
    } else if (status === "Compilation Error") {
        return (
            <div className="problem-status" style={{ color: 'red', fontSize: '17px' }} title={status}>CE</div>
        )
    } else if (status === "Wrong Answer") {
        return (
            <div className="problem-status" style={{ color: 'red', fontSize: '17px' }} title={status}>WA</div>
        )
    } else if (status === "Time Limit Exceeded") {
        return (
            <div className="problem-status" style={{ color: 'red', fontSize: '17px' }} title={status}>TLE</div>
        )
    } else if (status === "Memory Limit Exceeded") {
        return (
            <div className="problem-status" style={{ color: 'red', fontSize: '17px' }} title={status}>MLE</div>
        )
    } else if (status === "In Queue" || status === 'Processing') {
        return (
            <div className="problem-status" style={{ fontSize: '20px' }} title={status}>&#8987;</div>
        )
    } else {
        return (
            <div className="problem-status" title={status}>Unsolved</div>
        )
    }
}

export default GetProblemStatus;