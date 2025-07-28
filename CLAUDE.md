# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `npx expo start`
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`
- **Run on web**: `npm run web`
- **Lint code**: `npm run lint`
- **Reset project** (moves starter code to app-example/): `npm run reset-project`

## Project Architecture

This is an Expo React Native project for BLE (Bluetooth Low Energy) device scanning and interaction.

### Key Technologies
- **Expo Router**: File-based routing system with tabs layout
- **Legend State**: State management library using observables (`@legendapp/state`)
- **react-native-ble-plx**: BLE functionality for device scanning and connection
- **NativeWind**: Tailwind CSS for React Native styling
- **TypeScript**: Strict mode enabled with path alias `@/*` pointing to project root

### Project Structure
- `src/app/`: Main application screens using Expo Router
  - Tab-based navigation (Home, Activity, Devices)
  - `devices/` subdirectory with dynamic routes for individual device pages
- `src/ble/`: BLE functionality and state management
  - `bleStore.ts`: Central BLE state with observables for manager state, scanning, discovered devices, and connection states
  - `scanStateMachine.ts`: State machine handling scan logic with states (Scanning/NotScanning) and events (Scan/StopScan)
  - `connectionStateMachine.ts`: State machine handling device connections with states (Disconnected/Connecting/Connected/Disconnecting)
  - `types.ts`: TypeScript definitions for BLE entities, scan states, and connection states
  - `useBle.ts`: React hook for BLE state change monitoring
  - `useConnection.ts`: React hook for device connection management
- `src/components/`: Reusable React components
- `src/screens/`: Screen components (chartScreen, deviceScreen, placeholderScreen)

### BLE Architecture
The BLE system uses dual state machine patterns:

**Scanning State Machine:**
- **States**: Scanning, NotScanning
- **Events**: Scan, StopScan
- Handles device discovery with 10-second timeout and deduplication

**Connection State Machine:**
- **States**: Disconnected, Connecting, Connected, Disconnecting  
- **Events**: Connect, Disconnect, ConnectionLost
- Manages individual device connections with error handling and auto-reconnection detection

**Central Store** (`bleStore.ts`):
- BLE manager instance and power state monitoring
- Observable arrays for discovered devices with connection states
- Observable map for per-device connection states
- Exported functions: `scan()`, `stopScan()`, `connectToDevice()`, `disconnectFromDevice()`

**Hooks**:
- `useBle()`: Monitors BLE adapter state changes
- `useConnection(deviceId)`: Provides connection state and controls for specific device

### Path Configuration
Uses TypeScript path mapping with `@/*` alias pointing to project root for clean imports.