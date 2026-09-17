import { departmentOptions, doctorOptions } from '../src/utils/opdOptions';

it('preserves backend department IDs, names and entities', () => {
  expect(
    departmentOptions({
      code: 200,
      data: [
        {
          dept_id: 9,
          department_name: 'Marketing',
          entity_id: 1,
          isDeleted: 0,
        },
        { dept_id: 71, department_name: 'Surgery', entity_id: 1, isDeleted: 1 },
      ],
    }),
  ).toEqual([{ id: '9', name: 'Marketing', entityId: '1' }]);
});

it('maps doctor identity without inventing missing qualifications', () => {
  expect(
    doctorOptions({
      data: [{ employee_id: 12, first_name: 'Test', last_name: 'Doctor' }],
    }),
  ).toEqual([{ id: '12', name: 'Test Doctor', qualification: '' }]);
});

it('distinguishes empty results from failed or malformed responses', () => {
  expect(doctorOptions({ code: 200, data: [] })).toEqual([]);
  expect(() => doctorOptions({ code: 500, data: [] })).toThrow();
  expect(() => doctorOptions({ data: [{}] })).toThrow();
  expect(() =>
    departmentOptions({ data: [{ department_name: 'Surgery' }] }),
  ).toThrow();
});

it('maps the getAllDoctors response even when department_id and fee are null', () => {
  expect(
    doctorOptions({
      code: 200,
      message: 'Success',
      data: [
        {
          full_name: 'Test Doctor One',
          employee_id: 161,
          department_id: null,
          fee: null,
          status: 'ACTIVE',
        },
        {
          full_name: 'Test Doctor Two',
          employee_id: 160,
          department_id: null,
          fee: null,
          status: 'ACTIVE',
        },
      ],
    }),
  ).toEqual([
    { id: '161', name: 'Test Doctor One', qualification: '' },
    { id: '160', name: 'Test Doctor Two', qualification: '' },
  ]);
});
