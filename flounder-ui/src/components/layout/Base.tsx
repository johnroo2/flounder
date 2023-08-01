import { PropsWithChildren } from "react"

export default function Base(props:PropsWithChildren){
    return(
        <div className="bg-sky-50 max-h-[calc(100vh_-_64px)] h-[calc(100vh_-_64px)]">
            {props.children}
        </div>
    )
}