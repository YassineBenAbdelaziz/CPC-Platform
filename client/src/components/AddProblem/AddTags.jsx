/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import close from "../../assets/close.png";
import { getAlltags } from "../../services/tag.js";
import Error from '../Error/Error.jsx'

export default function AddTags(props) {
  const { data: Tags, isPending, isError, error } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      return getAlltags();
    },
  });

  const tags = [];
  Tags &&
    Tags.sort((a, b) => (a.tag > b.tag ? 1 : -1)).map((tag) => {
      tags.push({
        id: tag.id_tag,
        name: tag.tag,
      });
    });

  const [data, setData] = useState([]);

  const handleChange = (e) => {
    let id = 0;
    const value = e.target.value;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].name === value) {
        id = tags[i].id;
      }
    }
    let test = true;
    const onChangeVal = [...data, { id: id, name: value }];
    for (let i = 0; i < onChangeVal.length - 1; i++) {
      if (onChangeVal[i].id === id) test = false;
    }
    if (test || onChangeVal.length === 1) {
      setData(onChangeVal);
      props.getData(onChangeVal);
    }
    test = true;
  };

  const handleDelete = (i) => {
    const deleteVal = [...data];
    deleteVal.splice(i, 1);
    setData(deleteVal);
    props.getData(deleteVal);
  };

  return (
    <>
      {isPending && <div>Loading...</div>}
      {isError && <Error err={error} />}
      {!isError && ! isPending && tags && (
        <div>
          <div className="input-field">
            <label htmlFor="tags">Tags : </label>
            <select
              name="tags"
              id="tags"
              defaultValue=""
              onChange={(e) => handleChange(e)}
            >
              <option value="" disabled>
                Tags
              </option>
              {tags.map((item, i) => {
                return (
                  <option id={item.id} value={item.name} key={i}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="tags">
            {data.map((val, i) => (
              <div key={i} className="tag">
                <div>{val.name}</div>
                <img
                  src={close}
                  style={{
                    width: "13px",
                    height: "13px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  alt="close"
                  onClick={() => handleDelete(i)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
