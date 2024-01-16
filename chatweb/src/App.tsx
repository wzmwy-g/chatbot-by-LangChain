import { useEffect, useRef, useState } from "react";
import { DialogData } from "./types/chat";
import Record from "./components/record";

const App = () => {
  const [conversation, setConversation] = useState<DialogData[]>([]);
  const latestAsk = useRef<string>("");
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    fetch("http://localhost:5000/getHistory", {
      method: "GET",
    })
      .then((response: Response) => {
        if (!response.ok) {
          console.log(response);
        }
        return response.text();
      })
      .then((data) => {
        const parsed_data = JSON.parse(data);
        console.log(parsed_data);
        const historyConversation = [];
        for (const key in parsed_data) {
          const isEven = parseInt(key) % 2 === 0;
          const speaker = isEven ? "You" : "chatGPT";
          const message: DialogData = {
            speaker: speaker,
            content: parsed_data[key].data.content,
          };
          historyConversation.push(message);
        }
        setConversation(historyConversation);
      });
  }, []);

  const sendText = (inputValue: string) => {
    setIsSending(true);
    setInputValue("");
    latestAsk.current = inputValue;
    const newHumanMessage: DialogData = {
      speaker: "You",
      content: latestAsk.current,
    };
    setConversation((preConversation) => [...preConversation, newHumanMessage]);
    fetch("http://localhost:5000/sendText", {
      method: "POST",
      body: inputValue,
    })
      .then((response: Response) => {
        if (!response.ok) {
          console.log(response);
          setIsSending(false);
        }
        return response.text();
      })
      .then((data) => {
        const newAIMessage: DialogData = {
          speaker: "chatGPT",
          content: data,
        };
        setConversation((preConversation) => [
          ...preConversation,
          newAIMessage,
        ]);
        setIsSending(false);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // 阻止默认行为，避免在文本框中输入回车换行
      e.preventDefault();
      // 触发按钮的点击事件
      sendText(inputValue);
    }
  };

  const resetChat = () => {
    fetch("http://localhost:5000/reset", {
      method: "POST",
    }).then((response: Response) => {
      if (!response.ok) {
        console.log(response);
      }
      return response.text();
    });
    setConversation([]);
    //console.log("send!");
  };

  return (
    <>
      <div className={"font-bold text-3xl text-center mb-10"}>AIChatBot</div>
      <div>
        <Record chatRecord={conversation}></Record>
      </div>

      <div className={"w-full h-12 fixed bottom-12 flex justify-center ml-4"}>
        <input
          className={"w-3/4 h-full border-4 outline-none pl-3"}
          type="text"
          id="myInput"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="在这里输入..."
          autoComplete="off"
        />
        <button
          className={"ml-2 border-2 w-20 active:border-cyan-300"}
          onClick={() => !isSending && sendText(inputValue)}
        >
          {isSending ? "发送中..." : "发送"}
        </button>
        <button
          className={"ml-2 border-2 w-20 active:border-cyan-300"}
          onClick={() => resetChat()}
        >
          清空聊天
        </button>
      </div>
    </>
  );
};

export default App;
