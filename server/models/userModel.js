import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Name must be a string with at least 2 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "Email must be a valid email address",
      ],
    },
    password: {
      type: String,
      minLength: 4,
    },
    rootdirId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Directory",
    },
    picture: {
      type: String,
      default:
        "https://tse3.mm.bing.net/th/id/OIP.ojNpiWIABIevqSZ4Xz2YkAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "User", "Owner"],
      default: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local"
    },
  },
  {
    strict: "throw",
  }
);


// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = model("User", userSchema);

export default User;
