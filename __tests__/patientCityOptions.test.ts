import { normalizePatientCities } from '../src/utils/patientCityOptions';

test('maps the supplied cities independently of the state ID', () => {
  expect(
    normalizePatientCities({
      code: 200,
      message: 'These are states',
      data: [
        { city_id: 3, city_name: 'Port Blair', states_id: 1, status: 'ACTIVE' },
        { city_id: 4, city_name: 'Rangat', states_id: 1, status: 'ACTIVE' },
        {
          city_id: 1767,
          city_name: 'South Andaman',
          states_id: 1,
          status: 'ACTIVE',
        },
      ],
    }),
  ).toEqual([
    { id: '3', name: 'Port Blair' },
    { id: '4', name: 'Rangat' },
    { id: '1767', name: 'South Andaman' },
  ]);
});

test('supports string IDs and trims city names', () => {
  expect(
    normalizePatientCities([{ city_id: '3', city_name: ' Port Blair ' }]),
  ).toEqual([{ id: '3', name: 'Port Blair' }]);
});

test('distinguishes empty results from invalid responses', () => {
  expect(normalizePatientCities({ data: [] })).toEqual([]);
  expect(() => normalizePatientCities({ message: 'Unauthorized' })).toThrow();
  expect(() =>
    normalizePatientCities({ data: [{ city_name: 'Missing ID' }] }),
  ).toThrow();
});

test('ignores unusable options', () => {
  expect(
    normalizePatientCities({
      data: [
        null,
        { city_id: '', city_name: 'Invalid' },
        { city_id: 10, city_name: 'City A' },
      ],
    }),
  ).toEqual([{ id: '10', name: 'City A' }]);
});
