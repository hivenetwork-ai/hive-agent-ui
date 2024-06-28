import { useState } from "react"
import { Button } from "../button"
import FileUploader from "../file-uploader"
import UploadImagePreview from "../upload-image-preview"
import { ChatHandler } from "./chat.interface"
import { toast } from "react-toastify"
import { Textarea } from "../textarea"

export default function ChatInput(
  props: Pick<
    ChatHandler,
    "handleSubmit" | "multiModal" | "isLoading" | "onFileUpload" | "onFileError"
  > & {
    multiModal?: boolean
  }
) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [input, setInput] = useState<string>("")

  const onSubmit = () => {
    let formData: any = {}

    if (input === "") {
      toast.warn("Please type a message!")
      return
    }

    if (imageUrl) {
      formData.image = imageUrl
      setImageUrl(null)
    }

    const chatData: any = {
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    }

    formData.chat_data = chatData
    formData.user_id = "user123"
    formData.session_id = "session123"

    props.handleSubmit(formData)
    setInput("")
  }

  const onRemovePreviewImage = () => setImageUrl(null)

  const handleUploadImageFile = async (file: File) => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
    setImageUrl(base64)
  }

  const handleUploadFile = async (file: File) => {
    try {
      if (props.multiModal && file.type.startsWith("image/")) {
        return await handleUploadImageFile(file)
      }
      props.onFileUpload?.(file)
    } catch (error: any) {
      props.onFileError?.(error.message)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault()
      setInput((input) => input + "\n")
    }
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-xl space-y-4">
      {imageUrl && (
        <UploadImagePreview url={imageUrl} onRemove={onRemovePreviewImage} />
      )}
      <div className="flex w-full items-start justify-between gap-4 ">
        <Textarea
          autoFocus
          name="message"
          placeholder="Type a message"
          className="flex-1"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        {/* <FileUploader
          onFileUpload={handleUploadFile}
          onFileError={props.onFileError}
        /> */}
        <Button disabled={props.isLoading} onClick={onSubmit}>
          Send message
        </Button>
      </div>
    </div>
  )
}
