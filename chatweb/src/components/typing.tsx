import { useEffect, useState } from "react";

interface TypingProps {
  text: string;
  onComplete: () => void;
}

const Typing = (props: TypingProps) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    console.log(props.text,1);
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayText((prevText) => prevText + props.text[index]);
      index += 1;
      console.log(props.text.length, index);
      if (index >= props.text.length) {
        clearInterval(intervalId);
        setShowCursor(false);
        // 逐字显示完成后调用回调函数，通知父组件
        props.onComplete();
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, [props]);

  return (
    <>
      <div>{displayText}</div>
      {showCursor && <div>EndOfText</div>}
    </>
  );
};

export default Typing;
