"use client"

import { useRef, useState } from "react"
import { ChatInput, ChatMessages } from "./ui/chat"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useAppDispatch } from "@/store/hooks"
import { setTransformedMessages } from "@/features/chatSlice"
import { sendChatAPI } from "@/apis/chat"
import { toast } from "react-toastify"
import { uploadFileAPI } from "@/apis/fileupload"
import { useSharedRef } from "@/context/RefProvider"
import { Message } from "ai"

export default function ChatSection() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({})

  const { transformedMessages } = useSelector((state: RootState) => state.chat)
  const dispatch = useAppDispatch()

  const inputRef = useSharedRef()

  const handleOnSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    ops?: {
      data?: FormData;
    }
  ) => {
    try {
      e.preventDefault();

      if (!ops?.data) return

      // Convert FormData to a standard object
      const formDataObj: any = {};
      ops.data.forEach((value, key) => {
        if (key === "chat_data") {
          formDataObj[key] = JSON.parse(value as string);
        } else {
          formDataObj[key] = value;
        }
      });

      setFormData(formDataObj)
      dispatch(
        setTransformedMessages([
          ...transformedMessages,
          formDataObj.chat_data.messages[0],
        ])
      )

      setIsLoading(true)
      const resChat = await sendChatAPI(ops.data)
      dispatch(
        setTransformedMessages([
          ...transformedMessages,
          formDataObj.chat_data.messages[0],
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

  const stop = async () => {}

  const append = async (
    message: Message | Omit<Message, "id">,
    ops?: { data: any }
  ): Promise<string | null | undefined> => {
    try {
      if (!message || !ops) {
        return Promise.resolve(undefined)
      }

      // const response = await sendChatAPI(message, ops)
      // const response = await sendChatAPI(message)

      // return response
    } catch (error) {
      console.error("Error in append function:", error)
      return Promise.resolve(null)
    }
  }

  const handleClickSuggestedQuestion = (question: string) => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = question
      inputRef.current.dispatchEvent(new Event("input"))
    }
  }

  return (
    <div className="space-y-2 md:space-y-4 max-w-5xl w-full flex-grow">
      {!transformedMessages.length ? (
        <div className="w-full rounded-xl bg-white p-2 md:p-4 shadow-xl pb-0">
          <div className="flex h-[50vh] flex-col items-center justify-center overflow-y-auto ">
            <div className="flex flex-col gap-2 md:gap-4">
              <span className="text-lg font-semibold">
                Suggested questions:
              </span>
              <div className="flex flex-col gap-2 md:gap-4">
                <p
                  className="w-fit hover:underline cursor-pointer"
                  onClick={() =>
                    handleClickSuggestedQuestion("What can you help me with?")
                  }
                >
                  • What can you help me with?
                </p>
                <p
                  className="w-fit hover:underline cursor-pointer"
                  onClick={() =>
                    handleClickSuggestedQuestion(
                      "What tools do you have access to?"
                    )
                  }
                >
                  • What tools do you have access to?
                </p>
                <p
                  className="w-fit hover:underline cursor-pointer"
                  onClick={() =>
                    handleClickSuggestedQuestion(
                      "What’s an example of your capabilities?"
                    )
                  }
                >
                  • What’s an example of your capabilities?
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ChatMessages
          messages={transformedMessages}
          isLoading={isLoading}
          reload={reload}
          stop={stop}
          append={append}
        />
      )}

      <ChatInput
        handleSubmit={handleOnSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
