import { Observable } from '@legendapp/state';
import { BleManagerType, ConnectionStates, ConnectionEvents, Device, ConnectionState } from '@/src/ble/types';

export const initializeConnectionStateMachine = (
	bleManager: BleManagerType,
	isBlePoweredOn$: Observable<boolean>,
	foundDevices$: Observable<Device[]>,
	connectionStates$: Observable<Map<string, ConnectionState>>
) => {
	const transition = (event: ConnectionEvents, deviceId: string) => {
		const currentConnectionState = connectionStates$.get().get(deviceId);
		const current = currentConnectionState?.currentState || ConnectionStates.Disconnected;
		let nextState: ConnectionStates | undefined;

		switch (current) {
			case ConnectionStates.Disconnected:
				if (event === ConnectionEvents.Connect) {
					_connectToDevice(deviceId);
					nextState = ConnectionStates.Connecting;
				}
				break;

			case ConnectionStates.Connecting:
				if (event === ConnectionEvents.Disconnect) {
					_disconnectFromDevice(deviceId);
					nextState = ConnectionStates.Disconnecting;
				}
				// ConnectionLost is handled in the connection callback
				break;

			case ConnectionStates.Connected:
				if (event === ConnectionEvents.Disconnect) {
					_disconnectFromDevice(deviceId);
					nextState = ConnectionStates.Disconnecting;
				}
				if (event === ConnectionEvents.ConnectionLost) {
					nextState = ConnectionStates.Disconnected;
				}
				break;

			case ConnectionStates.Disconnecting:
				// Allow transition to disconnected when disconnection completes
				if (event === ConnectionEvents.ConnectionLost) {
					nextState = ConnectionStates.Disconnected;
				}
				break;
		}

		if (nextState) {
			_updateConnectionState(deviceId, nextState);
			_updateDeviceConnectionState(deviceId, nextState);
		} else {
			console.warn(`Connection event "${event}" ignored in state "${current}" for device ${deviceId}.`);
		}
	};

	const _updateConnectionState = (deviceId: string, state: ConnectionStates, error?: string) => {
		connectionStates$.set(currentStates => {
			const newStates = new Map(currentStates);
			newStates.set(deviceId, {
				deviceId,
				currentState: state,
				error
			});
			return newStates;
		});
	};

	const _updateDeviceConnectionState = (deviceId: string, state: ConnectionStates) => {
		foundDevices$.set(currentDevices => {
			const deviceIndex = currentDevices.findIndex(d => d.id === deviceId);
			if (deviceIndex !== -1) {
				const updatedDevices = [...currentDevices];
				updatedDevices[deviceIndex] = {
					...updatedDevices[deviceIndex],
					connectionState: state
				};
				return updatedDevices;
			}
			return currentDevices;
		});
	};

	const _connectToDevice = async (deviceId: string) => {
		if (!isBlePoweredOn$.get()) {
			console.warn('Bluetooth not powered on. Cannot connect to device.');
			_updateConnectionState(deviceId, ConnectionStates.Disconnected, 'Bluetooth not powered on');
			return;
		}

		const devices = foundDevices$.get();
		const device = devices.find(d => d.id === deviceId);
		
		if (!device?.bleDevice) {
			console.warn(`Device ${deviceId} not found in discovered devices.`);
			_updateConnectionState(deviceId, ConnectionStates.Disconnected, 'Device not found');
			return;
		}

		try {
			console.log(`Connecting to device: ${deviceId}`);
			
			// Connect to the device
			const connectedDevice = await device.bleDevice.connect();
			
			// Set up disconnection listener
			connectedDevice.onDisconnected((error) => {
				console.log(`Device ${deviceId} disconnected:`, error);
				transition(ConnectionEvents.ConnectionLost, deviceId);
			});

			// Update state to connected
			_updateConnectionState(deviceId, ConnectionStates.Connected);
			_updateDeviceConnectionState(deviceId, ConnectionStates.Connected);
			
			console.log(`Successfully connected to device: ${deviceId}`);

		} catch (error) {
			console.error(`Failed to connect to device ${deviceId}:`, error);
			_updateConnectionState(deviceId, ConnectionStates.Disconnected, error?.toString());
			_updateDeviceConnectionState(deviceId, ConnectionStates.Disconnected);
		}
	};

	const _disconnectFromDevice = async (deviceId: string) => {
		const devices = foundDevices$.get();
		const device = devices.find(d => d.id === deviceId);
		
		if (!device?.bleDevice) {
			console.warn(`Device ${deviceId} not found for disconnection.`);
			_updateConnectionState(deviceId, ConnectionStates.Disconnected);
			return;
		}

		try {
			console.log(`Disconnecting from device: ${deviceId}`);
			await device.bleDevice.cancelConnection();
			
			_updateConnectionState(deviceId, ConnectionStates.Disconnected);
			_updateDeviceConnectionState(deviceId, ConnectionStates.Disconnected);
			
			console.log(`Successfully disconnected from device: ${deviceId}`);

		} catch (error) {
			console.error(`Failed to disconnect from device ${deviceId}:`, error);
			// Still mark as disconnected even if disconnect failed
			_updateConnectionState(deviceId, ConnectionStates.Disconnected, error?.toString());
			_updateDeviceConnectionState(deviceId, ConnectionStates.Disconnected);
		}
	};

	return {
		transition,
		getConnectionState: (deviceId: string) => connectionStates$.get().get(deviceId),
	};
};