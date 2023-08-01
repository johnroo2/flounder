import { PropsWithChildren } from "react"
import Navbar from "./Navbar"
import Base from "./Base"

export default function Layout(props:PropsWithChildren){
    return(
        <div>
            <Navbar/>
            <Base>
                {props.children}
            </Base>
        </div>
    )
}