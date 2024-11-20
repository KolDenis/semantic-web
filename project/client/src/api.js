import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
});

export function getCities(name, page) {
    console.log(name)
    return axiosInstance.get(`/cities?name=${name}&page=${page}`);
}

export function getCityDetails(cityId) {
    return axiosInstance.get(`/city/${cityId}`);
}