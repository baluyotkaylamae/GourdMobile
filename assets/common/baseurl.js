// import { Platform } from 'react-native'
// let baseURL = 'https://3cbc-2405-8d40-404e-3484-4049-f11f-fe45-6bff.ngrok-free.app'
// {Platform.OS == 'android'
// ? baseURL = 'http://192.168.176.204:8081/api/v1/'
// : baseURL = 'http://192.168.43.45:8081/api/v1/'
// }
// export default baseURL;

import { Platform } from 'react-native';

let baseURL = '';

if (Platform.OS === 'android') {
    baseURL = 'http://192.168.1.9:4000/api/v1/';
} else {
    baseURL = 'https://backend-nryq.onrender.com/api/v1/';
}

export default baseURL;