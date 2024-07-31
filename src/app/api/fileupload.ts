import { API_URL } from "@/config/constants"
import axios from "axios"

export const uploadFile = async (files: File[]) => {
  const formData = new FormData()
  const agentId = "demo123"
  files.map((file) => formData.append("files", file))

  try {
    const response = await axios.post(
      `${API_URL}/api/v1/uploadfiles`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    console.log("Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error uploading files:", error)
    throw Error("File upload failed")
  }
}
