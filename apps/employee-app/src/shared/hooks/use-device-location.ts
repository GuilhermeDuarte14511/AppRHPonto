import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

import type { AttendanceCoordinates } from '@rh-ponto/attendance-policies';

interface DeviceLocationAddress {
  displayAddress: string;
  shortAddress: string;
}

interface DeviceLocationState {
  coordinates: AttendanceCoordinates | null;
  address: DeviceLocationAddress | null;
  permissionStatus: Location.PermissionStatus | 'idle';
  isLoading: boolean;
  errorMessage: string | null;
  refreshLocation: () => Promise<void>;
}

const compactAddressPart = (value?: string | null) => value?.trim() ?? '';

const buildAddressState = (place: Location.LocationGeocodedAddress): DeviceLocationAddress | null => {
  const streetNumber = [compactAddressPart(place.street), compactAddressPart(place.streetNumber)]
    .filter(Boolean)
    .join(', ');
  const district = compactAddressPart(place.district);
  const city = compactAddressPart(place.city ?? place.subregion);
  const region = compactAddressPart(place.region);
  const postalCode = compactAddressPart(place.postalCode);

  const shortAddress = [streetNumber, district].filter(Boolean).join(' • ');
  const displayAddress = [streetNumber || district, city, region, postalCode].filter(Boolean).join(' - ');

  if (!displayAddress) {
    return null;
  }

  return {
    displayAddress,
    shortAddress: shortAddress || displayAddress,
  };
};

export const useDeviceLocation = (): DeviceLocationState => {
  const [coordinates, setCoordinates] = useState<AttendanceCoordinates | null>(null);
  const [address, setAddress] = useState<DeviceLocationAddress | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | 'idle'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshLocation = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(permission.status);

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setCoordinates(null);
        setAddress(null);
        setErrorMessage('Permita a localização para validar se você está dentro da área autorizada.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const nextCoordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracyMeters: currentLocation.coords.accuracy,
      };

      const places = await Location.reverseGeocodeAsync({
        latitude: nextCoordinates.latitude,
        longitude: nextCoordinates.longitude,
      });
      const nextAddress = places.map(buildAddressState).find(Boolean) ?? null;

      setCoordinates(nextCoordinates);
      setAddress(nextAddress);

      if (!nextAddress) {
        setErrorMessage(
          'Sua localização foi encontrada, mas não conseguimos resolver o endereço. Atualize e tente novamente.',
        );
      }
    } catch (error) {
      setCoordinates(null);
      setAddress(null);
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível obter sua localização atual.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    coordinates,
    address,
    permissionStatus,
    isLoading,
    errorMessage,
    refreshLocation,
  };
};
