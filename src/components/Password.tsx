interface PasswordProps {
  pw: string;
  setPw: (a: string) => void;
}

function PasswordField({ pw, setPw, ...props }: PasswordProps & { [key: string]: any }) {
  console.log(props);
  return (
    <>
      <label className="form-label" htmlFor="password">
        {props.payload.output[0].value}
      </label>
      <input
        name={props.payload.input[0].name}
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
