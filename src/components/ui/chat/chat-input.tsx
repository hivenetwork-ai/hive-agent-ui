import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button } from "../button"
import FileUploader from "../file-uploader"
import UploadImagePreview from "../upload-image-preview"
import { ChatHandler } from "./chat.interface"
import { toast } from "react-toastify"
import { Textarea } from "../textarea"
import { useSharedRef } from "@/context/RefProvider"

const DEFAULT_FILE_SIZE_LIMIT = 1024 * 1024 * 5
const allowedExtensions = [
  "image/*",
  "application/pdf",
  ".doc",
  ".docx",
  ".xls",
  ".csv",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".rtf",
  ".epub",
  ".json",
  ".xml",
]

export default function ChatInput(
  props: Pick<ChatHandler, "handleSubmit" | "isLoading">
) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [input, setInput] = useState<string>("")

  const inputRef = useSharedRef()
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formData = new FormData()

    if (input === "") {
      toast.warn("Please type a message!")
      return
    }

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("file", file)
      })
    }

    const chatData: any = {
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    }

    formData.append("user_id", "user123")
    formData.append("session_id", "session123")
    formData.append("chat_data", JSON.stringify(chatData));

    props.handleSubmit(e, { data: formData });
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

  const handleButtonClick = () => {
    if (input.trim() === "") {
      toast.warn("Please type a message!");
      return;
    }

    formRef.current?.requestSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault()
      setInput((input) => input + "\n")
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("first")
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

  useEffect(() => {
    if (inputRef?.current) {
      const refElement = inputRef.current

      const updateStateFromRef = () => {
        setInput(refElement.value)
      }

      refElement.addEventListener("input", updateStateFromRef)

      return () => {
        refElement.removeEventListener("input", updateStateFromRef)
      }
    }
  }, [inputRef])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      const refElement = inputRef.current

      const syncStateWithRef = () => {
        setInput(refElement.value)
      }

      refElement.addEventListener("input", syncStateWithRef)

      return () => {
        refElement.removeEventListener("input", syncStateWithRef)
      }
    }
  }, [inputRef])

  return (
    <form className="flex flex-col rounded-xl bg-white p-2 md:p-4 shadow-xl" ref={formRef} onSubmit={onSubmit}>
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
        className={`flex flex-col md:flex-row w-full items-start justify-between gap-2 md:gap-4 ${
          previewUrls.length > 0 && "mt-1 md:mt-4"
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
          ref={inputRef}
        />
        <div className="flex items-center gap-2">
          <FileUploader
            config={fileConfig}
            handleFileChange={handleFileChange}
            // onFileError={props.onFileError}
          />
          <Button disabled={props.isLoading} onClick={handleButtonClick}>
            Send message
          </Button>
        </div>
      </div>
    </form>
  )
}
