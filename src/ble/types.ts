import type { BleManager, Device as BleDevice } from 'react-native-ble-plx';

export enum ScanStates {
	Scanning = 'scanning',
	NotScanning = 'not-scanning',
}

export enum ScanEvents {
	Scan = 'SCAN',
	StopScan = 'STOP_SCAN',
}

export enum ConnectionStates {
	Disconnected = 'disconnected',
	Connecting = 'connecting',
	Connected = 'connected',
	Disconnecting = 'disconnecting',
}

export enum ConnectionEvents {
	Connect = 'CONNECT',
	Disconnect = 'DISCONNECT',
	ConnectionLost = 'CONNECTION_LOST',
}

export interface Device {
	id: string,
	name: string,
	rssi?: number,
	connectionState: ConnectionStates,
	bleDevice?: BleDevice,
}

export interface ScanState {
	currentState: ScanStates;
}

export interface ConnectionState {
	deviceId: string;
	currentState: ConnectionStates;
	error?: string;
}

export type BleManagerType = BleManager;

