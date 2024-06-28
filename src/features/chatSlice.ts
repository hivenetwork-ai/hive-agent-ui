import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface ChatState {
  transformedMessages: any[]
}

const initialState: ChatState = {
  transformedMessages: [],
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setTransformedMessages: (state, action: PayloadAction<any[]>) => {
      state.transformedMessages = action.payload
    },
  },
})

export const { setTransformedMessages } = chatSlice.actions

export default chatSlice.reducer
