import { AuthService } from "./authserivce";
import { UserService } from "./userservice";

const url = "http://127.0.0.1:8000/"

export const userService = new UserService(url)
export const authService = new AuthService(url)