import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: [
        3,
        "name field should a string with at least three characters",
      ],
    },
    email: {
      type: String,
      required: true,
      unique:true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    rootDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
    },
  },
  {
    strict: "throw",
  }
);

const User = model("User", userSchema);

export default User;