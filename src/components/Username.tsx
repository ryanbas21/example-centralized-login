import { NameCallback } from "@forgerock/javascript-sdk";

interface UsernameProps {
  username: string;
  setUsername: (a: string) => void;
}

function UsernameFields({
  username,
  setUsername,
  cb
}: UsernameProps & { cb: NameCallback, [key: string]: any }) {
  return (
    <span>
      <label className="form-label" htmlFor="username">
	{cb.getPrompt()}
      <input
        name={cb.getPrompt()}
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
