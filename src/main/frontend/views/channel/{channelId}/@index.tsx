import {useNavigate, useParams} from 'react-router-dom';
import {MessageInput} from '@vaadin/react-components/MessageInput';
import {MessageList} from '@vaadin/react-components/MessageList';
import {VerticalLayout} from '@vaadin/react-components/VerticalLayout';
import {useSignal} from "@vaadin/hilla-react-signals";
import Channel from 'Frontend/generated/com/pii/application/chat/Channel';
import {ChatService} from "Frontend/generated/endpoints";
import {useEffect} from 'react';
import {Notification} from "@vaadin/react-components";
import Message from 'Frontend/generated/com/pii/application/chat/Message';
import {Subscription} from "@vaadin/hilla-frontend";


export default function ChannelView() {
    const {channelId} = useParams()
    const channel = useSignal<Channel | undefined>(undefined)
    const messages = useSignal<Message[]>([])
    const navigate = useNavigate()
    const subscription = useSignal<Subscription<Message[]> | undefined>(undefined)

    async function updateChannel() {
        channel.value = channelId ? await ChatService.channel(channelId) : undefined
        if (!channel.value) {
            navigate('/')
        } else {
            document.title = channel.value.name
        }
    }

    async function postMessage(message: string) {
        if (!channel.value) {
            throw new Error("No channel to post to")
        }
        try {
            await ChatService.postMessage(channel.value.id, message)
        } catch (_) {
            Notification.show('Failed to send the message. Please, try again later...', {
                theme: 'error',
                position: 'bottom-end'
            })
        }
    }

    function unsubscribe() {
        if (subscription.value) {
            console.log("Unsubscribing")
            subscription.value.cancel()
            subscription.value = undefined
        }
    }

    function subscribe() {
        unsubscribe()
        if (channel.value) {
            console.log("Subscribing to", channel.value.id)
            subscription.value = ChatService.liveMessages(channel.value.id)
                .onNext(incoming => messages.value = [...messages.value, ...incoming])
                .onError(() => console.error("Error in subscription"))
        }
    }

    useEffect(() => {
        updateChannel().then(subscribe).catch(console.error)
        return unsubscribe
    }, [channelId])

    return <VerticalLayout theme="padding spacing" className="h-full">
        <MessageList className="h-full w-full border" items={messages.value.map(message => ({
            text: message.message,
            userName: message.author,
            time: message.timestamp
        }))}/>
        <MessageInput className="w-full" onSubmit={e => postMessage(e.detail.value)}/>
    </VerticalLayout>
}
