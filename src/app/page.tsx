import Header from "@/components/header"
import ChatSection from "../components/chat-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient bg-[#d36a1f]">
      <Header />
      <ChatSection />
    </main>
  )
}
