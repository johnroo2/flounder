import { AuthService } from "./authserivce";
import { UserService } from "./userservice";
import { ProfileService } from "./profileservice";
import { PointUpdateService } from "./pointupdateservice";
import { ProblemService } from "./problemservice";

const url = "https://10.0.120.159:8000/"

export const userService = new UserService(url)
export const authService = new AuthService(url)
export const profileService = new ProfileService(url)
export const pointUpdateService = new PointUpdateService(url)
export const problemService = new ProblemService(url)