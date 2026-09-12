// import axios from "axios";

// export const apiUrl = "https://hims-api.zynotechnologies.com"

// export const loginUser = async (data : any) => {
//     try {
//         const response = await axios({
//             method: "post",
//             url: `${apiUrl}/api/auth/signin`,
//             data: data,
//             headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json"
//             }
//         })
//         // if(response.data.status == true) {

//         // }
//         return response;
//     } catch (error) {
//         console.log(error);
        
//     }
// }

import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const apiUrl = "https://hims-api.zynotechnologies.com";

// export const loginUser = async (data: {
//   encryptedEmail: string;
//   encryptedPassword: string;
// }) => {
//   try {
//     const response = await axios.post(
//       `${apiUrl}/api/auth/signin`,
//       data,
//       {
//         headers: {
//           Accept: "application/json, text/plain, */*",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     console.log("Login API Error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export const loginUser = async (data: {
//   encryptedEmail: string;
//   encryptedPassword: string;
// }) => {
//   try {
//     console.log("before Hit");
    
//     const response = await axios.post(
//       `${apiUrl}/api/auth/signin`,
//       data,
//       {
//         headers: {
//           Accept: 'application/json, text/plain, */*',
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     console.log("login response->",response);
    
//     // Save access token after successful login
//     const accessToken = response.data?.accessToken;
//     console.log("accessToken",accessToken);
    
//     if (accessToken) {
//       await AsyncStorage.setItem('accessToken', accessToken);
//       console.log('Access token saved successfully');
//     }

//     return response.data;
//   } catch (error: any) {
//     console.log(
//       'Login API Error:',
//       error?.response?.data || error?.message,
//     );

//     throw error;
//   }
// };

export const loginUser = async (data: {
  encryptedEmail: string;
  encryptedPassword: string;
}) => {
  try {
    console.log('before Hit');

    const response = await axios.post(
      `${apiUrl}/api/auth/signin`,
      data,
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('accessToken', response.data?.accessToken);

    return response.data;
  } catch (error: any) {
    console.log(
      'Login API Error:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
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
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("dob", data.dob);
    formData.append("age", data.age);
    formData.append("gender", data.gender);
    formData.append("phone", data.phone);
    formData.append("consentRequired", data.consentRequired);
    formData.append("address", data.address);
    formData.append("countryId", data.countryId);
    formData.append("stateId", data.stateId);
    formData.append("cityId", data.cityId);
    formData.append("typeReference", data.typeReference);
    formData.append("trusteeStaff", data.trusteeStaff);

    formData.append("contacts", JSON.stringify(data.contacts));

    const response = await axios.post(
      `${apiUrl}/api/v1/create_patient`,
      formData,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer YOUR_TOKEN`,
          "Content-Type": "multipart/form-data",
          "x-entity-id": "1",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log(
      "Create Patient API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// export const getAllActiveCountry = async (token: string) => {
//   try {
//     const response = await axios.get(
//       `${apiUrl}/api/v1/getAllActivecountry`,
//       {
//         headers: {
//           Accept: 'application/json, text/plain, */*',
//           Authorization: `Bearer ${token}`,
//           'x-entity-id': '1',
//         },
//       },
//     );

//     return response.data;
//   } catch (error: any) {
//     console.log(
//       'Get Country API Error:',
//       error?.response?.data || error?.message,
//     );

//     throw error;
//   }
// };

export const getAllActiveCountry = async (token: string) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/getAllActivecountry`,
      {
        params: {
          page_url: '/master/opd-management/patients/registration',
          page_name: 'registration',
        },
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${token}`,
          'x-entity-id': '1',
        },
      },
    );

    console.log('Country API Response:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      'Get Country API Error:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};

export const getStatesByCountryId = async (
  countryId: string | number,
  accessToken: string,
) => {
  const response = await axios.get(
    `${apiUrl}/api/WL/getstatesbycountryid/${countryId}`,
    {
      params: {
        page_url: '/master/opd-management/patients/registration',
        page_name: 'registration',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};