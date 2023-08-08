export const PolyWave = () => {
    return(
        <div className="polywave-wrapper polywave-animation pointer-events-none">
            <div className="absolute z-0 mt-[64px] w-full h-full bg-sky-50"/>
            <div className="polywave-inner">
                <div className="bg-poly1 polywave polywave1"/>
            </div>
            <div className="polywave-inner">
                <div className="bg-poly2 polywave polywave2"/>
            </div>
            <div className="polywave-inner">
                <div className="bg-poly3 polywave polywave3"/>
            </div>
        </div>
    )
}
