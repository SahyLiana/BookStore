import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Message from "./Message";
import userStore from "../store/UserStore";

// type MessageType = {
//   // conversation_id: string;?
//   sender: { user_id: string; user: string };
//   message: string;
//   timestamp: string;
// };
// type StudentConversationType = {
//   _id: string;
//   members: { name: string; userId: string }[];
//   messages?: MessageType[];
//   //   name: string;
//   //   userId: string;
// };

type Student = {
  _id: string;
  name: string;
  email: string;
};

function OpenChatStd() {
  const { user, submitMessageStore } = userStore();

  //   const [selectedStudent, setSelectedStudent] = useState<Student | null>();

  //   const openChatConversation = (studentConversation: Student) => {
  //     console.log("Selected student", studentConversation);
  //     setSelectedStudent(() => ({ ...studentConversation }));
  //   };

  const [myMessage, setMyMessage] = useState("");

  //   const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     console.log(
  //       "My message is",
  //       myMessage,
  //       // selectedStudent?.name,
  //       selectedStudent?._id,
  //       admin._id,
  //       admin.username,
  //       new Date()
  //     );
  //     try {
  //       if (selectedStudent?._id) {
  //         await submitMessageStore(
  //           selectedStudent._id,
  //           myMessage,
  //           admin._id,
  //           admin.username,
  //           new Date()
  //         );
  //         setMyMessage("");
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   console.log("MyMessages", selectedStudent);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 1 },
      }}
      className={`text-black z-[10]   fixed top-[15%] overflow-y-hidden right-0 h-[75%] w-[50%] bg-slate-800  border-[1px] border-blue-400 rounded-xl py-10  `}
    >
      <div className="w-full pb-5 border-slate-600 border-b h-auto">
        <h1 className="text-center text-xl text-blue-800 font-semibold ">
          LIBRARIA CHATS
        </h1>
      </div>

      {/**CONTAINER */}
      <div className="flex w-full h-full">
        {/**STUDENTS CONTAINER */}
        {/* <div className="w-[30%] overflow-y-auto py-4 px-2 border-r-2 border-r-blue-600   bg-slate-900 ">
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
                {student.name}
              </p>
            ))}
          </div>
        </div> */}
        {/**CHAT CONTAINER */}
        <div className="w-[100%]  bg-slate-100 flex flex-col">
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
            // onSubmit={submitMessage}
            className="my-auto bg-slate-100 gap-2 justify-center  w-[100%] h-[40%] px-5 items-center flex py-2"
          >
            <textarea
              className="min-w-[400px] text-black h-[80%] bg-slate-200 px-3 rounded-xl  "
              placeholder="Enter message..."
              required
              onChange={(e) => setMyMessage(e.target.value)}
            />
            <button className="bg-green-600 pb-1 text-sm px-3  rounded-md ">
              <SendIcon style={{ fontSize: "1.1rem" }} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default OpenChatStd;
