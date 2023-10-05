import { InferSchemaType, Schema, model } from "mongoose";

const PasswordSchema = new Schema({
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: PasswordSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type UserType = InferSchemaType<typeof UserSchema>;

export const UserModel = model<UserType>("User", UserSchema);
