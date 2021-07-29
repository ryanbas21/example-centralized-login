interface AreYouHumanProps {
  human: number;
  setHuman: any;
}

function AreYouHuman({ human, setHuman, ...props }: AreYouHumanProps & { [key: string]: any }) {
  return (
    <div>
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
