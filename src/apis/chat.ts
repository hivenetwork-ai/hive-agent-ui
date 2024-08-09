import { API_URL } from "@/config/constants"
import axios from "axios"

export const sendChatAPI = async (formData: any) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/chat`, formData)

    if (response.status !== 200) {
      throw Error("Error sending chat")
    }

    return response.data
  } catch (error) {
    console.error("Error sending chat:", error)
    throw Error("Error sending chat")
  }
}

export const sendChatMediaAPI = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/chat_media`, formData)

    if (response.status !== 200) {
      throw Error("Error sending chat media")
    }

    return response.data
  } catch (error) {
    console.error("Error sending chat media", error)
    throw Error("Error sending chat media")
  }
}