"use client"

import { useState } from "react"
import { ChatInput, ChatMessages } from "./ui/chat"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useAppDispatch } from "@/store/hooks"
import { setTransformedMessages } from "@/features/chatSlice"
import { sendChatAPI, sendChatMediaAPI } from "@/apis/chat"
import { toast } from "react-toastify"

export default function ChatSection() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({})

  const { transformedMessages } = useSelector((state: RootState) => state.chat)
  const dispatch = useAppDispatch()

  const handleOnSubmit = async (data: any) => {
    try {
      setFormData(data)
      dispatch(
        setTransformedMessages([
          ...transformedMessages,
          data.chat_data.messages[0],
        ])
      )
      setIsLoading(true)
      if (data.files?.length > 0) {
        const formData = new FormData()
        formData.append("user_id", data.user_id)
        formData.append("session_id", data.session_id)
        formData.append("chat_data", JSON.stringify(data.chat_data))
        data.files.forEach((file: any) => {
          formData.append("files", file)
        })

        await sendChatMediaAPI(formData)
      }
      const media_references: any[] = []
      data.files?.forEach((file: any) => {
        media_references.push({
          type: "file_name",
          value: file.name,
        })
      })
      const formData: any = {
        user_id: data.user_id,
        session_id: data.session_id,
        chat_data: data.chat_data,
        media_references,
      }
      const resChat = await sendChatAPI(formData)
      dispatch(
        setTransformedMessages([
          ...transformedMessages,
          formData.chat_data.messages[0],
          {
            role: "system",
            content: resChat,
          },
        ])
      )
    } catch (error) {
      console.log(error)
      toast.warn("Error occured while sending chat.")
    } finally {
      setIsLoading(false)
    }
  }

  const reload = async () => {
    dispatch(setTransformedMessages(transformedMessages.slice(0, -1)))
    setIsLoading(true)
    const res = await sendChatAPI(formData)
    dispatch(
      setTransformedMessages([
        ...transformedMessages.slice(0, -1),
        {
          role: "system",
          content: res,
        },
      ])
    )
    setIsLoading(false)
  }

  return (
    <div className="space-y-4 max-w-5xl w-full">
      <ChatMessages
        messages={transformedMessages}
        isLoading={isLoading}
        reload={reload}
      />
      <ChatInput
        handleSubmit={handleOnSubmit}
        // onFileUpload={(file: File) => uploadFile([file])}
        isLoading={isLoading}
        multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-vision-preview"}
      />
    </div>
  )
}
