import { useEffect,useState } from "react";
import { fetchData } from "./fetchData";
import Card from "./card";
import "./App.css"

export default function App() {

  const [data,setData] = useState([]);
  const [page,setPage] = useState(1);
  const [loading,setLoading] = useState(true);
  
  function handleScroll() {
    
    
      if(window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight )
        {
          console.log("event happened")
          setPage(prev=>prev+1);
        }
    
  }

  useEffect(()=>{
    console.log(data.length)
    if(data.length !== 100)
      {
    setLoading(true);
    fetchData(setData,setLoading,page);}
  },[page])

  useEffect(()=>{
    window.addEventListener("scroll",handleScroll);
    return ()=>window.removeEventListener("scroll",handleScroll);
  },[])

  const cards = data?.map(eachData => (
    <Card
        key={eachData.id}
        id={eachData.id}
        title={eachData.title}
        body={eachData.body}
    />
  ))


  return (
    <div className="overflow-hidden">
       <div className="w-full col-span-full  bg-black text-white text-center flex items-center justify-center h-[50px] fixed top-0 z-100">Header</div>
        <div className="flex flex-col p-2 row-start-2  col-span-full ">
          {cards} 
        </div>
      
      {loading && <div className="text-center w-full my-2 text-4xl text-red-500">Loading...</div>}
    </div>
  )
}