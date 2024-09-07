import axios from "axios";

const baseURL = '/api/transcriptions';

export const getTranscriptions = async () => {
    const response = await axios.get(baseURL)
    return response.data
}