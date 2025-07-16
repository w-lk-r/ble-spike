// scanStateMachine.js
import { Observable } from '@legendapp/state';
import { BleManagerType, ScanStates, ScanEvents, Device, ScanState } from '@/src/ble/types';

export const initializeScanStateMachine =
	(
		bleManager: BleManagerType,
		isBlePoweredOn$: Observable<boolean>,
		foundDevices$: Observable<Device[]>,
		scanningState$: Observable<ScanState>
	) => {
		const transition = (event: ScanEvents) => {
			const current = scanningState$.currentState.get();
			let nextState: ScanStates | undefined;

			switch (current) {
				case ScanStates.Scanning:
					if (event === ScanEvents.Scan) {
						_startScan()
						nextState = ScanStates.Scanning
					}
					if (event === ScanEvents.StopScan) {
						bleManager.stopDeviceScan();
						nextState = ScanStates.NotScanning
					}
				case ScanStates.NotScanning:
					if (event === ScanEvents.Scan) {
						_startScan()
						nextState = ScanStates.Scanning
					}
					if (event === ScanEvents.StopScan) {
						bleManager.stopDeviceScan();
						nextState = ScanStates.NotScanning
					}
			}

			if (nextState) {
				scanningState$.currentState.set(nextState);
			} else {
				console.warn(`Event "${event}" ignored in state "${current}".`);
			}
		}


		// Function to handle the scan logic
		const _startScan = () => {
			if (!isBlePoweredOn$.get()) {
				console.warn('Bluetooth not powered on. Cannot start scan.');
				return;
			}

			foundDevices$.set([]); // Clear previous scan results

			// You can add scan options here, e.g., service UUIDs to filter
			const scanOptions = { /* allowDuplicates: false, ... */ };

			// The scan callback is what updates your Legend-State observables
			bleManager.startDeviceScan(null, scanOptions, (error, device) => {
				if (error) {
					console.error('BLE Scan Error:', error);
					transition(ScanEvents.StopScan); // Explicitly stop scan
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
				if (scanningState$.currentState.get() === ScanStates.Scanning) { // Check if still scanning
					transition(ScanEvents.StopScan);
					console.log('BLE Scan stopped after timeout.');
				}
			}, 10000); // Scan for 10 seconds
		};


		return {
			scanningState$,
			transition,
		}
	}





