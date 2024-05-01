import { Link, useNavigate } from "react-router-dom";
import styles from './ContestList.module.css'



function ContestList({ rows, type }) {

    const dateToString = (str) => {
        const date = new Date(str);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}`;
        
        return formattedDate;
    }


    return (
        <>
            <div className="contest-list">
                {   
                    type === 'upcoming' &&
                    <table className={styles.table}>
                        <thead>
                        <tr className={styles.table_header}>
                            <th className={styles.title} >Title</th>
                            <th className={`${styles.author} `}>Author</th>
                            <th className={`${styles.contest_date} `} >Date</th>
                            <th className={`${styles.duration} `}>Duration</th>
                            <th className={`${styles.contest_start} `} >Start Time</th>
                            <th className={`${styles.register} `}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((contest, index) => (
                            <tr className={styles.tr} key={index}>
                                <td className={styles.title_row}>{contest.title}</td>
                                <td>{"Rami"}</td>
                                <td>{dateToString(contest.date)}</td>
                                <td>{contest.duration}</td>
                                <td>{contest.start}</td>
                                <td>{"Register >>>"}</td>
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                }

                {
                    type === 'previous' &&
                    <table className={styles.table}>
                        <thead>
                        <tr className={styles.table_header}>
                            <th className={styles.title} >Title</th>
                            <th className={`${styles.author} `}>Author</th>
                            <th className={`${styles.contest_date} `} >Date</th>
                            <th className={`${styles.duration} `}>Duration</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((contest, index) => (
                            <tr className={styles.tr} key={index}>
                                <td className={styles.title_row}>{contest.title}</td>
                                <td>{"Rami"}</td>
                                <td>{dateToString(contest.date)}</td>
                                <td>{contest.duration}</td>
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                }

            </div>

        </>
    )


}


export default ContestList;