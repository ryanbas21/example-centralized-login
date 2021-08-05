import { PasswordCallback } from "@forgerock/javascript-sdk";

interface PasswordProps {
  pw: string;
  setPw: (a: string) => void;
}

function PasswordField({ pw, setPw, ...props }: PasswordProps & { [key: string]: any }) {
  const pass = new PasswordCallback(props.payload);
  return (
    <>
      <label className="form-label" htmlFor="password">
        {pass.getOutputValue(0) as string}
      </label>
      <input
        name={pass.getInputValue(0) as string}
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
