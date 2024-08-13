import { ChangeEvent, useState } from "react"
import { Button } from "../button"
import FileUploader from "../file-uploader"
import UploadImagePreview from "../upload-image-preview"
import { ChatHandler } from "./chat.interface"
import { toast } from "react-toastify"
import { Textarea } from "../textarea"

const DEFAULT_FILE_SIZE_LIMIT = 1024 * 1024 * 5
const allowedExtensions = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export default function ChatInput(
  props: Pick<ChatHandler, "handleSubmit" | "multiModal" | "isLoading"> & {
    multiModal?: boolean
  }
) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [input, setInput] = useState<string>("")

  const onSubmit = () => {
    let formData: any = {}

    if (input === "") {
      toast.warn("Please type a message!")
      return
    }

    if (selectedFiles.length > 0) {
      formData.files = selectedFiles
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
    setSelectedFiles([])
    setPreviewUrls([])
  }

  const onRemovePreviewImage = (index: number) => {
    const updatedFiles = [...selectedFiles]
    const updatedUrls = [...previewUrls]
    updatedFiles.splice(index, 1)
    updatedUrls.splice(index, 1)

    setSelectedFiles(updatedFiles)
    setPreviewUrls(updatedUrls)
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    // Filter out files
    const validImageTypes = allowedExtensions
    const validFiles = files.filter((file) => {
      validImageTypes.includes(file.type)
      if (!validImageTypes.includes(file.type)) {
        toast.warn(
          `${file.name} is not a valid image file and will be removed.`
        )
        return false
      }
      if (file.size > DEFAULT_FILE_SIZE_LIMIT) {
        toast.warn(
          `${file.name} exceeds the 5MB size limit and will be removed.`
        )
        return false
      }
      return true
    })

    setSelectedFiles((prevs) => [...prevs, ...validFiles])

    const urls = validFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prevs) => [...prevs, ...urls])
  }

  const fileConfig = {
    allowedExtensions,
  }

  return (
    <div className="flex flex-col rounded-xl bg-white p-4 shadow-xl">
      <div className="flex items-center gap-2 flex-wrap">
        {previewUrls.length > 0 &&
          previewUrls.map((url, index) => (
            <UploadImagePreview
              url={url}
              key={url}
              onRemove={() => onRemovePreviewImage(index)}
            />
          ))}
      </div>
      <div
        className={`flex w-full items-start justify-between gap-4 ${
          previewUrls.length > 0 && "mt-4"
        }`}
      >
        <Textarea
          autoFocus
          name="message"
          placeholder="Type a message"
          className="flex-1"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <FileUploader
          config={fileConfig}
          handleFileChange={handleFileChange}
          // onFileError={props.onFileError}
        />
        <Button disabled={props.isLoading} onClick={onSubmit}>
          Send message
        </Button>
      </div>
    </div>
  )
}
