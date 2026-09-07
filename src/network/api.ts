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

export const apiUrl = "https://hims-api.zynotechnologies.com";

export const loginUser = async (data: {
  encryptedEmail: string;
  encryptedPassword: string;
}) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/auth/signin`,
      data,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("Login API Error:", error.response?.data || error.message);
    throw error;
  }
};