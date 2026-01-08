import { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
    },
    extension: {
      type: String,
      required: true,
    },
    isuploding: {
      type: Schema.Types.Boolean,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

const File = model("File", fileSchema);

export default File;
