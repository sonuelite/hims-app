export type AbhaProfile = {
  index: number;
  abhaNumber: string;
  firstName: string;
  lastName: string;
  gender?: 'Male' | 'Female' | 'Other';
  verified: boolean;
};

export function parseAbhaProfiles(response: unknown): AbhaProfile[] {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid ABHA profile response');
  }
  const result = response as Record<string, unknown>;
  if (result.success !== true) {
    throw new Error('Unable to fetch ABHA profiles. Please try again.');
  }
  const data = result.data as { profiles?: unknown } | undefined;
  if (!Array.isArray(data?.profiles)) {
    throw new Error('Invalid ABHA profile response');
  }
  return data.profiles.map((item: unknown) => {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid ABHA profile response');
    }
    const profile = item as Record<string, unknown>;
    if (
      typeof profile.name !== 'string' ||
      !profile.name.trim() ||
      typeof profile.abha_number !== 'string' ||
      typeof profile.index !== 'number'
    ) {
      throw new Error('Incomplete ABHA profile response');
    }
    const [firstName, ...rest] = profile.name.trim().split(/\s+/);
    const genders = { M: 'Male', F: 'Female', O: 'Other' } as const;
    const code =
      typeof profile.gender === 'string' ? profile.gender.toUpperCase() : '';
    return {
      index: profile.index,
      abhaNumber: profile.abha_number,
      firstName,
      lastName: rest.join(' '),
      gender: genders[code as keyof typeof genders],
      verified:
        profile.kyc_verified === true || profile.kyc_verified === 'true',
    };
  });
}
