/** @jest-environment-options {"customExportConditions":["node","node-addons"]} */
import axiosInstance from '../src/network/axiosInstance';
import { store } from '../src/store/store';
import { logout, setAccessToken } from '../src/store/reducer/auth/authSlice';
import {
  createPatient,
  getAllActiveCountry,
  getCitiesByStateId,
  getStatesByCountryId,
  loginUser,
} from '../src/network/api';
import type { InternalAxiosRequestConfig } from 'axios';

const requests: InternalAxiosRequestConfig[] = [];
const originalAdapter = axiosInstance.defaults.adapter;

beforeEach(() => {
  store.dispatch(logout());
  requests.length = 0;
  axiosInstance.defaults.adapter = async config => {
    requests.push(config);
    return {
      data: { code: 200, data: [] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  };
});

afterEach(() => {
  store.dispatch(logout());
  axiosInstance.defaults.adapter = originalAdapter;
});

test('reads the latest token for each request and removes authorization on logout', async () => {
  store.dispatch(setAccessToken('test-first'));
  await getAllActiveCountry();
  store.dispatch(setAccessToken('test-next'));
  await getStatesByCountryId(101);
  store.dispatch(logout());
  await axiosInstance.get('/test', {
    headers: { Authorization: 'Bearer stale' },
  });
  expect(requests[0].headers.Authorization).toBe('Bearer test-first');
  expect(requests[1].headers.Authorization).toBe('Bearer test-next');
  expect(requests[2].headers.Authorization).toBeUndefined();
});

test('allows login without a token and applies shared headers', async () => {
  await loginUser({ encryptedEmail: 'test', encryptedPassword: 'test' });
  expect(requests[0].url).toBe('/api/auth/signin');
  expect(requests[0].headers.Authorization).toBeUndefined();
  expect(requests[0].headers['x-entity-id']).toBe('1');
});

test('keeps lookup parameters and cancellation signals', async () => {
  const controller = new AbortController();
  await getCitiesByStateId(1, controller.signal);
  expect(requests[0].url).toBe('/api/WL/getcitybystateid/1');
  expect(requests[0].signal).toBe(controller.signal);
  expect(requests[0].params).toEqual({
    page_url: '/master/opd-management/patients/registration',
    page_name: 'registration',
  });
});

test('authenticates patient registration through the shared instance', async () => {
  store.dispatch(setAccessToken('test-patient'));
  await createPatient({
    title: 'Mr',
    firstName: 'Test',
    lastName: 'Patient',
    dob: '2000-01-01',
    age: '26',
    gender: 'Male',
    phone: '123',
    consentRequired: 'No',
    address: '',
    countryId: '101',
    stateId: '1',
    cityId: '3',
    typeReference: 'NONE',
    trusteeStaff: 'OTHER',
    contacts: [],
  });
  expect(requests[0].url).toBe('/api/v1/create_patient');
  expect(requests[0].headers.Authorization).toBe('Bearer test-patient');
  expect(requests[0].data).toBeInstanceOf(FormData);
});
