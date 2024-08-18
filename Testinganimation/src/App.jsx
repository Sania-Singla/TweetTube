import Button from './components/button'
import Popup from './components/popup'
import SVG from "./components/svg"
import './App.css'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

function App() {

  const [displayPopup,setDisplayPopup] = useState(false);

  return (
    <div className='p-5'>
      <Button show={()=>setDisplayPopup(true)}/>
      <AnimatePresence /*allows to apply animation even on conditional rendering*/>  
        {displayPopup && <Popup close={()=>setDisplayPopup(false)} />}
      </AnimatePresence>
      <SVG />
      {/* for using name of the icon need to have that html line in the head taG */}
<span class="material-icons md-18">face</span>  
<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M120-240v-66.67h720V-240H120Zm0-206.67v-66.66h720v66.66H120Zm0-206.66V-720h720v66.67H120Z"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M226.67-186.67h140v-246.66h226.66v246.66h140v-380L480-756.67l-253.33 190v380ZM160-120v-480l320-240 320 240v480H526.67v-246.67h-93.34V-120H160Zm320-352Z"/></svg>
    
    </div>
  )
}

export default App
