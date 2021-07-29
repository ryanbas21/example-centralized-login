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
    <span>
      <label className="form-label" htmlFor="username">
        {props.payload.output[0].value}
      <input
        name={props.payload.input[0].name}
        className="form-control"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      </label>
    </span>
  );
}

export default UsernameFields;
