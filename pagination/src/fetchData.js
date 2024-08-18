export async function fetchData(setData,setLoading, page) {
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`)
        const data = await res.json();
        setData(prev=>[...prev,...data]);
        console.log(data);
        setLoading(false)
        
    } catch (error) {
        console.log(error)
    }
}