interface UsernameProps {
  username: string;
  setUsername: (a: string) => void;
}

function UsernameFields({
  username,
  setUsername,
  ...props
}: UsernameProps & { [key: string]: any }) {
  return (
    <>
      <label className="form-label" htmlFor="username">
        {props.payload.output[0].value}
      </label>
      <input
        name={props.payload.input[0].name}
        className="form-control"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </>
  );
}

export default UsernameFields;
