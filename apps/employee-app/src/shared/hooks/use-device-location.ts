import * as Location from 'expo-location';
import { useState } from 'react';

import type { AttendanceCoordinates } from '@rh-ponto/attendance-policies';

interface DeviceLocationState {
  coordinates: AttendanceCoordinates | null;
  permissionStatus: Location.PermissionStatus | 'idle';
  isLoading: boolean;
  errorMessage: string | null;
  refreshLocation: () => Promise<void>;
}

export const useDeviceLocation = (): DeviceLocationState => {
  const [coordinates, setCoordinates] = useState<AttendanceCoordinates | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | 'idle'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshLocation = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(permission.status);

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setCoordinates(null);
        setErrorMessage('Permita a localização para validar se você está dentro da área autorizada.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoordinates({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracyMeters: currentLocation.coords.accuracy,
      });
    } catch (error) {
      setCoordinates(null);
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível obter sua localização atual.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    coordinates,
    permissionStatus,
    isLoading,
    errorMessage,
    refreshLocation,
  };
};
