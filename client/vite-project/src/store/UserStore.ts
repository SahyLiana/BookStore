import { create } from "zustand";

type adminLoginType = {
  username: string;
  password: string;
};

type State = {
  admin: Omit<adminLoginType, "password">;
};

type Actions = {
  setAdmin: (admin: Omit<adminLoginType, "password">) => void;
};

const userStore = create<Actions & State>((set) => ({
  admin: { username: "" },

  setAdmin(admin) {
    console.log("Inside setAdmin store", admin);

    set((state) => ({
      ...state,
      admin: admin,
    }));
  },
}));

export default userStore;
