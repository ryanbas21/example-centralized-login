import { NameCallback } from "@forgerock/javascript-sdk";

interface UsernameProps {
  username: string;
  setUsername: (a: string) => void;
}

function UsernameFields({
  username,
  setUsername,
  ...props
}: UsernameProps & { [key: string]: any }) {
  const name = new NameCallback(props.payload)
  return (
    <span>
      <label className="form-label" htmlFor="username">
	{name.getOutputValue(0)}
      <input
        name={name.getInputValue(0) as string}
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
