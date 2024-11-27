import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Message from "./Message";
import userStore from "../store/UserStore";
// import axios from "axios";

// type Student = {
//   _id: string;
//   name: string;
//   email: string;
// };

function OpenChatStd() {
  const {
    user,
    submitMessageStore,
    // setConversationStore,
    conversation,
    socket,
  } = userStore();

  const [myMessage, setMyMessage] = useState("");

  const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      "My message is",
      myMessage,
      // selectedStudent?.name,
      user?._id,
      // admin._id,
      user?.name,
      new Date()
    );
    try {
      if (user?.name && conversation) {
        const messageResponse = await submitMessageStore(
          conversation,
          myMessage,
          user._id,
          user.name,
          new Date()
        );

        console.log("MessageResponse", messageResponse);

        socket.emit("sentMessage", {
          ...conversation,
          receiverId: messageResponse.members[0].userId,
          messages: [
            ...(conversation.messages ?? []),
            {
              sender: { senderId: user._id, user: user.email },
              message: myMessage,
              timestamp: new Date(),
            },
          ],
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setMyMessage("");
    }
  };

  // console.log("MyMessages", selectedStudent);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 1 },
      }}
      className={`text-black z-[10]    fixed top-[15%] overflow-y-hidden right-2 h-[75%] w-[50%] bg-slate-800  border-[1px] border-blue-400 rounded-xl   `}
    >
      {/* <div className="w-full py-5 border-slate-600 border-b ">
        <h1 className="text-center text-xl text-blue-800 font-semibold ">
          LIBRARIA CHATS
        </h1>
      </div> */}

      {/**CONTAINER */}
      <div className="flex h-[100%] w-full ">
        <div className="w-[100%]   bg-slate-100 flex flex-col">
          <div className="flex h-[70%] overflow-y-auto px-4 py-8 gap-8 flex-col">
            {/* {selectedStudent ? (
              <Message student={selectedStudent} />
            ) : (
              <h1 className="text-slate-400 text-center text-3xl">
                Select a conversation...
              </h1>
            )} */}
            {user && (
              <Message
                student={{ _id: user?._id, name: user.name, email: user.email }}
              />
            )}
          </div>
          <form
            onSubmit={submitMessage}
            className="my-auto bg-slate-100 border-t  gap-2 justify-center  w-[100%] h-[40%] px-5 items-center flex py-2"
          >
            <textarea
              className="min-w-[400px] text-black h-[80%] bg-slate-200 px-3 rounded-xl  "
              placeholder="Enter message..."
              value={myMessage}
              required
              onChange={(e) => setMyMessage(e.target.value)}
            />
            <button className="bg-green-600 text-white pb-1 text-sm px-3  rounded-md ">
              <SendIcon style={{ fontSize: "1.1rem" }} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default OpenChatStd;
