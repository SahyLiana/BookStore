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
  console.log("selected student from message", student);
  // const [conversation, setConversation] = useState<Conversation | null>();
  const {
    user,
    setConversationStore,
    conversation,
    setConversations,
    conversations,
    setUnreadMessage,
    // setMessageConversationStore,
    // socket,
  } = userStore();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getConversation = async () => {
      console.log("getConversation", user);
      try {
        const conversationCall = await axios.get(
          `http://localhost:3000/api/conversation/${student._id}/${student.name}/${user?._id}`
        );

        console.log("conversationCall", conversationCall.data);

        setConversationStore({
          _id: conversationCall.data._id,
          ...conversationCall.data,
        });
        setConversations(
          conversations.map((conv) =>
            conv._id === conversationCall.data._id
              ? { _id: conversationCall.data._id, ...conversationCall.data }
              : conv
          )
        );

        const newConversations = conversations.map((conv) =>
          conv._id === conversationCall.data._id
            ? { _id: conversationCall.data._id, ...conversationCall.data }
            : conv
        );

        if (
          newConversations.some((conv) =>
            conv.messages?.some(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (msg: any) =>
                msg.read === false && msg.sender.user_id !== user?._id
            )
          )
        ) {
          setUnreadMessage(true);
        } else {
          setUnreadMessage(false);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (user?.username) {
      console.log("Selected student", student);
      getConversation();
    }
  }, [conversation?._id, student._id]);

  console.log("my conversation", conversation);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return conversation ? (
    conversation.messages?.map((message, index) => (
      <div
        key={index}
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
