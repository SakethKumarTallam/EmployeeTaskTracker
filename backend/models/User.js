import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // link to Employee so we know which employee this user is
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
