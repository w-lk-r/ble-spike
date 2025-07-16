// bleStore.js
import { observable } from '@legendapp/state';
import { BleManager, State } from 'react-native-ble-plx'; // Assuming you have BleManager imported
import { Device, ScanEvents, ScanState, ScanStates } from '@/src/ble/types';
import { initializeScanStateMachine } from '@/src/ble/scanStateMachine';

export const bleManager = new BleManager(); // Create your BLE Manager instance once

export const bleManagerState$ = observable(State.Unknown); // Initialize with an initial state
export const isBlePoweredOn$ = observable(() => bleManagerState$.get() === State.PoweredOn);
export const foundDevices$ = observable<Device[]>([]); // Array to store discovered devices

const scanningState$ = observable<ScanState>({
	currentState: ScanStates.NotScanning,
})


const scanStateMachine = initializeScanStateMachine(bleManager, isBlePoweredOn$, foundDevices$, scanningState$);

export const scan = () => scanStateMachine.transition(ScanEvents.Scan);
export const stopScan = () => scanStateMachine.transition(ScanEvents.StopScan);
