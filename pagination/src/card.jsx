export default function Card({id,title,body}) {
    return (
        <div className="text-white bg-red-500 rounded-md p-2 text-center flex flex-col mb-2 mr-2 w-[300px]">
            <div >{id}</div>
            <div>{title}</div>
            <div>{body}</div>
        </div>
    )
}