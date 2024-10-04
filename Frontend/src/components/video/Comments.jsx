import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAuthHook } from "../../hooks";
import { LoginPopup } from "..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faSolidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as faRegularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown as faSolidThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown as faRegularThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { icons } from "../../assets/icons";
import commentServices from "../../DBservices/commentServices";

export default function Comments({ expandComments }) {
    const [comments, setComments] = useState([]);
    const [commentsInfo, setCommentsInfo] = useState({});
    const [commentsFound, setCommentsFound] = useState(true);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { userData } = useAuthHook();
    const [loginPopup, setLoginPopup] = useState(false);
    const [loginPopupText, setLoginPopupText] = useState("");
    const loginRef = useRef();
    const [newComment, setNewComment] = useState("");
    const [editComment, setEditComment] = useState("");
    const [currentEditId, setCurrentEditId] = useState(false);
    const [expandCommentId, setExpandCommentId] = useState("");

    useEffect(() => {
        if (page == 1 || comments.length !== commentsInfo.totalComments) {
            setLoading(true);
            commentServices.getVideoComments(setCommentsInfo, comments, setComments, page, 10, videoId).then((res) => {
                if (res && res.length > 0) {
                    setCommentsFound(true);
                } else setCommentsFound(false);
            });
            setLoading(false);
        }
    }, [page, userData, videoId]);

    const observer = useRef();
    const callbackRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                const lastComment = entries[0];
                if (lastComment.isIntersecting && commentsInfo?.hasNextPage) setPage((prev) => prev + 1);
            });
            if (node) observer.current.observe(node);
        },
        [commentsInfo?.hasNextPage]
    );

    async function updateComment(commentId) {
        const res = await commentServices.updateComment(commentId, editComment);
        if (res) {
            setComments((prev) =>
                prev.map((comment) => {
                    if (comment._id === commentId)
                        return {
                            ...comment,
                            content: editComment,
                        };
                    else return comment;
                })
            );
            setCurrentEditId(null);
        }
    }

    async function deleteComment(commentId) {
        const res = await commentServices.deleteComment(commentId, setComments);
    }

    async function handleEditReset() {
        setEditComment("");
        setCurrentEditId(null);
    }

    const commentElements = comments?.map((comment, index) => {
        const { _id, content, commentBy, createdAt, likes, dislikes, hasLiked, hasDisliked } = comment;
        const { avatar, username, fullname } = commentBy;
        const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

        if (comments.length === index + 1)
            return (
                <div key={_id} ref={callbackRef} className="">
                    <hr className="mt-4 mb-3" />

                    <div className="flex items-start justify-start">
                        <div className="pt-[10px] cursor-pointer" onClick={() => navigate(`/channel/${username}`)}>
                            <div className="size-10 rounded-full overflow-hidden">
                                <img src={avatar} alt={fullname} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="ml-3 w-full relative" onClick={() => setExpandCommentId((prev) => (prev ? "" : _id))}>
                            <div className="text-md text-[#e9e9e9] text-[1.1rem]">
                                {fullname} <span className="text-[0.5rem] h-full align-middle">&bull;</span>{" "}
                                <span className="text-[0.8rem] text-[#c6c6c6]">{formattedCreatedAt}</span>
                            </div>
                            <div className="text-[#dedede] text-[0.8rem]">{"@" + username}</div>
                            <div className="w-full">
                                {currentEditId === _id ? (
                                    <form
                                        className="w-full"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            updateComment(_id);
                                        }}
                                    >
                                        <input
                                            type="text"
                                            name="editComment"
                                            id="editComment"
                                            required
                                            value={editComment}
                                            autoFocus
                                            onChange={(e) => setEditComment(e.target.value)}
                                            className="caret-[#8871ee] w-full mt-2 text-[0.9rem] bg-transparent text-white border-b-[0.01rem] border-b-[#8871ee] outline-none"
                                        />
                                        <div className="flex items-center justify-center gap-2 absolute bottom-0 right-0">
                                            <button
                                                type="reset"
                                                onClick={handleEditReset}
                                                className="rounded-full hover:bg-[#282828] pb-[2px] px-[10px] hover:bg-"
                                            >
                                                cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="border-[0.01rem] border-[#b5b4b4] hover:bg-[#8871ee] pb-[2px] rounded-full px-[10px] "
                                            >
                                                update
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={`text-[0.9rem] text-white mt-2 ${expandCommentId === _id ? "" : "line-clamp-3"}`}>{content}</div>
                                )}
                            </div>
                            <div className="mt-3">
                                {userData ? (
                                    <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit h-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                        <div
                                            onClick={() => handleLikeClick(_id)}
                                            className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] py-[3px]"
                                        >
                                            <button className="ml-2">
                                                <FontAwesomeIcon size="lg" icon={hasLiked ? faSolidThumbsUp : faRegularThumbsUp} color={"white"} />
                                            </button>
                                            <p className="mx-[8px]">{likes}</p>
                                        </div>

                                        <div
                                            onClick={() => handleDislikeClick(_id)}
                                            className="cursor-pointer flex items-center justify-center py-[3px] hover:bg-[#3f3f3f]"
                                        >
                                            <button className="transform -scale-x-100 ml-2">
                                                <FontAwesomeIcon
                                                    size="lg"
                                                    icon={hasDisliked ? faSolidThumbsDown : faRegularThumbsDown}
                                                    color={"white"}
                                                />
                                            </button>
                                            <p className="mx-[8px]">{dislikes}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                        <div
                                            onClick={() => {
                                                setLoginPopupText("Like Comment");
                                                setLoginPopup(true);
                                            }}
                                            className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] py-[3px]"
                                        >
                                            <button className="ml-2">
                                                <FontAwesomeIcon size="lg" icon={hasLiked ? faSolidThumbsUp : faRegularThumbsUp} color={"white"} />
                                            </button>
                                            <p className="mx-[8px]">{likes}</p>
                                        </div>

                                        <div
                                            onClick={() => {
                                                setLoginPopupText("Dislike Comment");
                                                setLoginPopup(true);
                                            }}
                                            className="cursor-pointer flex items-center justify-center py-[3px] hover:bg-[#3f3f3f]"
                                        >
                                            <button className="transform -scale-x-100 ml-2">
                                                <FontAwesomeIcon
                                                    size="lg"
                                                    icon={hasDisliked ? faSolidThumbsDown : faRegularThumbsDown}
                                                    color={"white"}
                                                />
                                            </button>
                                            <p className="mx-[8px]">{dislikes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {userData && userData.username === username && (
                                <div className="absolute top-0 right-0 pl-4">
                                    {currentEditId !== _id && (
                                        <button
                                            onClick={() => {
                                                setCurrentEditId(_id);
                                                setEditComment(content);
                                            }}
                                            className="size-[31px] fill-none stroke-[#b5b4b4] mr-2 border-[0.01rem] border-transparent rounded-lg p-[5px] hover:border-[#b5b4b4]"
                                        >
                                            {icons.edit}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteComment(_id)}
                                        className="size-[33px] fill-none stroke-[#b5b4b4] border-[0.01rem] border-transparent rounded-lg p-[5px] hover:border-[#b5b4b4]"
                                    >
                                        {icons.dustbin}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        else
            return (
                <div key={_id} className="">
                    <hr className="mt-4 mb-3" />

                    <div className="flex items-start justify-start">
                        <div className="pt-[10px] cursor-pointer" onClick={() => navigate(`/channel/${username}`)}>
                            <div className="size-10 rounded-full overflow-hidden">
                                <img src={avatar} alt={fullname} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="ml-3 w-full relative" onClick={() => setExpandCommentId((prev) => (prev ? "" : _id))}>
                            <div className="text-md text-[#e9e9e9] text-[1.1rem]">
                                {fullname} <span className="text-[0.5rem] h-full align-middle">&bull;</span>{" "}
                                <span className="text-[0.8rem] text-[#c6c6c6]">{formattedCreatedAt}</span>
                            </div>
                            <div className="text-[#dedede] text-[0.8rem]">{"@" + username}</div>
                            <div className="w-full">
                                {currentEditId === _id ? (
                                    <form
                                        className="w-full"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            updateComment(_id);
                                        }}
                                    >
                                        <input
                                            type="text"
                                            name="editComment"
                                            id="editComment"
                                            required
                                            value={editComment}
                                            autoFocus
                                            onChange={(e) => setEditComment(e.target.value)}
                                            className="caret-[#8871ee] w-full mt-2 text-[0.9rem] bg-transparent text-white border-b-[0.01rem] border-b-[#8871ee] outline-none"
                                        />
                                        <div className="flex items-center justify-center gap-2 absolute bottom-0 right-0">
                                            <button
                                                type="reset"
                                                onClick={handleEditReset}
                                                className="rounded-full hover:bg-[#282828] pb-[2px] px-[10px] hover:bg-"
                                            >
                                                cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="border-[0.01rem] border-[#b5b4b4] hover:bg-[#8871ee] pb-[2px] rounded-full px-[10px] "
                                            >
                                                update
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={`text-[0.9rem] text-white mt-2 ${expandCommentId === _id ? "" : "line-clamp-3"}`}>{content}</div>
                                )}
                            </div>

                            <div className="mt-3">
                                {userData ? (
                                    <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit h-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                        <div
                                            onClick={() => handleLikeClick(_id)}
                                            className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] py-[3px]"
                                        >
                                            <button className="ml-2">
                                                <FontAwesomeIcon size="lg" icon={hasLiked ? faSolidThumbsUp : faRegularThumbsUp} color={"white"} />
                                            </button>
                                            <p className="mx-[8px]">{likes}</p>
                                        </div>

                                        <div
                                            onClick={() => handleDislikeClick(_id)}
                                            className="cursor-pointer flex items-center justify-center py-[3px] hover:bg-[#3f3f3f]"
                                        >
                                            <button className="transform -scale-x-100 ml-2">
                                                <FontAwesomeIcon
                                                    size="lg"
                                                    icon={hasDisliked ? faSolidThumbsDown : faRegularThumbsDown}
                                                    color={"white"}
                                                />
                                            </button>
                                            <p className="mx-[8px]">{dislikes}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                        <div
                                            onClick={() => {
                                                setLoginPopupText("Like Comment");
                                                setLoginPopup(true);
                                            }}
                                            className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] py-[3px]"
                                        >
                                            <button className="ml-2">
                                                <FontAwesomeIcon size="lg" icon={hasLiked ? faSolidThumbsUp : faRegularThumbsUp} color={"white"} />
                                            </button>
                                            <p className="mx-[8px]">{likes}</p>
                                        </div>

                                        <div
                                            onClick={() => {
                                                setLoginPopupText("Dislike Comment");
                                                setLoginPopup(true);
                                            }}
                                            className="cursor-pointer flex items-center justify-center py-[3px] hover:bg-[#3f3f3f]"
                                        >
                                            <button className="transform -scale-x-100 ml-2">
                                                <FontAwesomeIcon
                                                    size="lg"
                                                    icon={hasDisliked ? faSolidThumbsDown : faRegularThumbsDown}
                                                    color={"white"}
                                                />
                                            </button>
                                            <p className="mx-[8px]">{dislikes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {userData && userData.username === username && (
                                <div className="absolute top-0 right-0 pl-4">
                                    {currentEditId !== _id && (
                                        <button
                                            onClick={() => {
                                                setCurrentEditId(_id);
                                                setEditComment(content);
                                            }}
                                            className="size-[31px] fill-none stroke-[#b5b4b4] mr-2 border-[0.01rem] border-transparent rounded-lg p-[5px] hover:border-[#b5b4b4]"
                                        >
                                            {icons.edit}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteComment(_id)}
                                        className="size-[33px] fill-none stroke-[#b5b4b4] border-[0.01rem] border-transparent rounded-lg p-[5px] hover:border-[#b5b4b4]"
                                    >
                                        {icons.dustbin}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
    });

    async function toggleLike(commentId, toggleStatus) {
        const res = await commentServices.toggelCommentLike(commentId, toggleStatus);
        if (res) {
            if (toggleStatus) {
                setComments(
                    (
                        prevComments //array
                    ) =>
                        prevComments.map((comment) => {
                            if (comment._id === commentId) {
                                if (comment.hasLiked)
                                    return {
                                        ...comment,
                                        hasLiked: false,
                                        hasDisliked: false, //no need though
                                        likes: comment.likes - 1,
                                    };
                                else if (comment.hasDisliked)
                                    return {
                                        ...comment,
                                        hasLiked: true,
                                        hasDisliked: false,
                                        likes: comment.likes + 1,
                                        dislikes: comment.dislikes - 1,
                                    };
                                else
                                    return {
                                        ...comment,
                                        hasLiked: true,
                                        hasDislikes: false,
                                        likes: comment.likes + 1,
                                    };
                            } else return comment;
                        })
                );
            } else {
                setComments(
                    (
                        prevComments //array
                    ) =>
                        prevComments.map((comment) => {
                            if (comment._id === commentId) {
                                if (comment.hasDisliked)
                                    return {
                                        ...comment,
                                        hasLiked: false, //no need though
                                        hasDisliked: false,
                                        dislikes: comment.dislikes - 1,
                                    };
                                else if (comment.hasLiked)
                                    return {
                                        ...comment,
                                        hasLiked: false,
                                        hasDisliked: true,
                                        likes: comment.likes - 1,
                                        dislikes: comment.dislikes + 1,
                                    };
                                else
                                    return {
                                        ...comment,
                                        hasLiked: false,
                                        hasDisliked: true,
                                        dislikes: comment.dislikes + 1,
                                    };
                            } else return comment;
                        })
                );
            }
        }
    }

    function handleLikeClick(commentId) {
        if (userData) return toggleLike(commentId, true);
        return setLoginPopup(true);
    }

    function handleDislikeClick(commentId) {
        if (userData) return toggleLike(commentId, false);
        return setLoginPopup(true);
    }

    function closeLoginPopup(e) {
        if (loginRef.current === e.target) setLoginPopup(false);
    }

    function handleReset() {
        setNewComment("");
    }

    async function handleSubmit() {
        const res = await commentServices.addComment(videoId, newComment, setComments);
        if (res) {
            setNewComment("");
            setCommentsFound(true);
        }
    }

    if (!commentsFound)
        return (
            <div>
                <div>No comments found !</div>
                <div className="mt-4 mb-5 flex items-center justify-center border-[0.01rem] border-[#e7e7e7] rounded-lg px-3">
                    <input
                        type="text"
                        name="newComment"
                        id="newComment"
                        placeholder="Add a Comment"
                        value={newComment}
                        required
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-transparent text-white h-11 text-[1.1rem] placeholder:text-[#dadada] outline-none pr-2"
                    />
                    <div className="flex items-center gap-2">
                        <button type="reset" onClick={handleReset} className="bg-transparent hover:bg-[#282828] rounded-full px-[10px] pb-[2px]">
                            cancel
                        </button>
                        <button
                            onClick={() => {
                                if (userData) handleSubmit();
                                else {
                                    setLoginPopupText("add comment");
                                    setLoginPopup(true);
                                }
                            }}
                            type="submit"
                            className="border-[0.01rem] border-[#b5b4b4] rounded-full pb-[2px] bg-[#8871ee] hover:bg-[#7460ca] text-black font-semibold px-[10px]"
                        >
                            comment
                        </button>
                    </div>
                </div>
            </div>
        );
    else
        return (
            <div>
                <div>
                    <div>
                        <div className="text-lg">{comments?.length} Comments</div>
                        <div
                            className={`${
                                expandComments ? "flex" : "hidden"
                            } lg:flex mt-4 mb-5 items-center justify-center border-[0.01rem] border-[#e7e7e7] rounded-lg px-3`}
                        >
                            <input
                                type="text"
                                name="newComment"
                                id="newComment"
                                placeholder="Add a Comment"
                                value={newComment}
                                required
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-transparent text-white h-11 text-[1.1rem] placeholder:text-[#dadada] outline-none pr-2"
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    type="reset"
                                    onClick={handleReset}
                                    className="bg-transparent hover:bg-[#282828] rounded-full px-[10px] pb-[2px]"
                                >
                                    cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (userData) handleSubmit();
                                        else {
                                            setLoginPopupText("add comment");
                                            setLoginPopup(true);
                                        }
                                    }}
                                    type="submit"
                                    className="border-[0.01rem] border-[#b5b4b4] rounded-full pb-[2px] bg-[#8871ee] hover:bg-[#7460ca] text-black font-semibold px-[10px]"
                                >
                                    comment
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`${expandComments ? "block" : "hidden"} lg:block`}>{commentElements}</div>
                </div>

                {loading && page === 1 && <div>{"pulses"}</div>}

                {loading && page > 1 && (
                    <div className="flex items-center justify-center my-2 w-full">
                        <svg
                            aria-hidden="true"
                            className="inline size-5 animate-spin dark:text-[#b5b4b4] fill-[#8871ee]"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="text-md ml-3">Please wait . . .</span>
                    </div>
                )}

                {/* login popup */}
                {loginPopup && (
                    <div
                        ref={loginRef}
                        onClick={closeLoginPopup}
                        className="fixed inset-0 backdrop-blur-sm z-[150] flex flex-col items-center justify-center"
                    >
                        <LoginPopup close={() => setLoginPopup(false)} popupText={loginPopupText} />
                    </div>
                )}
            </div>
        );
}
