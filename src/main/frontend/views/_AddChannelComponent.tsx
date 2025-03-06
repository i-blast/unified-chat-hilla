import {TextField} from "@vaadin/react-components/TextField";
import {Button} from "@vaadin/react-components/Button";
import {HorizontalLayout} from "@vaadin/react-components/HorizontalLayout";
import Channel from "Frontend/generated/com/pii/application/chat/Channel";
import {useSignal} from "@vaadin/hilla-react-signals";
import {ChatService} from "Frontend/generated/endpoints";


export type AddChannelComponentProps = {
    onChannelCreated?: (channel: Channel) => void
}

export default function AddChannelComponent(props: AddChannelComponentProps) {
    const newChannelName = useSignal<string>("")

    function addChannel() {
        if (newChannelName.value) {
            ChatService.createChannel(newChannelName.value)
                .then(created => {
                    newChannelName.value = ""
                    if (props.onChannelCreated) {
                        props.onChannelCreated(created)
                    }
                })
                .catch(console.error)
        }
    }

    return <HorizontalLayout className="w-full" theme="spacing">
        <TextField
            value={newChannelName.value}
            onChange={(e) => newChannelName.value = e.target.value}
            placeholder="New channel name"
            className="flex-grow"/>
        <Button onClick={addChannel}>Add channel</Button>
    </HorizontalLayout>
}