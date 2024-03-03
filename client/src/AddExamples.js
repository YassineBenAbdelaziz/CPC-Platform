import React, { useState } from 'react'
import close from "./imgs/close.png";
import add from "./imgs/add.png";

export default function AddExamples(props) {

    const [data, setData] = useState([]);

    const handleClick = () => {
        setData([...data, { input: "", output: "" }])
    }

    const handleChange = (e, i) => {
        const name = e.target.name;
        const value = e.target.value;
        const onChangeVal = [...data];
        onChangeVal[i][name] = value;
        setData(onChangeVal);
        props.getData(onChangeVal);
    }

    const handleDelete = (i) => {
        const deleteVal = [...data];
        deleteVal.splice(i, 1);
        setData(deleteVal);
        props.getData(deleteVal);
    }

    return (
        <div className='input-field exp' style={{ display: 'block' }}>

            <label htmlFor="memory-limit">{props.name} : </label>
            <img src={add} style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                marginLeft: '5px',
                marginBottom: '-4px'
            }} alt="add" onClick={handleClick} />
            {/* <button onClick={handleClick}>+</button> */}

            <div className='example-input'>

                {
                    data.map((val, i) =>
                        <div key={i} style={{ display: 'flex', alignItems: 'center' }} >
                            <textarea
                                required
                                placeholder="Input"
                                name="input"
                                id={`input${i}`}
                                cols="20"
                                rows="5"
                                value={val.input}
                                onChange={(e) => handleChange(e, i)}
                                style={{
                                    margin: '15px 0 10px 20px',
                                }}
                            ></textarea>
                            <textarea
                                required={!props.checker}
                                disabled={props.checker}
                                placeholder="Output"
                                name="output"
                                id={`output${i}`}
                                cols="20"
                                rows="5"
                                value={val.output}
                                onChange={(e) => handleChange(e, i)}
                                style={{
                                    margin: '15px 0 10px 20px',
                                }}
                            ></textarea>
                            <img src={close} style={{
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                marginLeft: '10px',
                            }}
                                alt="close"
                                onClick={() => handleDelete(i)} />
                            {/* <button onClick={() => handleDelete(i)}>Delete</button> */}
                        </div>
                    )
                }

            </div>
        </div>
    )
}
