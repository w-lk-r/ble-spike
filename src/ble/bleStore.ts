// bleStore.js
import { observable } from '@legendapp/state';
import { BleManager, State } from 'react-native-ble-plx';
import { Device, ScanEvents, ScanState, ScanStates, ConnectionState, ConnectionEvents } from '@/src/ble/types';
import { initializeScanStateMachine } from '@/src/ble/scanStateMachine';
import { initializeConnectionStateMachine } from '@/src/ble/connectionStateMachine';

export const bleManager = new BleManager();

export const bleManagerState$ = observable(State.Unknown);
export const isBlePoweredOn$ = observable(() => bleManagerState$.get() === State.PoweredOn);
export const foundDevices$ = observable<Device[]>([]);

export const scanningState$ = observable<ScanState>({
	currentState: ScanStates.NotScanning,
})

export const connectionStates$ = observable<Map<string, ConnectionState>>(new Map());

const scanStateMachine = initializeScanStateMachine(bleManager, isBlePoweredOn$, foundDevices$, scanningState$);
const connectionStateMachine = initializeConnectionStateMachine(bleManager, isBlePoweredOn$, foundDevices$, connectionStates$);

export const scan = () => scanStateMachine.transition(ScanEvents.Scan);
export const stopScan = () => scanStateMachine.transition(ScanEvents.StopScan);

export const connectToDevice = (deviceId: string) => connectionStateMachine.transition(ConnectionEvents.Connect, deviceId);
export const disconnectFromDevice = (deviceId: string) => connectionStateMachine.transition(ConnectionEvents.Disconnect, deviceId);
