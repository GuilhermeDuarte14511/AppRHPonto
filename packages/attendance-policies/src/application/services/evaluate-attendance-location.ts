import type {
  AttendancePolicy,
  EmployeeAllowedLocation,
  EmployeeAttendancePolicy,
  WorkLocation,
} from '../../domain/entities/attendance-policy';

export interface AttendanceCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number | null;
}

export interface AttendanceLocationEvaluationInput {
  policy: AttendancePolicy;
  policyAssignment: EmployeeAttendancePolicy | null;
  allowedLocations: EmployeeAllowedLocation[];
  locationCatalog: WorkLocation[];
  coordinates: AttendanceCoordinates | null;
}

export interface AttendanceLocationEvaluationResult {
  status: 'allowed' | 'pending_review' | 'blocked';
  reasonCode:
    | 'location_not_required'
    | 'location_missing'
    | 'allow_any_location'
    | 'within_allowed_area'
    | 'outside_allowed_area'
    | 'missing_allowed_locations';
  title: string;
  description: string;
  requiresPhoto: boolean;
  requiresGeolocation: boolean;
  matchedLocation: WorkLocation | null;
  nearestAllowedLocation: WorkLocation | null;
  distanceMeters: number | null;
  canSubmitPunch: boolean;
}

const earthRadiusMeters = 6371000;

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateDistanceMeters = (
  source: AttendanceCoordinates,
  target: Pick<AttendanceCoordinates, 'latitude' | 'longitude'>,
) => {
  const latitudeDelta = toRadians(target.latitude - source.latitude);
  const longitudeDelta = toRadians(target.longitude - source.longitude);
  const sourceLatitude = toRadians(source.latitude);
  const targetLatitude = toRadians(target.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(sourceLatitude) * Math.cos(targetLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const resolveValidationStrategy = (input: AttendanceLocationEvaluationInput) =>
  input.policyAssignment?.validationStrategy ?? input.policy.validationStrategy;

const resolveGeolocationRequired = (input: AttendanceLocationEvaluationInput) =>
  input.policyAssignment?.geolocationRequired ?? input.policy.geolocationRequired;

const resolvePhotoRequired = (input: AttendanceLocationEvaluationInput) =>
  input.policyAssignment?.photoRequired ?? input.policy.photoRequired;

const resolveOutsideAreaStatus = (input: AttendanceLocationEvaluationInput): AttendanceLocationEvaluationResult['status'] => {
  const validationStrategy = resolveValidationStrategy(input);

  if (input.policyAssignment?.blockOutsideAllowedLocations || validationStrategy === 'block') {
    return 'blocked';
  }

  if (validationStrategy === 'pending_review') {
    return 'pending_review';
  }

  return 'allowed';
};

export const evaluateAttendanceLocation = (
  input: AttendanceLocationEvaluationInput,
): AttendanceLocationEvaluationResult => {
  const coordinates = input.coordinates;
  const validationStrategy = resolveValidationStrategy(input);
  const geolocationRequired = resolveGeolocationRequired(input);
  const photoRequired = resolvePhotoRequired(input);

  if (!geolocationRequired) {
    return {
      status: 'allowed',
      reasonCode: 'location_not_required',
      title: 'Localização não obrigatória',
      description: 'A política atual não exige geolocalização para registrar o ponto.',
      requiresPhoto: photoRequired,
      requiresGeolocation: false,
      matchedLocation: null,
      nearestAllowedLocation: null,
      distanceMeters: null,
      canSubmitPunch: true,
    };
  }

  if (!coordinates) {
    const status =
      validationStrategy === 'pending_review'
        ? 'pending_review'
        : validationStrategy === 'allow'
          ? 'allowed'
          : 'blocked';

    return {
      status,
      reasonCode: 'location_missing',
      title: 'Localização indisponível',
      description:
        status === 'blocked'
          ? 'A política exige geolocalização para registrar o ponto neste momento.'
          : 'A localização não foi obtida. O registro pode seguir, mas deve ser revisado pelo RH.',
      requiresPhoto: photoRequired,
      requiresGeolocation: true,
      matchedLocation: null,
      nearestAllowedLocation: null,
      distanceMeters: null,
      canSubmitPunch: status !== 'blocked',
    };
  }

  if (input.policyAssignment?.allowAnyLocation || !input.policy.requiresAllowedLocations) {
    return {
      status: 'allowed',
      reasonCode: 'allow_any_location',
      title: 'Marcação liberada',
      description: 'A política atual permite registrar o ponto sem restringir a geofence a um local específico.',
      requiresPhoto: photoRequired,
      requiresGeolocation: true,
      matchedLocation: null,
      nearestAllowedLocation: null,
      distanceMeters: null,
      canSubmitPunch: true,
    };
  }

  const allowedLocationIds = new Set(input.allowedLocations.map((item) => item.workLocationId));
  const allowedLocations = input.locationCatalog.filter(
    (location) =>
      location.isActive &&
      allowedLocationIds.has(location.id) &&
      location.latitude != null &&
      location.longitude != null,
  );

  if (allowedLocations.length === 0) {
    return {
      status: 'blocked',
      reasonCode: 'missing_allowed_locations',
      title: 'Sem locais autorizados',
      description: 'A política exige locais autorizados, mas nenhum local ativo foi vinculado a este colaborador.',
      requiresPhoto: photoRequired,
      requiresGeolocation: true,
      matchedLocation: null,
      nearestAllowedLocation: null,
      distanceMeters: null,
      canSubmitPunch: false,
    };
  }

  const evaluatedLocations = allowedLocations.map((location) => ({
    location,
    distanceMeters: calculateDistanceMeters(coordinates, {
      latitude: location.latitude as number,
      longitude: location.longitude as number,
    }),
  }));

  const matchedLocation = evaluatedLocations.find((item) => item.distanceMeters <= item.location.radiusMeters) ?? null;

  if (matchedLocation) {
    return {
      status: 'allowed',
      reasonCode: 'within_allowed_area',
      title: 'Dentro da área autorizada',
      description: `A marcação está dentro do raio configurado para ${matchedLocation.location.name}.`,
      requiresPhoto: photoRequired,
      requiresGeolocation: true,
      matchedLocation: matchedLocation.location,
      nearestAllowedLocation: matchedLocation.location,
      distanceMeters: Math.round(matchedLocation.distanceMeters),
      canSubmitPunch: true,
    };
  }

  const nearestAllowedLocation =
    [...evaluatedLocations].sort((left, right) => left.distanceMeters - right.distanceMeters)[0] ?? null;
  const status = resolveOutsideAreaStatus(input);

  return {
    status,
    reasonCode: 'outside_allowed_area',
    title:
      status === 'blocked'
        ? 'Fora da área permitida'
        : status === 'pending_review'
          ? 'Fora da área, com revisão'
          : 'Marcação liberada fora da área',
    description:
      nearestAllowedLocation == null
        ? 'A localização atual não coincide com nenhum local autorizado.'
        : `O ponto está fora da geofence. Local autorizado mais próximo: ${nearestAllowedLocation.location.name}.`,
    requiresPhoto: photoRequired,
    requiresGeolocation: true,
    matchedLocation: null,
    nearestAllowedLocation: nearestAllowedLocation?.location ?? null,
    distanceMeters: nearestAllowedLocation ? Math.round(nearestAllowedLocation.distanceMeters) : null,
    canSubmitPunch: status !== 'blocked',
  };
};
