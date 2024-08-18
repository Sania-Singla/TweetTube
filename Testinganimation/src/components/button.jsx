import {motion} from "framer-motion";

export default function Button({show}) {

    const parentVariants = {
        beginning:{
            x:"-100vw",
        },
        end:{
            x:0,
            transition:{
                type:"spring",
                stiffness:50
            }
        },
        
    }

    const secondBtnVairants = {
        beginning:{
            x:"200vw"     //becuase 100vw will bounce at same spot because parent -100vw pe hai so to compensate that double krna pda 
        },
        end:{
            x:0,
            transition:{
                type:"spring",
                stiffness:70
            }
        }
    }

    return (
        <motion.div 
            className="w-full"
            // initial={{
            //     x: "-100vw"
            // }} 
            // animate={{
            //     x: 0
            // }}
            // transition={{
            //     type:"spring",    
            //     // duration: 2,   //  , when type is tween 
            //     stiffness:50      //  , when type is spring 
            //                       //we dont use these two at the same time 
            // }}

            variants={parentVariants}
            initial="beginning"
            animate="end"

            
        >
            <motion.button 
                whileHover={{
                    scale: 1.02
                }}

                onClick={show}
                className="bg-gray-300  font-semibold   text-xl p-1 border-[0.01rem] border-black"
            >Click me</motion.button>

            <motion.button
                className="bg-gray-300 font-semibold  ml-1 text-xl p-1 border-[0.01rem] border-black"
                variants={secondBtnVairants}   //so it will inherit the property names from the parent but look for their values in the child specific variants   
            >Click me too</motion.button>
        </motion.div>
    )
}