import { PropsWithChildren } from "react"
import Navbar from "./Navbar"

export default function Layout(props:PropsWithChildren){
    return(
        <div>
            <Navbar/>
            <div className="max-h-[calc(100vh_-_64px)] h-[calc(100vh_-_64px)] z-[100] relative overflow-x-hidden">
                {props.children}
            </div>
        </div>
    )
}