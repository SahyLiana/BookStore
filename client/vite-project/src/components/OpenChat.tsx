import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import { useState } from "react";
import Message from "./Message";

type MessageType = {
  // conversation_id: string;?
  sender: { user_id: string; user: string };
  message: string;
  timestamp: string;
};
type StudentConversationType = {
  _id: string;
  members: { name: string; userId: string }[];
  messages?: MessageType[];
  //   name: string;
  //   userId: string;
};

function OpenChat() {
  // const messages: MessageType[] = [
  //   {
  //     // conversation_id: "2",
  //     sender: {
  //       user_id: "13",
  //       user: "Tojo",
  //     },
  //     message: "Test",
  //     timestamp: "just now",
  //   },

  //   {
  //     // conversation_id: "1",
  //     sender: {
  //       user_id: "1a",
  //       user: "admin",
  //     },
  //     message: "Hello,How are you?",
  //     timestamp: "5mn ago",
  //   },
  //   {
  //     // conversation_id: "1",
  //     sender: {
  //       user_id: "12",
  //       user: "Sahy",
  //     },
  //     message: "I am fine sir, and you?",
  //     timestamp: "3mn ago",
  //   },
  //   {
  //     // conversation_id: "1",
  //     sender: {
  //       user_id: "1a",
  //       user: "admin",
  //     },
  //     message: "I am fine bro.",
  //     timestamp: "just now",
  //   },
  // ];

  const studentsChats: StudentConversationType[] = [
    {
      _id: "1",
      members: [
        { name: "admin", userId: "1a" },
        { name: "Sahy", userId: "12" },
      ],
      messages: [
        {
          sender: {
            user_id: "1a",
            user: "admin",
          },
          message: "Hello,How are you?",
          timestamp: "5mn ago",
        },
        {
          sender: {
            user_id: "12",
            user: "Sahy",
          },
          message: "I am fine sir, and you?",
          timestamp: "3mn ago",
        },
        {
          sender: {
            user_id: "1a",
            user: "admin",
          },
          message: "I am fine bro.",
          timestamp: "just now",
        },
      ],
    },
    {
      _id: "2",
      members: [
        { name: "admin", userId: "1a" },
        { name: "Tojo", userId: "13" },
      ],
      messages: [
        {
          sender: {
            user_id: "13",
            user: "Tojo",
          },
          message: "Test",
          timestamp: "just now",
        },
      ],
    },
    {
      _id: "3",
      members: [
        { name: "admin", userId: "1a" },
        { name: "Hira", userId: "14" },
      ],
    },
    {
      _id: "4",
      members: [
        { name: "admin", userId: "1a" },
        { name: "Bam", userId: "15" },
      ],
    },
    {
      _id: "5",
      members: [
        { name: "admin", userId: "1a" },
        { name: "Neny", userId: "16" },
      ],
    },
    {
      _id: "6",
      members: [
        { name: "admin", userId: "1a" },
        { name: "Dada", userId: "17" },
      ],
    },
  ];

  const [selectedStudent, setSelectedStudent] =
    useState<StudentConversationType | null>();

  // const [conversationMessages, setConversationMessages] = useState<
  //   MessageType[]
  // >([]);

  const openChatConversation = (
    studentConversation: StudentConversationType
  ) => {
    setSelectedStudent(() => ({ ...studentConversation }));
    // const myMessages = messages.filter(
    //   (message) => message.conversation_id === studentConversation._id
    // );

    // setConversationMessages(myMessages);
  };

  console.log("MyMessages", selectedStudent);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 1 },
      }}
      className={`text-white z-[2]  fixed top-[25%] overflow-y-hidden right-0 h-[75%] w-[50%] bg-slate-950 border-[1px] border-blue-400 rounded-xl py-5 `}
    >
      <div className="w-full pb-5 border-slate-600 border-b h-auto">
        <h1 className="text-center text-xl text-blue-800 font-semibold ">
          LIBRARIA CHATS
        </h1>
      </div>

      {/**CONTAINER */}
      <div className="flex w-full h-full">
        {/**STUDENTS CONTAINER */}
        <div className="w-[30%] overflow-y-auto py-4 px-2 border-r-2 border-r-blue-600   bg-slate-900 ">
          <h2 className="text-xl mb-3">My Chats</h2>
          <hr />
          <div className="flex flex-col mt-4 gap-3">
            {" "}
            {studentsChats.map((student) => (
              <p
                onClick={() => openChatConversation(student)}
                key={student._id}
                style={{
                  backgroundColor:
                    student.members[1]?.name ===
                    selectedStudent?.members[1]?.name
                      ? "rgba(214, 214, 212,0.1)"
                      : "",
                  color:
                    student.members[1]?.name ===
                    selectedStudent?.members[1]?.name
                      ? "rgb(245, 219, 6)"
                      : "",
                  fontSize:
                    student.members[1]?.name ===
                    selectedStudent?.members[1]?.name
                      ? "1.05rem"
                      : "",
                }}
                className={`cursor-pointer transition-all duration-200 px-1 py-2 border-slate-700 border-b-[1px] hover:text-yellow-500 text-sm font-semibold text-slate-500`}
              >
                {student.members[1].name}
              </p>
            ))}
          </div>
        </div>
        {/**CHAT CONTAINER */}
        <div className="w-[80%] bg-red  bg-slate-900 flex flex-col">
          <div className="flex h-[70%] overflow-y-auto px-4 py-8 gap-8 flex-col">
            {selectedStudent ? (
              <Message chats={selectedStudent} />
            ) : (
              <h1 className="text-slate-400 text-center text-3xl">
                Select a conversation...
              </h1>
            )}
          </div>
          {selectedStudent && (
            <form className="my-auto bg-slate-900 gap-2 justify-center  w-[100%] h-[40%] px-5 items-center flex py-2">
              <textarea
                className="min-w-[400px] text-black h-[80%] bg-slate-200 px-3 rounded-xl  "
                placeholder="Enter message..."
              />
              <button className="bg-green-600 pb-1 text-sm px-3  rounded-md ">
                <SendIcon style={{ fontSize: "1.1rem" }} />
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default OpenChat;
