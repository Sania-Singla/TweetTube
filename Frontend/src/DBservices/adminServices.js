export class AdminServices {
    async getChannelStats(setStats) {
        try {
            const res = await fetch('/api/v1/dashboard/stats', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setStats(data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in getChannelStats service', err.message);
        }
    }

    async getAdminVideos(setVideos, setVideosInfo, page, limit) {
        try {
            const res = await fetch(
                `/api/v1/dashboard/videos/?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setVideos((prev) => prev.concat(data.videos));
                setVideosInfo(data.info);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in getAdminVideos service', err.message);
        }
    }

    async togglePublish(videoId, status) {
        try {
            const res = await fetch(
                `/api/v1/videos/toggle-publish/${videoId}/${status}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in togglePublish service', err.message);
        }
    }

    async uploadVideo(inputs, controller) {
        try {
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const res = await fetch(`/api/v1/videos/`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                signal: controller?.signal,
            });
            const data = await res.json();
            console.log('uploaded=', data);

            if (res.ok) {
                return data;
            } else if (
                res.status === 500 &&
                (data.message === 'VIDEO_UPLOAD_ISSUE' ||
                    data.message === 'VIDEODOC_CREATION_DB_ISSUE')
            )
                return data;
            else {
                throw new Error(data.message);
            }
        } catch (err) {
            if (err.name === 'AbortError') console.log('upload aborted');
            else console.log('Error in uploadVideo service:', err.message);
        }
    }

    async editVideo(inputs, videoId) {
        try {
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const res = await fetch(`/api/v1/videos/${videoId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in editVideo service', err.message);
        }
    }

    async deleteVideo(videoId) {
        try {
            const res = await fetch(`/api/v1/videos/${videoId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in deleteVideo service', err.message);
        }
    }
}

const adminServices = new AdminServices();
export default adminServices;
