import axiosInstance from './axiosInstance';
export { apiUrl } from './axiosInstance';
const registrationParams = {
  page_url: '/master/opd-management/patients/registration',
  page_name: 'registration',
};
export const loginUser = async (data: {
  encryptedEmail: string;
  encryptedPassword: string;
}) => {
  const response = await axiosInstance.post('/api/auth/signin', data);
  return response.data;
};
export const createPatient = async (data: {
  title: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  gender: string;
  phone: string;
  consentRequired: string;
  address: string;
  countryId: string;
  stateId: string;
  cityId: string;
  typeReference: string;
  trusteeStaff: string;
  contacts: {
    phone: string;
    email: string;
    is_primary: boolean;
  }[];
}) => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('dob', data.dob);
  formData.append('age', data.age);
  formData.append('gender', data.gender);
  formData.append('phone', data.phone);
  formData.append('consentRequired', data.consentRequired);
  formData.append('address', data.address);
  formData.append('countryId', data.countryId);
  formData.append('stateId', data.stateId);
  formData.append('cityId', data.cityId);
  formData.append('typeReference', data.typeReference);
  formData.append('trusteeStaff', data.trusteeStaff);

  formData.append('contacts', JSON.stringify(data.contacts));

  const response = await axiosInstance.post(
    '/api/v1/create_patient',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return response.data;
};
export const getAllActiveCountry = async (signal?: AbortSignal) => {
  const response = await axiosInstance.get('/api/v1/getAllActivecountry', {
    params: registrationParams,
    signal,
  });
  return response.data;
};
export const getCitiesByStateId = async (
  stateId: string | number,
  signal?: AbortSignal,
) => {
  const response = await axiosInstance.get(
    '/api/WL/getcitybystateid/' + encodeURIComponent(stateId),
    { params: registrationParams, signal },
  );
  return response.data;
};
export const getStatesByCountryId = async (
  countryId: string | number,
  signal?: AbortSignal,
) => {
  const response = await axiosInstance.get(
    '/api/WL/getstatesbycountryid/' + encodeURIComponent(countryId),
    { params: registrationParams, signal },
  );
  return response.data;
};
