export class PlaylistServices {
    async createPlaylist(name, description = '') {
        try {
            const res = await fetch(`/api/v1/playlists/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    description,
                }),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in createPlaylist service:', err.message);
        }
    }

    async addVideoToPlaylist(videoId, playlistId) {
        try {
            const res = await fetch(
                `/api/v1/playlists/add/${playlistId}/${videoId}`,
                {
                    method: 'PATCH',
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
            return console.log(
                'error in addVideoToPlaylist service:',
                err.message
            );
        }
    }

    async getPlaylistById(playlistId) {
        try {
            const res = await fetch(`/api/v1/playlists/${playlistId}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else if (res.status === 400) {
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log(
                'error in getPlaylistById service:',
                err.message
            );
        }
    }

    async getUserPlaylistsTitles(id) {
        try {
            const res = await fetch(`/api/v1/playlists/titles/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log(
                'error in getUserPlaylistTitles service:',
                err.message
            );
        }
    }

    async getUserPlaylists(
        setPlaylists,
        setLoading,
        playlists,
        setPlaylistsInfo,
        id,
        page = 1,
        limit = 5
    ) {
        try {
            setLoading(true);
            const res = await fetch(
                `/api/v1/playlists/user/${id}/?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                //true
                setPlaylistsInfo(data.info);
                setPlaylists((prev) => prev.concat(data.playlists));
                return playlists.concat(data.playlists);
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log(
                'error in getUserPlaylists service:',
                err.message
            );
        } finally {
            setLoading(false);
        }
    }

    async removeVideoFromPlaylist(playlistId, videoId) {
        try {
            const res = await fetch(
                `/api/v1/playlists/remove/${playlistId}/${videoId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log(
                'error in removeVideoFromPlaylist service:',
                err.message
            );
        }
    }

    async deletePlaylist(playlistId) {
        try {
            const res = await fetch(`/api/v1/playlists/${playlistId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in deletePlaylist service:', err.message);
        }
    }

    async editPlaylist(playlistId, inputs) {
        try {
            const res = await fetch(`/api/v1/playlists/${playlistId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(inputs),
            });
            console.log(res);

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                return data;
            } else if (res.status === 500) {
                console.log('error');
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log('error in editPlaylist service:', err.message);
        }
    }
}

const playlistServices = new PlaylistServices();
export default playlistServices;
