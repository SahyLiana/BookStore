import axios from "axios";
import { create } from "zustand";
import bookStore from "./BookStore";

type adminLoginType = {
  _id: string;
  username: string;
  password: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketType = any;

type Student = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

type User = {
  _id: string;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
};

type OnlineUsers = {
  socketId: string;
  userId: string;
};

type Conversation = {
  _id: string;
  members: { name: string; userId: string }[];
  messages?: {
    sender: {
      user_id: string;
      user: string;
    };
    message: string;
    timestamp: Date;
    read: boolean;
  }[];
  isOpen?: boolean;
};

type MessageType = {
  message: {
    sender: {
      senderId: string;
      user: string;
    };
    message: string;
    timestamp: Date;
    read: boolean;
  };
};

type State = {
  admin: Omit<adminLoginType, "password"> | null;
  students: Omit<Student, "password">[];
  onlineUsers: OnlineUsers[] | [];
  user: User | null;
  unreadStdMsg: number;
  loggedStudent: Omit<Student, "password"> | null;
  conversation: Conversation | null;
  conversations: Conversation[] | [];
  socket: SocketType | null;
  unreadMessage: boolean;
};

type Actions = {
  setAdmin: (admin: Omit<adminLoginType, "password"> | null) => void;
  addStudentStore: (
    studentData: Omit<Student, "_id" | "password"> | Omit<Student, "password">,
    token?: string | null
  ) => void;
  setUnreadMessage: (bool: boolean) => void;
  setConversations: (conversations: Conversation[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSocket: (socket: any) => void;
  setUnreadStdMsg: (unread: number) => void;
  setLoggedStudent: (student: Omit<Student, "password">) => void;
  getAllStudents: (token: string | null) => void;
  deleteStudentStore: (user: string, token: string | null) => void;
  // registerStudentStore: (studentData: Omit<Student, "_id">) => void;
  loginStudent: (
    student: Omit<Student, "_id" | "name">
  ) => Promise<{ tokenstd: string; _id: string; name: string }>;
  logoutStudent: () => void;

  setStudent: (student: Omit<Student, "password">) => void;
  getAdminDashboard: (token: string | null) => void;
  setMessageConversationStore: (msg: MessageType) => void;

  setConversationStore: (conversation: Conversation | null) => void;
  submitMessageStore: (
    // stdId: string,
    conversation: Conversation,
    message: string,
    senderId: string,
    senderName: string,
    timestamp: Date
  ) => Promise<Conversation>;
  setOnlineUsers: (online: OnlineUsers[]) => void;
};

const userStore = create<Actions & State>((set) => ({
  admin: null,
  onlineUsers: [],
  socket: null,
  user: null,
  conversation: null,
  conversations: [],
  students: [],
  loggedStudent: null,
  unreadStdMsg: 0,
  unreadMessage: false,
  setUnreadMessage: (bool) => {
    set((state) => ({
      ...state,
      unreadMessage: bool,
    }));
  },
  setUnreadStdMsg: (unread: number) => {
    set((state) => ({
      ...state,
      unreadStdMsg: unread,
    }));
  },
  setConversations: (conversations: Conversation[]) => {
    set((state) => ({
      ...state,
      conversations: [...conversations],
    }));
  },
  setOnlineUsers(onlines) {
    set((state) => ({
      ...state,
      onlineUsers: [...onlines],
    }));
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSocket(socket: any) {
    set((state) => ({
      ...state,
      socket,
    }));
  },

  setLoggedStudent(student: Omit<Student, "password">) {
    set((state) => ({
      ...state,
      loggedStudent: { ...student },
    }));
  },

  setConversationStore(conversation: Conversation | null) {
    console.log("setConversationStore", conversation);
    if (conversation) {
      set((state) => ({
        ...state,
        conversation: { ...state.conversation, ...conversation },
      }));
    } else {
      set((state) => ({
        ...state,
        conversation: null,
      }));
    }
  },

  setMessageConversationStore(msg: MessageType) {
    console.log("SetMessageConversationStore", msg);
    if (msg) {
      set((state) => {
        if (state.conversation) {
          return {
            ...state,
            conversation: {
              ...state.conversation,
              messages: [
                ...(state.conversation.messages ?? []),
                {
                  ...msg.message,
                  sender: {
                    ...msg.message.sender,
                    user_id: msg.message.sender.senderId,
                  },
                },
              ],
            },
          };
        } else {
          return { ...state };
        }
      });
    }
  },

  async submitMessageStore(
    // stdId: string,
    conversation: Conversation,
    message: string,
    senderId: string,
    senderName: string,
    timestamp: Date
  ) {
    console.log("submitMessageStore", message, timestamp);
    const submitMsgCall = await axios.patch(
      `http://localhost:3000/api/conversation/${conversation._id}`,
      { senderId, senderName, message, timestamp }
    );
    console.log("submitMessageData", submitMsgCall.data);
    set((state) => ({
      ...state,
      conversation: { ...submitMsgCall.data },
    }));

    return submitMsgCall.data;
  },

  setStudent(student: Omit<Student, "password">) {
    set((state) => ({
      ...state,
      loggedStudent: { ...student },
      user: { ...student },
    }));
  },

  setAdmin(admin) {
    console.log("Inside setAdmin store", admin);

    if (admin) {
      set((state) => ({
        ...state,
        admin: { ...admin },
        user: { ...admin },
      }));
    } else {
      set((state) => ({
        ...state,
        admin: null,
        user: null,
      }));
    }
  },

  async addStudentStore(
    studentData: Omit<Student, "_id" | "password"> | Omit<Student, "password">,
    token?: string | null
  ) {
    console.log("Inside addStudentStore", studentData);

    const registerStudentCall = await axios.post(
      "http://localhost:3000/api/student/",
      studentData,
      { headers: { Authorization: token } }
    );

    console.log("RegisterCall", registerStudentCall.data);

    set((state) => ({
      ...state,
      students: [...state.students, registerStudentCall.data],
    }));
  },

  async getAllStudents(token: string | null) {
    const getAllStudentCall = await axios.get(
      "http://localhost:3000/api/student/",
      { headers: { Authorization: token } }
    );

    console.log("All Students", getAllStudentCall.data);

    set((state) => ({
      ...state,
      students: [...getAllStudentCall.data],
    }));
  },

  async getAdminDashboard(token: string | null) {
    const getAllStudentCall = await axios.get(
      "http://localhost:3000/api/student/",
      { headers: { Authorization: token } }
    );

    console.log("All Students", getAllStudentCall.data);
    const getBookCall = await axios.get("http://localhost:3000/api/book");

    console.log("GetBookCall", getBookCall.data);
    // const { getAllBookStore } = bookStore.getState();
    const { setBooks } = bookStore.getState();

    setBooks(getBookCall.data);

    // const getAllConversationCall = await axios.get(
    //   "http://localhost:3000/api/conversation/"
    // );

    // console.log("getAllConversationCall", getAllConversationCall.data);

    set((state) => ({
      ...state,
      students: [...getAllStudentCall.data],
      // conversations: [...getAllConversationCall.data],
    }));
  },

  async deleteStudentStore(user: string, token: string | null) {
    console.log("Inside deleteStudentStore", user);

    const deletedStudentCall = await axios.delete(
      `http://localhost:3000/api/student/${user}`,
      {
        headers: { Authorization: token },
      }
    );

    const { getAllBookStore } = bookStore.getState();
    getAllBookStore();

    set((state) => ({
      ...state,
      students: state.students.filter(
        (student) => student._id !== deletedStudentCall.data._id
      ),
    }));
  },

  async loginStudent(student: Omit<Student, "_id" | "name">) {
    console.log("Inside loginStudent", student);

    const loginCall = await axios.post(
      "http://localhost:3000/api/student/login",
      student
    );

    console.log("Response api", loginCall.data.token, loginCall.data._doc);

    set((state) => ({
      ...state,
      loggedStudent: { ...loginCall.data._doc },
      user: { ...loginCall.data._doc },
    }));

    return {
      tokenstd: loginCall.data.token,
      _id: loginCall.data._doc._id,
      name: loginCall.data._doc.name,
    };
  },

  logoutStudent() {
    set((state) => ({
      ...state,
      loggedStudent: null,
      user: null,
    }));
  },
}));

export default userStore;
