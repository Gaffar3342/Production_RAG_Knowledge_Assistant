import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useBackendStatus } from "@/hooks/useBackendStatus";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { useUpload } from "@/hooks/useUpload";

function App() {
  const { theme, toggleTheme } = useTheme();
  const backendStatus = useBackendStatus();
  const chat = useChat();
  const upload = useUpload();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader backendStatus={backendStatus} theme={theme} onToggleTheme={toggleTheme} />
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[390px_minmax(0,1fr)]">
        <div className="hidden min-h-0 lg:block">
          <Sidebar
            documents={upload.documents}
            selectedFile={upload.selectedFile}
            progress={upload.progress}
            isUploading={upload.isUploading}
            onChooseFile={upload.chooseFile}
            onUpload={upload.uploadSelectedFile}
          />
        </div>
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] lg:block">
          <div className="border-b bg-card/60 p-4 lg:hidden">
            <Sidebar
              documents={upload.documents}
              selectedFile={upload.selectedFile}
              progress={upload.progress}
              isUploading={upload.isUploading}
              onChooseFile={upload.chooseFile}
              onUpload={upload.uploadSelectedFile}
            />
          </div>
          <ChatPanel
            messages={chat.messages}
            hasMessages={chat.hasMessages}
            isSending={chat.isSending}
            onSend={chat.sendMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
