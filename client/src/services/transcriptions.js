import axios from "axios";

const baseURL = '/api/transcriptions';

export const getTranscriptions = async () => {
    const response = await axios.get(baseURL)
    return response.data
}

export const createTranscription = async (transcriptionData) => {
    const response = await axios.post(baseURL, transcriptionData)
    return response.data
}