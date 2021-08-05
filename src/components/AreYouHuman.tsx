import { ChoiceCallback } from "@forgerock/javascript-sdk";

interface AreYouHumanProps {
  human: number;
  setHuman: any;
  cb: ChoiceCallback;
}

function AreYouHuman({ human, setHuman, cb }: AreYouHumanProps & { [key: string]: any }) {
  return (
    <div>
      <header>{cb.getPrompt()}</header>
      {console.log(cb.getChoices(), cb.getDefaultChoice())}
      {cb.getChoices().map((v: string, i: number) => 
	<>
	  <label htmlFor={v}>{v}</label>
	  <input
	    id={v}
	    checked={i === cb.getDefaultChoice() ? Boolean(human) : !Boolean(human)}
	    type="radio"
	    value={i}
	    onClick={() => setHuman(i)}
	  />
	</>
      )}
    </div>
  );
}

export default AreYouHuman;
