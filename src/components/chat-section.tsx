"use client"

import { useChat } from "ai/react"
import { useMemo, useState } from "react"
import { insertDataIntoMessages } from "./transform"
import { ChatInput, ChatMessages } from "./ui/chat"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useAppDispatch } from "@/store/hooks"
import { setTransformedMessages } from "@/features/chatSlice"
import { sendChat } from "@/app/api/chat"
import { uploadFile } from "@/app/api/fileupload"

export default function ChatSection() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({})

  const { transformedMessages } = useSelector((state: RootState) => state.chat)
  const dispatch = useAppDispatch()

  const handleOnSubmit = async (formData: any) => {
    setFormData(formData)
    dispatch(
      setTransformedMessages([
        ...transformedMessages,
        formData.chat_data.messages[0],
      ])
    )
    setIsLoading(true)
    const res = await sendChat(formData)
    dispatch(
      setTransformedMessages([
        ...transformedMessages,
        formData.chat_data.messages[0],
        {
          role: "system",
          content: res,
        },
      ])
    )
    setIsLoading(false)
  }

  const reload = async () => {
    dispatch(setTransformedMessages(transformedMessages.slice(0, -1)))
    setIsLoading(true)
    const res = await sendChat(formData)
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
        onFileUpload={(file: File) => uploadFile([file])}
        isLoading={isLoading}
        multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-vision-preview"}
      />
    </div>
  )
}
