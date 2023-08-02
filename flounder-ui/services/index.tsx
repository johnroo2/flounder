import { AuthService } from "./authserivce";
import { UserService } from "./userservice";
import { ProfileService } from "./profileservice";

const url = "http://127.0.0.1:8000/"

export const userService = new UserService(url)
export const authService = new AuthService(url)
export const profileService = new ProfileService(url)