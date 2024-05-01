import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from 'react';
import styles from "./CreateContest.module.css"
import { addContest } from "../../services/contests";

function CreateContest() {

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [start, setStart] = useState('');
    const [duration, setDuration] = useState(0);
    

    const {data: res, mutate, isPending, isError, error } = useMutation({
        mutationFn : async (body) => {
            return await addContest(body);
        },
        onSuccess: (data) => {
            console.log(data);
            //queryClient.invalidateQueries(["problems"]);
            //navigate('/problemset', { replace: true });
        },
        onError: (error) => {
            //setFindError(true);
        },
    });



    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            title : title,
            date : date ,
            start : start ,
            duration : duration
        }
        mutate(formData);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.contest_form}>
            <div className={styles.line}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={styles.line}>
                <label htmlFor="date">Date</label>
                <input type="date" name="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />

            </div>
            <div className={styles.line}>
                <label htmlFor="start">Start Time</label>
                <input type="time" name="start" id="start" value={start} onChange={(e) => setStart(e.target.value)} />

            </div>
            <div className={styles.line}>
                <label htmlFor="duration">Duration</label>
                <input type="number" name="duration" id="duration" value={duration}onChange={(e) => setDuration(e.target.value)}  />

            </div>

            <button type="submit"  > Create </button>
        </form>
    );
}


export default CreateContest;