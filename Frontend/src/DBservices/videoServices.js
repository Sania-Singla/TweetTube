export class VideoServices {

    async getRandomVideos (setVideoInfo,videos,setVideos,page=1,limit=10) {
        try 
        {
            const res = await fetch(`/api/v1/videos/random-videos/?page=${page}&limit=${limit}`,{
                method:"GET",
                credentials:"include",
            })
            const data = await res.json();
            console.log(data);
            if(res.ok)
            {
                setVideoInfo(data.info);
                setVideos(prev=>prev.concat(data.videos));
                return videos.concat(data.videos);
            }
            else {
                throw new Error(data.message)
            }
        } catch (err) {
            console.log("something wrong with getRandomVideos service:",err.message)
        }
    }


    async getSearchData (search,page=1,limit=10) {
        try 
        {
            const res = await fetch(`/api/v1/videos/search-data/?page=${page}&limit=${limit}&query=${search}`,{
                method:"GET",
                credentials:"include",
            })
            const data = await res.json();
            console.log(data);

            if(res.ok)
            {
                return data;
            }
            else {
                throw new Error(data.message)
            }
        } catch (err) {
            console.log("something wrong with getSearchData service:",err.message)
        }
    }


    async getVideoById(videoId) {

        try {
            const res = await fetch( `/api/v1/videos/${videoId}`, {
                method: "GET",
                credentials: "include",
            })
            const data = await res.json();
            console.log(data);

            if(res.ok)
            {
                return data;
            }
            else if (res.status !==500)
            {
                return data
            }
            else {
                throw new Error(data.message);
            }
        } 
        catch (err) {
            return console.log("error in getVideoById service:",err.message)
        }
    }


    async removeVideoFromLiked(videoId) {
        try {
            const res = await fetch(`/api/v1/likes/removevideofromLiked/${videoId}`,{
                method:"DELETE",
                credentials:"include"
            });
            const data = await res.json();
            console.log(data);

            if(res.ok)
            {
                return data;
            }
            else{
                throw new Error(data.message)
            }
        } catch (err) {
            return console.log("something bad happened with the removeVideoFromLiked service",err.message)
        }
    }


    async toggelVideoLike(videoId,toggleStatus) {
        try {
            const res = await fetch(`/api/v1/likes/togglevideolike/${videoId}?toggleStatus=${toggleStatus}`,{
                method:"GET",
                credentials:"include"
            });
            const data = await res.json();
            console.log(data);

            if(res.ok)
            {
                return data;
            }
            else if (res.status !== 500)
            {
                return data;
            }
            else{
                throw new Error(data.message)
            }
        } catch (err) {
            return console.log("something bad happened with the toggleVideoLike service",err.message)
        }
    }

}

const videoServices = new VideoServices();
export default videoServices;