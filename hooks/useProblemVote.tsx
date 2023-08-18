import { problemVoteService } from "@/services"

export const useProblemVote = () => {
    const like = async(user_id:number, problem_id:number) => {
        try{
            const response = await problemVoteService.post({'user':user_id, 'problem':problem_id, 'status':1})
        }
        catch(err){
            console.log(err)
        }
    }
    const dislike = async(user_id:number, problem_id:number) => {
        try{
            const response = await problemVoteService.post({'user':user_id, 'problem':problem_id, 'status':-1})
        }
        catch(err){
            console.log(err)
        }
    }
    const neutral = async(user_id:number, problem_id:number) => {
        try{
            const response = await problemVoteService.post({'user':user_id, 'problem':problem_id, 'status':0})
        }
        catch(err){
            console.log(err)
        }
    }
    
    return {like, dislike, neutral}
}