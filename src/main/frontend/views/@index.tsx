import {VerticalLayout} from '@vaadin/react-components/VerticalLayout';
import {VirtualList} from '@vaadin/react-components/VirtualList';
import {useSignal} from "@vaadin/hilla-react-signals";
import Channel from "Frontend/generated/com/pii/application/chat/Channel";
import {ChatService} from "Frontend/generated/endpoints";
import {useEffect} from "react";
import {Link} from "react-router-dom";
import AddChannelComponent from "Frontend/views/_AddChannelComponent";
import {pageTitle} from "Frontend/views/@layout";

export default function LobbyView() {
    pageTitle.value = "Lobby"

    const channels = useSignal<Channel[]>([])

    function refreshChannels() {
        ChatService.channels()
            .then(result => channels.value = result)
            .catch(console.error)
    }

    function handleChannelCreated(created: Channel) {
        channels.value = [...channels.value, created]
    }

    useEffect(() => {
        refreshChannels()
    }, [])

    return <VerticalLayout className="h-full" theme="padding spacing">
        <VirtualList className="flex-grow border p-s" items={channels.value}>
            {({item}) => {
                return <Link to={"/channel/" + item.id}>{item.name}</Link>
            }}
        </VirtualList>
        <AddChannelComponent onChannelCreated={handleChannelCreated}/>
    </VerticalLayout>
}
