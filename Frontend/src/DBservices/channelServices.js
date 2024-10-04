export class ChannelServices {
    async getWatchHistory(setLoading, setHistoryInfo, setHistory, page = 1, search = "", limit = 5) {
        try {
            const res = await fetch(`/api/v1/users/watch-History/?page=${page}&limit=${limit}&term=${search}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                const { info, historyVideos } = data;
                setHistoryInfo(info);
                setHistory((prevHistory) => prevHistory?.concat(historyVideos));
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getWatchHistory service", err.message);
        } finally {
            setLoading(false);
        }
    }

    async clearWatchHistory(setHistoryInfo, setHistory) {
        try {
            const res = await fetch(`/api/v1/users/clear-History/`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                const { info, historyVideos } = data;
                setHistoryInfo(info);
                setHistory(historyVideos);
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in clearWatchHistory service", err.message);
        }
    }

    async getChannelProfile(setLoading, username) {
        //order matters    //⭐⭐⭐can add search filter
        try {
            setLoading(true);
            const res = await fetch(`/api/v1/users/channel/${username}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log("channeldata=", data);

            if (res.ok) {
                return data;
            } else if (res.status !== 500) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getChannelProfile service", err.message);
        } finally {
            setLoading(false);
        }
    }

    async getUserVideos(setVideoInfo, videos, setVideos, setLoading, id, page = 1, limit = 5) {
        try {
            const res = await fetch(`/api/v1/videos/?userId=${id}&page=${page}&limit=${limit}`, {
                method: "GET",
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setVideoInfo(data.info);
                setVideos((prev) => prev.concat(data.videos));
                return videos.concat(data.videos);
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getAllVideos service:", err.message);
        } finally {
            setLoading(false);
        }
    }

    async toggleSubscribe(channelId) {
        try {
            const res = await fetch(`/api/v1/subscriptions/toggle/${channelId}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getAllVideos service:", err.message);
        }
    }

    async getChannelAbout(setLoading, userId) {
        try {
            const res = await fetch(`/api/v1/about/${userId}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else if (res.status !== 400) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getChannelAbout service:", err.message);
        } finally {
            setLoading(false);
        }
    }

    async getLikedVideos(setLikedVideos, setLoading, setLikedInfo, likedVideos, page = 1, search = "", limit = 5) {
        try {
            const res = await fetch(`/api/v1/likes/likedvideos/?page=${page}&limit=${limit}&term=${search}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                //true
                setLikedInfo(data.info);
                setLikedVideos((prev) => prev.concat(data.likedVideos));
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getLikedVideos service:", err.message);
        } finally {
            setLoading(false);
        }
    }

    async getSubscribedChannels(setLoading, userId) {
        //can add pagination ⭐
        try {
            setLoading(true);
            const res = await fetch(`/api/v1/subscriptions/subscribedTo/${userId}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getSubscribedChannels service:", err.message);
        } finally {
            setLoading(false);
        }
    }
}

const channelServices = new ChannelServices();
export default channelServices;
