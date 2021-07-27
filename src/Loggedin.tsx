import { FRAuth } from "@forgerock/javascript-sdk/lib";

export default (_props: {}) => {

  const handleClick = (e) => {
    FRAuth.next(props.prevStep).then(handleStep); 
  };

  return (
    <>
      <h1>Logged in Successfully!</h1>
      <button onClick={handleClick} type="submit" id="logout">
        Logout
      </button>
    </>
  );
};
