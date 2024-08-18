import { X } from 'lucide-react'; 
import { useRef } from 'react';

function Card({method}) {  
    
  const ref = useRef();

  function close(e) {
    console.log("ref",ref.current)   //always have outer div (as in our ex.) not even for inner childs ,which is what we want that andr click krne pe close na ho only bahr click krne pe close ho  
    console.log("event",e.target)   //will have the node where that event happened
    if(ref.current===e.target) 
        method();
  }

  return (
        <div  ref={ref}  onClick={close}  className='text-white backdrop-blur-sm  fixed inset-0 flex items-center justify-center'>
            <div  className='w-[300px] h-[200px] rounded-xl bg-red-300 p-2 flex flex-col items-center relative'>
                <button className='place-self-end' onClick={method}><X size={30}/></button>
                <p className='text-2xl font-semibold'>THE POPUP</p>
                <p className='text-xl'>this is the popup right here.</p>
                <button className='bg-blue-300 text-black px-1 py-1 rounded-md hover:bg-blue-400 absolute bottom-10'>Subscribe</button>
            </div>
        </div>
  )
}

export default Card