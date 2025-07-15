import type { BleManager } from 'react-native-ble-plx';

export enum ScanStates {
	Scanning = 'scanning',
	NotScanning = 'not-scanning',
}

export enum ScanEvents {
	Scan = 'SCAN',
	StopScan = 'STOP_SCAN',
}

export interface Device {
	id: String,
	name: String,
}


export interface ScanState {
	currentState: ScanStates;
}


export type BleManagerType = BleManager;

