import Card from './card'

import { useState } from 'react';

function App() {

  const [displayPopup,setDisplayPopup] = useState(false);


  return (
    <div className='flex flex-col items-center w-full'>
      <h3 className='text-3xl font-semibold mt-2'>POPUP MODEL</h3>
      <button 
        className='bg-gray-500 mt-2 text-xl px-2 py-1 hover:bg-gray-600'
        onClick={()=>setDisplayPopup(true)}
      >Click me !</button>
      {
        displayPopup && <Card method={()=>setDisplayPopup(false)}/>
      }
    </div>
  )
}

export default App
