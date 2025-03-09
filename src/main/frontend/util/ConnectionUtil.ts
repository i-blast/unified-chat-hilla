import {signal} from '@vaadin/hilla-react-signals';
import connectClient from 'Frontend/generated/connect-client.default';
import {State} from '@vaadin/hilla-frontend';

export const connectionActive = signal(connectClient.fluxConnection.state == State.ACTIVE);

connectClient.fluxConnection.addEventListener('state-changed', (event: CustomEvent<{ active: boolean }>) => {
    connectionActive.value = event.detail.active;
});