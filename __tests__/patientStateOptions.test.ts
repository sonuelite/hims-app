import { normalizePatientStates } from '../src/utils/patientStateOptions';

test('maps registration state IDs and names to dropdown options', () => {
  expect(
    normalizePatientStates({
      code: 200,
      message: 'Fetch data by ID Successfully',
      data: [
        {
          states_id: 17,
          states_name: ' Karnataka ',
          states_code: '29',
          countryss_id: 101,
        },
      ],
    }),
  ).toEqual([{ id: '17', name: 'Karnataka' }]);
});

test('supports string IDs and direct arrays', () => {
  expect(
    normalizePatientStates({
      data: [{ states_id: '17', states_name: 'Karnataka' }],
    }),
  ).toEqual([{ id: '17', name: 'Karnataka' }]);
  expect(
    normalizePatientStates([{ states_id: 38, states_name: 'Uttar Pradesh' }]),
  ).toEqual([{ id: '38', name: 'Uttar Pradesh' }]);
});

test('distinguishes empty results from malformed responses', () => {
  expect(normalizePatientStates({ data: [] })).toEqual([]);
  expect(() => normalizePatientStates({ message: 'Unauthorized' })).toThrow();
  expect(() =>
    normalizePatientStates({ data: [{ name: 'Missing ID' }] }),
  ).toThrow();
});

test('does not expose unusable state options', () => {
  expect(
    normalizePatientStates({
      data: [
        null,
        { states_id: '', states_name: 'Invalid' },
        { states_id: 17, states_name: 'Karnataka' },
      ],
    }),
  ).toEqual([{ id: '17', name: 'Karnataka' }]);
});
