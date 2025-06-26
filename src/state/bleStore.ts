// bleStore.js
import { observable } from '@legendapp/state';
import { BleManager, State } from 'react-native-ble-plx'; // Assuming you have BleManager imported

export const bleManager = new BleManager(); // Create your BLE Manager instance once
export const bleState$ = observable(State.Unknown); // Initialize with an initial state
export const isBlePoweredOn$ = observable(() => bleState$.get() === State.PoweredOn);
