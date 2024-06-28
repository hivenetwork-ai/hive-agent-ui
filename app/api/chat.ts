import { AGENT_CHAT_API_URL } from "@/config/constants"
import axios from "axios"

export const sendChat = async (formData: FormData) => {
  try {
    const response = await axios.post(`${AGENT_CHAT_API_URL}`, formData)

    if (response.status !== 200) {
      throw Error("Error sending chat")
    }

    return response.data
  } catch (error) {
    console.error("Error sending chat:", error)
    throw Error("Error sending chat")
  }
}
