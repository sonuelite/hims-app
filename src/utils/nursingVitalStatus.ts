export type VitalKind = 'hr' | 'bp' | 'spo2' | 'rr' | 'temperature';
export type VitalStatus = 'normal' | 'moderate' | 'high' | 'unknown';

// Display bands from the supplied chart, not a clinical alerting protocol.
// Unspecified low ranges and invalid readings retain the neutral background.
export function getNursingVitalStatus(
  kind: VitalKind,
  reading: string,
): VitalStatus {
  if (kind === 'bp') {
    const match = reading
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
    if (!match) {
      return 'unknown';
    }
    const systolic = Number(match[1]);
    const diastolic = Number(match[2]);
    if (systolic <= 0 || diastolic <= 0) {
      return 'unknown';
    }
    if (systolic >= 130 || diastolic >= 80) {
      return 'high';
    }
    return systolic >= 120 ? 'moderate' : 'normal';
  }

  const match = reading.trim().match(/^(\d+(?:\.\d+)?)\s*(%|°?[CF])?$/i);
  if (!match) {
    return 'unknown';
  }
  let value = Number(match[1]);
  const unit = match[2]?.toUpperCase();
  if (value <= 0) {
    return 'unknown';
  }
  if (kind === 'temperature') {
    if (!unit || !/[CF]$/.test(unit)) {
      return 'unknown';
    }
    if (unit.endsWith('F')) {
      value = ((value - 32) * 5) / 9;
    }
    value = Math.round(value * 10) / 10;
    if (value >= 38) {
      return 'high';
    }
    if (value >= 37.6) {
      return 'moderate';
    }
    return value >= 36.1 ? 'normal' : 'unknown';
  }
  if (unit && !(kind === 'spo2' && unit === '%')) {
    return 'unknown';
  }
  switch (kind) {
    case 'hr':
      if (value > 120) {
        return 'high';
      }
      if (value > 100) {
        return 'moderate';
      }
      return value >= 60 ? 'normal' : 'unknown';
    case 'spo2':
      if (value > 100) {
        return 'unknown';
      }
      if (value < 93) {
        return 'high';
      }
      return value < 95 ? 'moderate' : 'normal';
    case 'rr':
      if (value > 24) {
        return 'high';
      }
      if (value > 20) {
        return 'moderate';
      }
      return value >= 12 ? 'normal' : 'unknown';
  }
}
