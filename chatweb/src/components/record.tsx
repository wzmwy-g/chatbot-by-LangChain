import { DialogData } from "../types/chat";

interface RecordProps {
  chatRecord: DialogData[];
}

const Record = (props: RecordProps) => {
  return (
    <>
      <div className={"w-full overflow-auto mb-28"}>
        {props.chatRecord.map((dialog, index) => (
          <div key={index} className={"flex w-full min-h-16 items-start"}>
            <div
              className={
                "font-bold ml-8 mr-2 min-w-28 text-center border-teal-400 border"
              }
            >
              {dialog.speaker}
            </div>
            <div>
              <div className={"bg-slate-200"}>{dialog.content}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Record;
