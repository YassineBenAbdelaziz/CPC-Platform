import { Navigate } from "react-router-dom";

function Error({ err }) {
  if (err?.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (err.response.status === 404) {
      // Navigate to not found
      return <Navigate to="*" replace={true} />;
    } else if (err.response.status === 403) {
      // Navigate to login
      return <Navigate to="/login" replace={true} />;
    }
  } //else if (error.request) {
  // The request was made but no response was received
  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  // http.ClientRequest in node.js
  return (
    <div className="error">
      Oups ! An Error Occured, please check your internet connection or try again later.
    </div>
  );
}

export default Error;
