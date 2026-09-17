import { parseAbhaProfiles } from '../src/utils/patientAbhaProfiles';

const profile = {
  index: 1,
  abha_number: 'xx-xxxx-xxxx-1728',
  name: 'Test Patient',
  gender: 'M',
  kyc_verified: 'true',
  internal: false,
};
const response = (profiles: unknown[]) => ({
  success: true,
  data: { profiles },
});

it('maps the profile search response to patient fields', () => {
  expect(parseAbhaProfiles(response([profile]))).toEqual([
    {
      index: 1,
      abhaNumber: profile.abha_number,
      firstName: 'Test',
      lastName: 'Patient',
      gender: 'Male',
      verified: true,
    },
  ]);
});

it('retains multiple profiles and does not treat a false KYC string as verified', () => {
  const profiles = parseAbhaProfiles(
    response([
      profile,
      {
        ...profile,
        index: 2,
        name: 'Single',
        gender: 'F',
        kyc_verified: 'false',
      },
    ]),
  );
  expect(profiles).toHaveLength(2);
  expect(profiles[1]).toMatchObject({
    firstName: 'Single',
    lastName: '',
    gender: 'Female',
    verified: false,
  });
});

it('handles no matches and rejects unsuccessful or malformed responses', () => {
  expect(parseAbhaProfiles(response([]))).toEqual([]);
  expect(() => parseAbhaProfiles({ success: false })).toThrow();
  expect(() => parseAbhaProfiles({ success: true, data: null })).toThrow();
  expect(() => parseAbhaProfiles(response([{}]))).toThrow();
});
