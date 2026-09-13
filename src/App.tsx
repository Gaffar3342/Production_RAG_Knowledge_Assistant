import { ChangeEvent, type ReactNode, useId, useMemo, useState } from "react";
import { useBackendStatus } from "@/hooks/useBackendStatus";
import { useChat } from "@/hooks/useChat";
import { useUpload } from "@/hooks/useUpload";
import type { SourceCitation } from "@/types/api";
import type { ChatMessage, UploadedDocument } from "@/types/chat";

type IconProps = { className?: string; strokeWidth?: number };
const makeIcon = (symbol: string) => ({ className = "" }: IconProps) => <span aria-hidden="true" className={"inline-flex shrink-0 items-center justify-center leading-none " + className}>{symbol}</span>;
const BookOpen = makeIcon("▱");
const ChevronDown = makeIcon("⌄");
const CircleHelp = makeIcon("?");
const FileText = makeIcon("▧");
const LibraryBig = makeIcon("▤");
const MessageSquareText = makeIcon("◌");
const MoreHorizontal = makeIcon("•••");
const PanelRightOpen = makeIcon("◫");
const Plus = makeIcon("+");
const Search = makeIcon("⌕");
const SendHorizontal = makeIcon("↑");
const Settings2 = makeIcon("⚙");
const Sparkles = makeIcon("✦");
const UserRound = makeIcon("●");

type WorkspaceDocument = UploadedDocument & { pages?: number; category?: string };

const sampleDocuments: WorkspaceDocument[] = [
  { id: "sample-handbook", filename: "Employee handbook.pdf", uploadedAt: new Date("2026-02-14"), pages: 42, category: "People" },
  { id: "sample-travel", filename: "Travel policy.pdf", uploadedAt: new Date("2026-02-12"), pages: 18, category: "Operations" },
  { id: "sample-product", filename: "Product guide.pdf", uploadedAt: new Date("2026-02-08"), pages: 27, category: "Product" },
];

const sampleSources: SourceCitation[] = [
  { document_id: "sample-handbook", filename: "Employee handbook.pdf", page_number: 12, chunk_id: "handbook-12", excerpt: "Employees receive 24 days of annual leave during each calendar year, in addition to public holidays.", relevance: 0.98 },
  { document_id: "sample-handbook", filename: "Employee handbook.pdf", page_number: 15, chunk_id: "handbook-15", excerpt: "Annual leave is requested through the HR portal and approved by the employee's manager.", relevance: 0.91 },
];

const sampleMessages: ChatMessage[] = [
  { id: "sample-question", role: "user", content: "How many days of annual leave are available?", createdAt: new Date() },
  { id: "sample-answer", role: "assistant", content: "Employees receive **24 days of annual leave** each calendar year, in addition to public holidays. Requests are made through the HR portal and approved by the employee's manager.", createdAt: new Date(), sources: sampleSources, confidence: 0.96 },
];

function statusLabel(status: ReturnType<typeof useBackendStatus>) {
  if (status === "online") return "System online";
  if (status === "checking") return "Checking system";
  return "Preview mode";
}

function App() {
  const inputId = useId();
  const backendStatus = useBackendStatus();
  const upload = useUpload();
  const chat = useChat(upload.documents.length > 0);
  const [selectedDocument, setSelectedDocument] = useState("sample-handbook");
  const [search, setSearch] = useState("");
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const isPreview = upload.documents.length === 0;
  const documents: WorkspaceDocument[] = isPreview ? sampleDocuments : upload.documents.map((document) => ({ ...document, category: "Uploaded" }));
  const messages = chat.messages.length ? chat.messages : sampleMessages;
  const activeAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const sources = activeAssistantMessage?.sources ?? sampleSources;
  const selected = documents.find((document) => document.id === selectedDocument) ?? documents[0];
  const visibleDocuments = useMemo(() => documents.filter((document) => document.filename.toLowerCase().includes(search.toLowerCase())), [documents, search]);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    upload.chooseFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] p-3 text-[#17213f] lg:p-4">
      <div className="knowledge-shell mx-auto flex min-h-[calc(100vh-24px)] max-w-[1680px] overflow-hidden rounded-[26px] border border-[#e7eaf2] bg-white shadow-[0_24px_80px_rgba(36,54,101,0.10)] lg:min-h-[calc(100vh-32px)]">
        <aside className="hidden w-[224px] shrink-0 flex-col border-r border-[#edf0f5] bg-[#fbfcfe] px-4 py-5 xl:flex">
          <div className="flex items-center gap-2.5 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#2764e7] text-white shadow-[0_7px_16px_rgba(39,100,231,0.25)]"><Sparkles className="h-[17px] w-[17px]" strokeWidth={2.4} /></div><span className="text-[17px] font-semibold tracking-[-0.03em]">KnowWell</span></div>
          <nav className="mt-10 space-y-1.5" aria-label="Workspace navigation"><NavItem icon={<LibraryBig />} label="Library" active /><NavItem icon={<MessageSquareText />} label="Conversations" /><NavItem icon={<BookOpen />} label="Guides" /></nav>
          <div className="mt-auto">
            <div className="rounded-2xl border border-[#e8edf8] bg-[#f7f9ff] p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-[#273b70]"><Sparkles className="h-3.5 w-3.5 text-[#2764e7]" />Grounded answers</div><p className="mt-1.5 text-[11px] leading-4 text-[#6f7891]">Every answer links back to your documents.</p></div>
            <div className="mt-4 flex items-center gap-2 px-2 text-sm text-[#66708a]"><Settings2 className="h-4 w-4" />Settings</div>
            <div className="mt-5 flex items-center gap-2.5 border-t border-[#edf0f5] px-2 pt-4"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#e8edff] text-[11px] font-bold text-[#4059b8]">GY</div><div className="min-w-0"><p className="truncate text-xs font-semibold">Gafar Yormaz</p><p className="text-[10px] text-[#8991a6]">Workspace owner</p></div><ChevronDown className="ml-auto h-3.5 w-3.5 text-[#98a0b5]" /></div>
          </div>
        </aside>

        <section className="flex w-[320px] shrink-0 flex-col border-r border-[#edf0f5] bg-white max-lg:hidden">
          <header className="flex items-center justify-between px-5 pb-4 pt-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#8791a8]">Workspace</p><h1 className="mt-1 text-[20px] font-semibold tracking-[-0.035em]">Document library</h1></div><label htmlFor={inputId} className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl bg-[#2764e7] text-white shadow-[0_8px_18px_rgba(39,100,231,0.22)] transition hover:-translate-y-0.5" title="Upload PDF"><Plus className="h-[18px] w-[18px]" /></label><input id={inputId} className="sr-only" type="file" accept="application/pdf,.pdf" onChange={chooseFile} /></header>
          <div className="px-5"><label className="flex items-center gap-2 rounded-xl border border-[#e8ecf4] bg-[#fafbfe] px-3 py-2.5 text-[#8b94a8] focus-within:border-[#aabcf1] focus-within:bg-white"><Search className="h-4 w-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-sm text-[#27304a] outline-none placeholder:text-[#a0a7b8]" placeholder="Search documents" /></label></div>
          {upload.selectedFile && <div className="mx-5 mt-4 rounded-xl border border-[#cdd9fb] bg-[#f4f7ff] p-3 text-xs text-[#4260b5]"><p className="truncate font-semibold">{upload.selectedFile.name}</p><button className="mt-2 rounded-lg bg-[#2764e7] px-2.5 py-1.5 font-semibold text-white disabled:opacity-50" onClick={upload.uploadSelectedFile} disabled={upload.isUploading}>{upload.isUploading ? "Indexing " + upload.progress + "%" : "Add to library"}</button></div>}
          <div className="mt-6 flex-1 overflow-y-auto px-3 pb-5">
            <div className="flex items-center justify-between px-2 pb-2"><span className="text-[11px] font-semibold text-[#8b94a8]">{isPreview ? "SAMPLE LIBRARY" : "YOUR DOCUMENTS"}</span><span className="grid h-5 min-w-5 place-items-center rounded-md bg-[#f1f3f8] px-1 text-[10px] font-semibold text-[#7c8598]">{visibleDocuments.length}</span></div>
            <div className="space-y-1">{visibleDocuments.map((document) => <button key={document.id} onClick={() => setSelectedDocument(document.id)} className={"group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition " + (selected?.id === document.id ? "bg-[#edf3ff]" : "hover:bg-[#f7f8fb]")}><div className={"mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg " + (selected?.id === document.id ? "bg-white text-[#2764e7]" : "bg-[#f2f4f8] text-[#68738d]")}><FileText className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-[#27304a]">{document.filename}</p><p className="mt-1 text-[11px] text-[#8991a6]">{document.pages ? String(document.pages) + " pages · " + document.category : "Added " + document.uploadedAt.toLocaleDateString()}</p></div><MoreHorizontal className="mt-1 h-4 w-4 shrink-0 text-[#aeb5c4] opacity-0 transition group-hover:opacity-100" /></button>)}</div>
          </div>
        </section>

        <main className="flex min-w-0 flex-1 flex-col bg-[#fdfdff]">
          <header className="flex h-[84px] items-center justify-between border-b border-[#edf0f5] px-5 sm:px-8"><div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf3ff] text-[#2764e7] xl:hidden"><Sparkles className="h-4 w-4" /></div><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-[15px] font-semibold text-[#202a46]">{selected?.filename ?? "Your knowledge base"}</p><ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9099ad]" /></div><p className="mt-0.5 text-[11px] text-[#8b94a8]">{isPreview ? "Sample workspace · Upload your own PDFs to begin" : "Grounded document assistant"}</p></div></div><div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-[#e4e9f2] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#66708a] sm:flex"><span className={"h-1.5 w-1.5 rounded-full " + (backendStatus === "online" ? "bg-[#3cb179]" : "bg-[#9aa4b9]")} />{statusLabel(backendStatus)}</span><button onClick={() => setSourcesOpen((current) => !current)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#e7ebf3] text-[#68738d] transition hover:bg-[#f5f7fb]" aria-label="Toggle sources"><PanelRightOpen className="h-4 w-4" /></button></div></header>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-7 sm:px-8 lg:px-10"><div className="mx-auto w-full max-w-[740px]"><div className="mb-8 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[#eef3ff] text-[#2764e7]"><Sparkles className="h-5 w-5" /></div><h2 className="mt-3 text-[22px] font-semibold tracking-[-0.04em] text-[#1d2743]">Ask about your documents</h2><p className="mt-1.5 text-[13px] text-[#7e879c]">Get clear answers with the source evidence beside them.</p></div><div className="space-y-7">{messages.map((message) => <ConversationMessage key={message.id} message={message} />)}</div></div></div>
          <div className="px-5 pb-5 sm:px-8 lg:px-10"><Composer canSend={upload.documents.length > 0} isSending={chat.isSending} onSend={chat.sendMessage} /><p className="mt-2 text-center text-[10px] text-[#a0a7b8]">KnowWell can make mistakes. Check the source evidence for important decisions.</p></div>
        </main>

        {sourcesOpen && <aside className="hidden w-[302px] shrink-0 border-l border-[#edf0f5] bg-[#fbfcfe] 2xl:flex 2xl:flex-col"><div className="flex items-center justify-between px-5 pb-4 pt-6"><div><p className="text-[15px] font-semibold text-[#27304a]">Sources</p><p className="mt-0.5 text-[11px] text-[#8b94a8]">Evidence used in this answer</p></div><span className="grid h-7 min-w-7 place-items-center rounded-lg bg-[#edf3ff] px-1 text-[11px] font-bold text-[#2764e7]">{sources.length}</span></div><div className="space-y-3 px-4">{sources.map((source) => <SourceCard key={source.chunk_id} source={source} />)}</div><div className="mt-auto mx-4 mb-5 rounded-2xl border border-[#e4eaf8] bg-white p-3.5"><div className="flex items-center gap-2 text-[11px] font-semibold text-[#526084]"><CircleHelp className="h-3.5 w-3.5 text-[#2764e7]" />How citations work</div><p className="mt-1.5 text-[11px] leading-4 text-[#7e879c]">The assistant searches your indexed PDFs and returns the most relevant passages.</p></div></aside>}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) {
  return <button className={"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition " + (active ? "bg-[#edf3ff] text-[#2764e7]" : "text-[#707a91] hover:bg-[#f2f5fa] hover:text-[#34415f]")}><span className="h-4 w-4">{icon}</span>{label}</button>;
}

function ConversationMessage({ message }: { message: ChatMessage }) {
  if (message.role === "user") return <div className="flex justify-end gap-2.5"><div className="max-w-[78%] rounded-[18px] rounded-br-md bg-[#2764e7] px-4 py-3 text-[13px] leading-5 text-white shadow-[0_8px_18px_rgba(39,100,231,0.18)]">{message.content}</div><div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8edff] text-[#526ac6]"><UserRound className="h-3.5 w-3.5" /></div></div>;
  return <div className="flex gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#edf3ff] text-[#2764e7]"><Sparkles className="h-4 w-4" /></div><div className="max-w-[90%] pt-0.5"><p className="mb-2 text-[11px] font-semibold text-[#526084]">KNOWWELL</p><p className="text-[14px] leading-6 text-[#303b59]">{message.content.replace(/\*\*/g, "")}</p>{message.sources?.length ? <div className="mt-3 flex flex-wrap gap-2">{message.sources.map((source) => <span key={source.chunk_id} className="inline-flex items-center gap-1 rounded-lg border border-[#dce5fb] bg-[#f4f7ff] px-2 py-1 text-[10px] font-semibold text-[#4966bd]"><FileText className="h-3 w-3" />{source.filename.replace(".pdf", "")} · p.{source.page_number}</span>)}</div> : null}</div></div>;
}

function SourceCard({ source }: { source: SourceCitation }) {
  return <article className="rounded-2xl border border-[#e8ecf4] bg-white p-3.5 shadow-[0_5px_15px_rgba(39,53,92,0.025)]"><div className="flex items-start gap-2"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#edf3ff] text-[#2764e7]"><FileText className="h-3.5 w-3.5" /></div><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-[#35415f]">{source.filename}</p><p className="mt-0.5 text-[10px] text-[#8b94a8]">Page {source.page_number} · {(source.relevance * 100).toFixed(0)}% relevant</p></div></div><p className="mt-3 text-[11px] leading-4 text-[#69738b]">“{source.excerpt}”</p><button className="mt-3 text-[10px] font-semibold text-[#2764e7]">Open source</button></article>;
}

function Composer({ canSend, isSending, onSend }: { canSend: boolean; isSending: boolean; onSend: (question: string) => void }) {
  const [value, setValue] = useState("");
  const send = () => { if (value.trim() && canSend && !isSending) { onSend(value); setValue(""); } };
  return <div className="mx-auto flex w-full max-w-[740px] items-end gap-3 rounded-2xl border border-[#e2e7f0] bg-white p-2.5 shadow-[0_10px_28px_rgba(37,52,92,0.06)] focus-within:border-[#acc0f6] focus-within:ring-4 focus-within:ring-[#edf3ff]"><button className="mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#7b859a] transition hover:bg-[#f3f5f9]" title="Upload a PDF"><Plus className="h-4 w-4" /></button><textarea value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} className="max-h-32 min-h-[34px] flex-1 resize-none bg-transparent py-1.5 text-[13px] leading-5 outline-none placeholder:text-[#a2a9b9]" placeholder={canSend ? "Ask a question about your documents..." : "Upload a PDF to start asking questions..."} /><button onClick={send} disabled={!value.trim() || !canSend || isSending} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#2764e7] text-white shadow-[0_5px_12px_rgba(39,100,231,0.25)] transition hover:bg-[#1f56ce] disabled:cursor-not-allowed disabled:bg-[#dfe5f1] disabled:text-[#98a2b6]"><SendHorizontal className="h-4 w-4" /></button></div>;
}

export default App;
