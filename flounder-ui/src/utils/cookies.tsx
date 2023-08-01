import Cookies from "js-cookie";

class CookieTracker {
    public cookies : {[key:string]: string} = {};

    constructor(){
        Object.assign(this.cookies, Cookies.get());
    }

    public get = (key:string) => {
        return this.cookies[key];
    }

    public set = async(key:string, value:string) => {
        await Cookies.set(key, value);
        this.cookies[key] = value;
        this.cookies={...this.cookies}
        this.logChange();
    }
 
    public remove = async(key:string) => {
        await Cookies.remove(key);
        delete this.cookies[key];
        this.cookies={...this.cookies}
        this.logChange();
    }

    public logChange():void{
        try{
            console.log(this.cookies)
        }
        catch(err){
            console.log(err);
        }
    }
}

const cookies = new CookieTracker();
export default cookies;