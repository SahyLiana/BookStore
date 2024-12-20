import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Message from "./Message";
import userStore from "../store/UserStore";

type Student = {
  _id: string;
  name: string;
  email: string;
};

function OpenChat() {
  const {
    students,
    admin,
    // setMessageConversationStore,
    submitMessageStore,
    conversation,
    socket,
    // setUnreadMessage,
    // setConversations,
    conversations,
    // user,
  } = userStore();

  // const [conversations, setConversations] = useState<Conversation[] | []>();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>();

  console.log("All conversations", conversations);

  const openChatConversation = (studentConversation: Student) => {
    console.log("Selected student", studentConversation);
    setSelectedStudent(() => ({ ...studentConversation }));
  };

  const [myMessage, setMyMessage] = useState("");

  const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      "My message is",
      myMessage,
      // selectedStudent?.name,
      conversation,
      selectedStudent?._id,
      admin?._id,
      admin?.username,
      new Date()
    );
    try {
      if (conversation && admin) {
        await submitMessageStore(
          conversation,
          myMessage,
          admin._id,
          admin.username,
          new Date()
        );

        socket.emit("sentMessage", {
          ...conversation,
          receiverId: selectedStudent?._id,
          messages: [
            ...(conversation.messages ?? []),
            {
              sender: { senderId: admin._id, user: admin.username },
              message: myMessage,
              timestamp: new Date(),
              read: false,
            },
          ],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on("getMessage", (convMsg: any) => {
          console.log("Getmessage socket", convMsg);
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setMyMessage("");
    }
  };

  console.log("MyMessages", selectedStudent);

  const conversationState = (student: Student) => {
    const findConversation = conversations?.filter((conversation) =>
      conversation.messages?.some(
        (message) => message.sender.user_id !== admin?._id
      )
    );

    console.log(
      "Findconversation different userId",
      conversations,
      findConversation
    );

    if (findConversation) {
      const singleConversation = findConversation?.find(
        (conversation) =>
          student._id ===
          conversation.members.find((member) => member.userId === student._id)
            ?.userId
      );

      console.log("Included conversation", singleConversation);

      if (singleConversation && singleConversation.messages) {
        return singleConversation?.messages?.filter(
          (message) => !message.read && message.sender.user_id !== admin?._id
        ).length;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 1 },
      }}
      className={`text-white z-[2] w-[50%]  fixed top-[25%] overflow-y-hidden right-2 h-[75%]  bg-slate-950 flex flex-col border-[1px] border-blue-400 rounded-xl  `}
    >
      {/**CONTAINER */}
      <div className="flex w-full h-[100%]">
        {/**STUDENTS CONTAINER */}
        <div className="w-[30%] overflow-y-auto py-4 px-2 border-r-2 border-r-blue-600   bg-slate-900 ">
          <h2 className="text-xl mb-3">My Chats</h2>
          <hr />
          <div className="flex flex-col mt-4 gap-3">
            {" "}
            {students.map((student) => (
              <p
                onClick={() => openChatConversation(student)}
                key={student._id}
                style={{
                  backgroundColor:
                    student.name === selectedStudent?.name
                      ? "rgba(214, 214, 212,0.1)"
                      : "",
                  color:
                    student.name === selectedStudent?.name
                      ? "rgb(245, 219, 6)"
                      : "",
                  fontSize:
                    student.name === selectedStudent?.name ? "1.05rem" : "",
                }}
                className={`cursor-pointer transition-all duration-200 px-1 py-2 border-slate-700 border-b-[1px] hover:text-yellow-500 text-sm font-semibold text-slate-500`}
              >
                {student.name}{" "}
                {conversationState(student) > 0 && (
                  <span className="text-white bg-green-600 rounded-2xl font-thin text-[0.65rem] py-[1px] px-2">
                    {conversationState(student)} new messages
                  </span>
                )}
              </p>
            ))}
          </div>
        </div>
        {/**CHAT CONTAINER */}
        <div className="w-[80%] bg-red  bg-slate-900 flex flex-col">
          <div className="flex h-[70%] overflow-y-auto px-4 py-8 gap-8 flex-col">
            {selectedStudent ? (
              <Message student={selectedStudent} />
            ) : (
              <h1 className="text-slate-400 text-center text-3xl">
                Select a conversation...
              </h1>
            )}
          </div>
          {selectedStudent && (
            <form
              onSubmit={submitMessage}
              className="my-auto bg-slate-900 gap-2 justify-center  w-[100%] h-[40%] px-5 items-center flex py-2"
            >
              <textarea
                className="min-w-[400px] focus:outline-none text-black  h-[80%] bg-slate-200 px-3 rounded-xl  "
                placeholder="Enter message..."
                value={myMessage}
                required
                onChange={(e) => setMyMessage(e.target.value)}
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
