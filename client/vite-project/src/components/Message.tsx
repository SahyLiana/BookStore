import axios from "axios";
import { useEffect, useRef } from "react";
import userStore from "../store/UserStore";
import { format } from "timeago.js";

type Props = {
  student: {
    _id: string;
    name?: string;
    email?: string;
  };
};
function Message({ student }: Props) {
  // const [conversation, setConversation] = useState<Conversation | null>();
  const { user, setConversationStore, conversation, socket } = userStore();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("Selected student", student);

    const getConversation = async () => {
      try {
        const conversationCall = await axios.get(
          `http://localhost:3000/api/conversation/${student._id}/${student.name}`
        );

        console.log("conversationCall", conversationCall.data);
        // setConversation(conversationCall.data);
        setConversationStore({
          _id: conversationCall.data._id,
          ...conversationCall.data,
        });

        socket.emit("myConversation", {
          _id: conversationCall.data._id,
          ...conversationCall.data,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on("getConversation", (conversation: any) => {
          console.log("socket conversation", conversation);
        });
      } catch (e) {
        console.log(e);
      }
    };
    getConversation();
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?._id, student._id]);

  return conversation ? (
    conversation.messages?.map((message) => (
      <div
        key={message.timestamp}
        ref={scrollRef}
        className={`${message.sender.user_id === user?._id ? "self-start" : " text-black self-end"} w-[50%]`}
      >
        <p className={`${user?.username ? "text-white" : "text-black"}`}>
          {message.sender.user_id === user?._id
            ? "You"
            : conversation.members.find(
                (member) => member.userId === message.sender.user_id
              )?.name}
        </p>
        <div
          className={`${message.sender.user_id === user?._id ? "bg-blue-600 text-white" : "bg-slate-200 "} px-4 py-1 rounded-xl`}
        >
          <p>{message.message}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {format(message.timestamp)}
        </p>
      </div>
    ))
  ) : (
    <h1 className="text-slate-400 text-center text-3xl">Lets chat...</h1>
  );
}

export default Message;
