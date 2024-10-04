import { useSelector } from "react-redux";

export default function useChannelHook() {
    const channelData = useSelector((state) => state.channel.channelData);

    return channelData;
}
