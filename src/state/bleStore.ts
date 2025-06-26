// bleStore.js
import { observable } from '@legendapp/state';
import { BleManager, State } from 'react-native-ble-plx'; // Assuming you have BleManager imported

export const bleManager = new BleManager(); // Create your BLE Manager instance once
export const bleState$ = observable(State.Unknown); // Initialize with an initial state
export const isBlePoweredOn$ = observable(() => bleState$.get() === State.PoweredOn);


// New observables for scanning
export const isScanning$ = observable(false);
export const foundDevices$ = observable([]); // Array to store discovered devices
export const scanError$ = observable(null);

// Function to handle the scan logic
export const startScan = () => {
	if (!isBlePoweredOn$.get()) {
		console.warn('Bluetooth not powered on. Cannot start scan.');
		return;
	}

	if (isScanning$.get()) {
		console.warn('Already scanning. Stop current scan first.');
		return;
	}

	isScanning$.set(true);
	foundDevices$.set([]); // Clear previous scan results
	scanError$.set(null);

	// You can add scan options here, e.g., service UUIDs to filter
	const scanOptions = { /* allowDuplicates: false, ... */ };

	// The scan callback is what updates your Legend-State observables
	bleManager.startDeviceScan(null, scanOptions, (error, device) => {
		if (error) {
			console.error('BLE Scan Error:', error);
			//scanError$.set(error.reason);
			isScanning$.set(false); // Stop scanning on error
			bleManager.stopDeviceScan(); // Explicitly stop scan
			return;
		}

		if (device) {
			// Add device to foundDevices$ if not already present (to avoid duplicates from allowDuplicates: true)
			// Or if allowDuplicates is false, you'll get unique devices.
			foundDevices$.set(currentDevices => {
				const existingIndex = currentDevices.findIndex(d => d.id === device.id);
				if (existingIndex === -1) {
					return [...currentDevices, { id: device.id, name: device.id }];
				}
				return currentDevices; // Device already exists, do not add
			});
		}
	});

	// Stop scanning after a timeout (important to save battery and resources)
	setTimeout(() => {
		if (isScanning$.get()) { // Check if still scanning
			bleManager.stopDeviceScan();
			isScanning$.set(false);
			console.log('BLE Scan stopped after timeout.');
		}
	}, 10000); // Scan for 10 seconds
};

export const stopScan = () => {
	if (isScanning$.get()) {
		bleManager.stopDeviceScan();
		isScanning$.set(false);
		console.log('BLE Scan explicitly stopped.');
	}
};
