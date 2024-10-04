export class CommentServices {
    async toggelCommentLike(commentId, toggleStatus) {
        try {
            const res = await fetch(`/api/v1/likes/togglecommentlike/${commentId}/?toggleStatus=${toggleStatus}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                return data;
            } else if (res.status !== 500) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("something bad happened with the toggleCommentLike service", err.message);
        }
    }

    async getVideoComments(setCommentsInfo, comments, setComments, page = 1, limit = 10, videoId) {
        try {
            const res = await fetch(`/api/v1/comments/${videoId}?page=${page}&limit=${limit}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setCommentsInfo(data.info);
                setComments((prev) => prev.concat(data.comments));
                return comments.concat(data.comments);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("something went wrong with the getVideoComments service", err.message);
        }
    }

    async addComment(videoId, content, setComments) {
        try {
            const res = await fetch(`/api/v1/comments/${videoId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content }),
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setComments((prev) => [data, ...prev]);
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("something went wrong with the addComment service", err.message);
        }
    }

    async updateComment(commentId, content) {
        try {
            const res = await fetch(`/api/v1/comments/${commentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content }),
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("something went wrong with the updateComment service", err.message);
        }
    }

    async deleteComment(commentId, setComments) {
        try {
            const res = await fetch(`/api/v1/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentId));
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("something went wrong with the deleteComment service", err.message);
        }
    }
}

const commentServices = new CommentServices();
export default commentServices;
