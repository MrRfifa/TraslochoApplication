import { useSelector } from "react-redux";

const TestRedux = () => {
  const state = useSelector((state) => state.userSpecInfo.value);

  return (
    <div>
      <p> email : {state.email} </p>
      <p> firstname : {state.firstName}</p>
      <p> lastname : {state.lastName}</p>
      <p> filename : {state.filename}</p>
      <img src={`data:image/*;base64,${state.fileContentBase64}`} />
    </div>
  );
};

export default TestRedux;
