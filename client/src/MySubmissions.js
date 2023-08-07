import SubmissionList from "./SubmissionList";
import useFetch from "./useFetch";
import { useParams } from "react-router-dom";

export default function MySubmissions() {
    const url = 'http://localhost:5000/';

    const { id } = useParams();

    const { data: submissions, isPending, error } = useFetch(url + 'submission/findByProblemAndUser/' + id + "/23");

    return (
        <>
            <SubmissionList submissions={submissions} error={error} isPending={isPending} />
        </>
    )
}
