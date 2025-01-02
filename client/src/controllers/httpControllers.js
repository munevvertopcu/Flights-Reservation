import axios from "axios";

var httpClient = axios.create({
    baseURL: "http://localhost:5000"
});

export const Post = (url, data) => {
    return httpClient.post(url, data)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            if (error.response) {
                // The server responded but returned an error code
                console.error('Error code:', error.response.status);
                console.error('Error data:', error.response.data);
            } else if (error.request) {
                // No response was received from the server
                console.error('No response from server:', error.request);
            } else {
                // There was a problem with the request configuration
                console.error('There was a problem:', error.message);
            }
        })
}

export const Get = (url) => {
    return httpClient.get(url)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            if (error.response) {
                console.error('Error code:', error.response.status);
                console.error('Error data:', error.response.data);
            } else if (error.request) {
                console.error('No response from server:', error.request);
            } else {
                console.error('There was a problem:', error.message);
            }
        })
}