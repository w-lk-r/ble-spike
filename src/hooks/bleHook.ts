// hooks.js (or directly in your component if it's a simple app)
import { useEffect } from 'react';
import { bleManager, bleState$ } from '@/src/state/bleStore'; // Import your store

export function useBleStateListener() {
	useEffect(() => {
		// The `true` argument ensures the current state is emitted immediately
		const subscription = bleManager.onStateChange(state => {
			console.log('BLE State Changed:', state);
			bleState$.set(state); // Update the Legend-State observable

		}, true);

		// Cleanup the subscription when the component unmounts
		return () => subscription.remove();
	}, [bleManager]); // Depend on bleManager to ensure the effect reruns if manager instance changes (unlikely)
}
