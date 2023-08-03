import { PropsWithChildren, useEffect } from "react"
import Navbar from "./Navbar"
import { PolyWave } from "./wave/Waves"

export default function Layout(props:PropsWithChildren){

    return(
        <div>
            <Navbar/>
            <div className="bg-sky-50 max-h-[calc(100vh_-_64px)] h-[calc(100vh_-_64px)]">
                {props.children}
            </div>
            <PolyWave/>
        </div>
    )
}