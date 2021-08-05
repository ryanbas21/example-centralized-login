import { PasswordCallback } from "@forgerock/javascript-sdk";

interface PasswordProps {
  pw: string;
  setPw: (a: string) => void;
}

function PasswordField({ pw, setPw, cb }: PasswordProps & { cb: PasswordCallback, [key: string]: any }) {
  return (
    <>
      <label className="form-label" htmlFor="password">
        {cb.getPrompt() as string}
      </label>
      <input
        name={cb.getPrompt()}
        className="form-control"
        type="password"
        id="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
    </>
  );
}

export default PasswordField;
