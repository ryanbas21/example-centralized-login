import { ChoiceCallback } from "@forgerock/javascript-sdk";

interface AreYouHumanProps {
  human: number;
  setHuman: any;
}

function AreYouHuman({ human, setHuman, ...props }: AreYouHumanProps & { [key: string]: any }) {
  const choice = new ChoiceCallback(props.payload);
  return (
    <div>
      <header>{choice.getOutputValue(0) as string}</header>
      <label htmlFor={'Yes'}>Yes</label>
      <input
        id="Yes"
        checked={!Boolean(human)}
        type="radio"
        value={0}
        onClick={() => setHuman(0)}
      />

      <label htmlFor={'No'}>No</label>
      <input id="No" checked={Boolean(human)} type="radio" value={1} onClick={() => setHuman(1)} />
    </div>
  );
}

export default AreYouHuman;
