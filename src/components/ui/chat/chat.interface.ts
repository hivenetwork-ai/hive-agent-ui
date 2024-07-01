import { Message } from "ai"

export interface ChatHandler {
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    ops?: {
      data?: any
    }
  ) => void
  messages: Message[]
  isLoading: boolean
  multiModal?: boolean
  reload?: () => void
  onFileUpload?: (file: File) => Promise<void>
  onFileError?: (errMsg: string) => void
}
