type Props = {
  chats: {
    _id: string;
    members: { name: string; userId: string }[];
    messages?: {
      sender: { user_id: string; user: string };
      message: string;
      timestamp: string;
    }[];
  };
};

function Message({ chats }: Props) {
  return chats.messages ? (
    chats.messages.map((message) => (
      <div
        className={`${message.sender.user_id === "1a" ? "self-start" : " text-black self-end"} w-[50%]`}
      >
        <p className="text-white">
          {message.sender.user_id === "1a"
            ? "You"
            : chats.members.find(
                (member) => member.userId === message.sender.user_id
              )?.name}
        </p>
        <div
          className={`${message.sender.user_id === "1a" ? "bg-blue-700" : "bg-slate-100 "} px-4 py-1 rounded-xl`}
        >
          <p>{message.message}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1">{message.timestamp}</p>
      </div>
    ))
  ) : (
    <h1 className="text-slate-400 text-center text-3xl">Lets chat...</h1>
  );
}

export default Message;
