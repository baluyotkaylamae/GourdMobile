import { io } from 'socket.io-client'
import baseURL from '../assets/common/baseurl';

const config = {
    autoConnect: false,
};

export const socket = io('http://192.168.100.220:4000', { 
    autoConnect: false,
    reconnection: true, // enables auto reconnection
    reconnectionAttempts: 10, // maximum attempts
    reconnectionDelay: 500, // initial delay in ms between attempts
    reconnectionDelayMax: 2000, // max delay in ms between reconnection attempts
    timeout: 5000, // connection timeout before failing
});