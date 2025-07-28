import { useObservable } from '@legendapp/state/react';
import { connectionStates$, connectToDevice, disconnectFromDevice } from '@/src/ble/bleStore';
import { ConnectionStates } from '@/src/ble/types';

export function useConnection(deviceId?: string) {
	const connectionStates = useObservable(connectionStates$);
	
	const connectionState = deviceId ? connectionStates.get(deviceId) : undefined;
	const isConnected = connectionState?.currentState === ConnectionStates.Connected;
	const isConnecting = connectionState?.currentState === ConnectionStates.Connecting;
	const isDisconnecting = connectionState?.currentState === ConnectionStates.Disconnecting;
	const connectionError = connectionState?.error;

	const connect = (targetDeviceId: string) => {
		connectToDevice(targetDeviceId);
	};

	const disconnect = (targetDeviceId: string) => {
		disconnectFromDevice(targetDeviceId);
	};

	return {
		connectionState: connectionState?.currentState || ConnectionStates.Disconnected,
		isConnected,
		isConnecting,
		isDisconnecting,
		connectionError,
		connect,
		disconnect,
		allConnectionStates: connectionStates,
	};
};