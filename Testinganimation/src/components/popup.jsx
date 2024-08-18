import { X } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function Popup({close}) {

    const ref = useRef();

    function closePopup(e) {
        if(ref.current===e.target) close();
    }

    const parentVairants = {
        start:{
           x: "100vw"
        },
        end:{
            x:0,
            transition:{
                type:"tween",
                // damping:20,
                duration:2,
                when:"beforeChildren",
                staggerChildren: 0.5, //delay the child animations by 1sec
                delayChildren:0.5   //By default, the staggerChildren setting delays subsequent children animations after the first child animation starts. However, to delay the start of the first child's animation itself, you need to use the delayChildren property within the parent's transition.
            }
        },
        exit: {
            x: "100vw",
            transition: {
                type:"tween",
                // damping:20,
                duration:5,
                when:"afterChildren",
                staggerChildren: 0.5, //delay the child animations by 1sec
                delayChildren:0.5   //By default, the staggerChildren setting delays subsequent children animations after the first child animation starts. However, to delay the start of the first child's animation itself, you need to use the delayChildren property within the parent's transition.
            }
        }
    }

    const childVariants = {
        start:{
            opacity:0
        },
        end:{
            opacity:1,
            transition:{
                // duration:1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                // duration: 1
            }
        }
    }

    return (
        //for inset to work the element should be out of the flow so either absolte or fixed...
        <motion.div ref={ref} onClick={closePopup} className="inset-0 fixed flex justify-end items-center"

        >   
            <motion.div 
                variants={parentVairants}
                initial="start"
                animate="end"
                exit="exit"
                className="bg-red-300 relative border-[0.01rem] border-black w-[250px] h-full flex flex-col items-center p-2 justify-start">
                <motion.button variants={childVariants} className="place-self-end" onClick={close}><X/></motion.button>

                <div className='w-full'>
                    <motion.div 
                        variants={childVariants} 
                        className='bg-red-600 border-[0.01rem] border-black p-1 text-xl mb-1 w-full'
                    >&bull; first</motion.div>
                    <motion.div 
                        variants={childVariants} 
                        className='bg-red-600 border-[0.01rem] border-black p-1 text-xl mb-1 w-full'
                    >&bull; first</motion.div>
                </div>

                <motion.div
                    variants={childVariants} 
                    className='absolute bottom-2 flex items-center justify-start w-full p-2'
                >
                    <div className="bg-sky-400  text-white border-[0.01rem] ml-2 border-black rounded-full h-[50px] w-[50px]"></div>
                    <button className='bg-indigo-500 border-[0.01rem] ml-4 border-black p-1 text-white'>Logout</button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}