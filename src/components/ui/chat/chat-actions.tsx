import { PauseCircle, RefreshCw } from "lucide-react"

import { Button } from "../button"
import { ChatHandler } from "./chat.interface"

export default function ChatActions(
  props: Pick<ChatHandler, "reload"> & {
    showReload?: boolean
    showStop?: boolean
  }
) {
  return (
    <div className="space-x-4">
      {props.showReload && (
        <Button variant="outline" size="sm" onClick={props.reload}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
      )}
    </div>
  )
}
