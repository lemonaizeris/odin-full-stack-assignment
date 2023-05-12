import axios from 'axios';
import configData from "../config.json";


export const GetSARImageNauvo = () => axios.get(`${configData.SERVER_URL}:${configData.SERVER_PORT}/SAR_image`);
export const GetSARImageNauvoCoordinates = () => axios.get(`${configData.SERVER_URL}:${configData.SERVER_PORT}/SAR_image_coordinates`);