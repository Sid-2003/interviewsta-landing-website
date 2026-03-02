import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from "framer-motion";

const Awesome = () => {
    const [globalY,setGlobalY] = useState(0);
    const [height,setHeight] = useState(100);
    // Remove useState - use only motion values
    
    
    const [Y,SetY] = useState(0);

    useEffect(()=>{
        const handle = (e) => {
            setGlobalY(e.clientY);
            setHeight(Math.max(100,e.clientY-Y));
        }
        document.addEventListener("mousemove",handle);

        return () => {
            document.removeEventListener("mousemove",handle);
        }
    },[]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 100, damping: 5 });
    const springY = useSpring(y, { stiffness: 100, damping: 5 });
    const handleMouseDown = (e) => {

    }
    return (
        <motion.div 
            className="h-screen w-screen cursor-loading" // Give the container proper dimensions
            onMouseMove={(e) => {
                // Set motion values directly from mouse coordinates
                x.set(e.clientX - 50); // Offset to center the element
                y.set(e.clientY - 100);
            }}
        >
            <div className={`relative w-full bg-blue-100/50`}
            style={{
                height: `${height}px`
            }}
            onMouseMove={(e)=>{
                SetY(e.clientY);
            }}
            // style={{
            //     height: `${X}px`,
            //     width: `${Y}px`
            // }}
                >
                Mouse tracking area
                Y={Y}  GlobalY={globalY}
                {/* <div className="absolute top-full left-[calc(50%_-_120px)] bg-green-600 w-50 h-5 rounded-xl cursor-pointer"
                onMouseDown={handleMouseDown}> */}

                {/* </div> */}
                {/* <textarea className='block resize-y h-40 w-40 bg-green-100'></textarea> */}
            </div>
            {/* <motion.div
                style={{ 
                    x: springX, 
                    y: springY,
                    // height: y,
                    position: 'fixed', // Use fixed positioning
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'blue',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    pointerEvents: 'none' // Prevent interfering with mouse events
                }}
            >
                Follow your mouse!
            </motion.div> */}
        </motion.div>
    );
}

export default Awesome;
