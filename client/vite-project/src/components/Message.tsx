import axios from "axios";
import { useEffect } from "react";
import userStore from "../store/UserStore";
import { format } from "timeago.js";

type Props = {
  student: {
    _id: string;
    name?: string;
    email?: string;
  };
};

// type Conversation = {
//   members: { name: string; userId: string }[];
//   messages?: {
//     sender: {
//       user_id: string;
//       user: string;
//     };
//     message: string;
//     timestamp: string;
//   }[];
// };

function Message({ student }: Props) {
  // const [conversation, setConversation] = useState<Conversation | null>();
  const { user, setConversationStore, conversation } = userStore();

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
      } catch (e) {
        console.log(e);
      }
    };
    getConversation();
  }, [student._id]);

  return conversation ? (
    conversation.messages?.map((message) => (
      <div
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
