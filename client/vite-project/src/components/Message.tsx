type Props = {
  conversation: {
    conversation_id: string;
    sender: { user_id: string; user: string };
    message: string;
    timestamp: string;
  };
  selectedStudentChat: {
    _id: string;
    members: { name: string; userId: string }[];
  };
};

function Message({ conversation, selectedStudentChat }: Props) {
  return (
    <div
      className={`${conversation.sender.user_id === "1a" ? "self-start" : " text-black self-end"} w-[50%]`}
    >
      <p className="text-white">
        {conversation.sender.user_id === "1a"
          ? "You"
          : selectedStudentChat.members.find(
              (member) => member.userId === conversation.sender.user_id
            )?.name}
      </p>
      <div
        className={`${conversation.sender.user_id === "1a" ? "bg-blue-700" : "bg-slate-100 "} px-4 py-1 rounded-xl`}
      >
        <p>{conversation.message}</p>
      </div>
      <p className="text-xs text-slate-500 mt-1">{conversation.timestamp}</p>
    </div>
  );
}

export default Message;
