import jwt from "jsonwebtoken";
import { IUser } from "../models/UserModel";

export class AuthService {
  static generateToken(user: IUser): string {
    const payload = { userId: user._id, roles: user.roles };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  }
}
