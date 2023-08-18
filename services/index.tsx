import { AuthService } from "./authserivce";
import { UserService } from "./userservice";
import { ProfileService } from "./profileservice";
import { PointUpdateService } from "./pointupdateservice";
import { ProblemService } from "./problemservice";
import { ProblemVoteService } from "./problemvoteservice";

const url = "http://127.0.0.1:8000/"

export const userService = new UserService(url)
export const authService = new AuthService(url)
export const profileService = new ProfileService(url)
export const pointUpdateService = new PointUpdateService(url)
export const problemService = new ProblemService(url)
export const problemVoteService = new ProblemVoteService(url)