import { Dosage, Medication, Provider } from "../interfaces"
import axios from "axios"

export const getDosages = (callback: (dosages: Dosage[]) => void, userId = 0) => {
    axios
        .get(`${import.meta.env.VITE_API_BASE_URL}dosage?userId=${userId}`)
        .then((response) => {
            callback(response.data.data)
        })
        .catch(() => {})
}

export const getMedications = (callback: (data: Medication[]) => void, userId = 0) => {
    axios
        .get(`${import.meta.env.VITE_API_BASE_URL}medication?userId=${userId}`)
        .then((response) => {
            callback(response.data.data)
        })
        .catch(() => {})
}

export const getProviders = (callback: (data: Provider[]) => void, userId = 0) => {
    axios
        .get(`${import.meta.env.VITE_API_BASE_URL}provider?userId=${userId}`)
        .then((response) => {
            callback(response.data.data)
        })
        .catch(() => {})
}
