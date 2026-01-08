"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send, Bot, User, ShieldCheck,
    ChevronDown, Bell, Search,
    Menu, X, ExternalLink,
    ChevronRight, Home, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { fetchChatResponse } from "@/lib/api";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
    role: "user" | "assistant";
    content: string;
};

// Hardcoded policy content for the viewer since we don't have a content endpoint yet
const POLICY_MARKDOWN = `# Rutgers University Travel & Expense Policy

Official regulations and guidelines for university-related travel and business expenses.

## 1. Business Mileage
The university reimburses for authorized business use of a personal vehicle. 
- **Current Rate (2024)**: $0.67 per mile.
- **Documentation**: Odometer readings or map-based mileage calculations (e.g., Google Maps) are required.
- **Reference**: UFA Mileage Guidelines Section 4.2.

## 2. Meal Per Diem
Rutgers utilizes the GSA (General Services Administration) per diem rates for all meal reimbursements. 
- **Policy**: Specific receipts are not required for per diem claims.
- **Proviso**: Reimbursement is not permitted for meals provided by a conference, hotel, or third party.

## 3. Airfare & Transportation
All business-related flights must be booked through the **Rutgers Travel Online Booking Tool** (Direct Travel). 
- **Class of Service**: Coach/Economy class is the mandatory standard. Business or First class requires prior written exception from the Chancellor.

## 4. Formal Approvals
All travel must be approved by the traveler's supervisor or a designated "Approver" within the **Oracle Cloud** expense system.
- **Pre-Approval**: Required for all international travel.

## 5. Submission Requirements & Deadlines
- **Primary Deadline**: Expense reports must be submitted within **30 days** of the completion of travel.
- **Extended Review**: Reports submitted after 60 days are subject to additional compliance verification.
`;

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Welcome to the **Rutgers UFA Spearfishing Agent**. \n\nI am here to assist you with the **Travel & Expense Policy**. You can ask me about mileage rates, per diem, or airfare regulations currently in effect for 2024." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current && messages.length > 1) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userQuery = input.trim();
        setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
        setInput("");
        setIsLoading(true);

        try {
            const answer = await fetchChatResponse(userQuery);
            setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "**Error**: I could not retrieve the policy data at this time. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans flex flex-col">

            {/* 1. TOP UTILITY BAR (White) */}
            <header className="bg-white border-b border-gray-200 px-4 md:px-12 py-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    {/* Mock Rutgers "R" Logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-[#CC0033] text-white font-black text-3xl px-3 py-1 rounded-sm leading-none">
                            R
                        </div>
                        <div className="h-10 w-[1px] bg-gray-300 mx-1 hidden sm:block" />
                        <div className="flex flex-col justify-center">
                            <span className="text-xl font-bold tracking-tight text-gray-800 leading-none">RUTGERS</span>
                            <span className="text-lg font-normal text-gray-500 leading-tight">University Finance & Administration</span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-600 font-semibold gap-2">
                        <Bell className="w-4 h-4" />
                        Alerts <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">0</span>
                    </Button>
                    <div className="relative group">
                        <Button variant="outline" size="sm" className="rounded-full border-gray-300 text-gray-600 pl-4 pr-10 hover:border-[#CC0033]">
                            Search
                        </Button>
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-[#CC0033] transition-colors" />
                    </div>
                </div>
            </header>

            {/* 2. SCARLET NAVIGATION BAR - Commented out per user preference */}
            <nav className="bg-[#CC0033] text-white px-4 md:px-12 z-40 shadow-md">
                {/* <div className="flex items-center space-x-0 overflow-x-auto no-scrollbar">
          {[
            "Locations", "Services", "Get Help", "About", "I want to...", "Log in to...", "UFA Community"
          ].map((item) => (
            <button 
              key={item}
              className="px-5 py-4 text-sm font-bold whitespace-nowrap hover:bg-black/10 flex items-center gap-1 transition-colors border-b-4 border-transparent hover:border-white/30"
            >
              {item} <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
          ))}
          <button className="px-5 py-4 text-sm font-bold bg-black/20 flex items-center gap-2 ml-auto">
            Contact Support <ExternalLink className="w-3 h-3" />
          </button>
        </div> */}
            </nav>

            {/* 3. BREADCRUMBS & PAGE HEADER (Centered) */}
            <main className="bg-[#F5F5F5] flex-1 flex flex-col">
                <div className="max-w-7xl mx-auto w-full px-4 md:px-12 pt-16 pb-12 text-center">

                    {/* Breadcrumbs */}
                    <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#222222] mb-8 opacity-60">
                        <span>RUTGERS UFA</span>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <span>FINANCIAL POLICIES</span>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <span className="text-[#CC0033]">SPEARFISHING AGENT</span>
                    </div>

                    <h1 className="text-6xl font-black text-[#222222] tracking-tighter mb-4">
                        Spearfishing Agent
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Institutional AI assistance for Rutgers University Finance and Administration.
                        Precise policy guidance for travel, expense reports, and academic workflows.
                    </p>
                </div>

                {/* 4. CONTENT AREA (CHAT) */}
                <div className="max-w-7xl mx-auto w-full px-4 md:px-12 flex-1 flex flex-col pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">

                        {/* Sidebar / Checklist Area */}
                        <div className="hidden lg:block lg:col-span-3 space-y-8">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-[#CC0033]/20">
                                    Quick Links
                                </h3>
                                <ul className="space-y-3 text-sm font-semibold text-[#CC0033]">
                                    <li className="group">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <button className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer text-left w-full">
                                                    <FileText className="w-4 h-4" /> View Travel Policy
                                                </button>
                                            </SheetTrigger>
                                            <SheetContent className="sm:max-w-2xl overflow-y-auto p-0 border-l-[#CC0033]/20 shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
                                                <div className="px-10 py-12">
                                                    <SheetHeader className="mb-10 text-left">
                                                        <SheetTitle className="text-3xl font-black text-[#CC0033] uppercase tracking-tighter leading-none">
                                                            Travel & Expense Policy
                                                        </SheetTitle>
                                                        <SheetDescription className="font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px] mt-2">
                                                            Official University Regulations
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <div className="prose prose-neutral max-w-none border-t border-gray-100 pt-10
                                                        [&_h1]:!text-[#CC0033] [&_h2]:!text-[#CC0033] [&_h3]:!text-[#CC0033]
                                                        [&_h1]:font-black [&_h2]:font-black [&_h3]:font-black
                                                        [&_h1]:uppercase [&_h2]:uppercase [&_h3]:uppercase
                                                        [&_h1]:tracking-tighter [&_h2]:tracking-tight
                                                        prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                                                        prose-strong:text-[#CC0033] prose-strong:font-bold
                                                        prose-li:marker:text-[#CC0033]
                                                        prose-p:text-gray-600 prose-p:leading-relaxed">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {POLICY_MARKDOWN}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                    </li>
                                    <li className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer">
                                        <ChevronRight className="w-3 h-3 text-gray-400" /> GSA Per Diem Rates
                                    </li>
                                    <li className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer">
                                        <ChevronRight className="w-3 h-3 text-gray-400" /> Direct Travel Tool
                                    </li>
                                    <li className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer">
                                        <ChevronRight className="w-3 h-3 text-gray-400" /> Expense Report FAQ
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Main Chat Container */}
                        <Card className="lg:col-span-9 flex flex-col border-none shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden bg-white min-h-[600px]">

                            {/* Chat Content */}
                            <CardContent className="flex-1 flex flex-col p-0 bg-white relative">
                                <ScrollArea className="flex-1 px-8 pt-8 pb-4 h-[50vh] lg:h-auto">
                                    <div className="flex flex-col gap-10 pb-6 max-w-3xl mx-auto">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "flex gap-5 items-start",
                                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0",
                                                    msg.role === "user"
                                                        ? "bg-[#222222] text-white"
                                                        : "bg-gray-100 text-[#CC0033]"
                                                )}>
                                                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                                </div>

                                                <div className={cn(
                                                    "p-6 rounded-2xl border transition-all",
                                                    msg.role === "user"
                                                        ? "bg-[#CC0033] text-white border-[#CC0033] shadow-md"
                                                        : "bg-[#F9F9F9] border-gray-200 text-gray-800 shadow-sm"
                                                )}>
                                                    <div className={cn(
                                                        "prose prose-sm max-w-none break-words leading-relaxed",
                                                        msg.role === "user" ? "prose-invert" : "prose-neutral"
                                                    )}>
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex gap-5 items-start animate-pulse">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#CC0033]/30">
                                                    <Bot className="w-5 h-5" />
                                                </div>
                                                <div className="bg-[#F9F9F9] border-gray-200 p-8 rounded-2xl w-48 shadow-sm" />
                                            </div>
                                        )}
                                        <div ref={scrollRef} className="h-4" />
                                    </div>
                                </ScrollArea>

                                {/* Input Area */}
                                <div className="p-8 bg-white border-t border-gray-100">
                                    <form onSubmit={handleSubmit} className="flex gap-4 max-w-3xl mx-auto items-center">
                                        <div className="flex-1 relative group">
                                            <Input
                                                placeholder="Inquire about Rutgers policy..."
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                className="w-full bg-white border-2 border-gray-200 focus-visible:ring-[#CC0033]/10 focus-visible:border-[#CC0033] text-base py-7 px-6 rounded-xl shadow-inner transition-all"
                                            />
                                            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none group-focus-within:text-[#CC0033] transition-colors" />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="h-14 px-8 rounded-xl bg-[#CC0033] hover:bg-[#A50029] text-white font-bold shadow-lg shadow-[#CC0033]/10 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <Send className="w-5 h-5 mr-3" />
                                            Send
                                        </Button>
                                    </form>
                                    <div className="max-w-3xl mx-auto flex items-center justify-between mt-6 px-1 opacity-40">
                                        <div className="flex gap-5 text-[10px] font-black uppercase tracking-widest text-[#222222]">
                                            <span>Enterprise Security Ready</span>
                                            <span>•</span>
                                            <span>GDPR/FERPA Verified</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-[#222222]">
                                            UFA DIGITAL PORTAL v2.4
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* 5. FOOTER (Simplified per user request) */}
            <footer className="bg-[#222222] text-white px-4 md:px-12 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-xl font-black italic tracking-tighter">RUTGERS</h4>
                        <p className="text-xs text-gray-400 font-medium">
                            University Finance & Administration<br />
                            New Brunswick, NJ 08901
                        </p>
                    </div>
                    <div className="space-y-2 col-span-3">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Institutional Disclaimer</h5>
                        <p className="text-[11px] text-gray-500 leading-relaxed max-w-2xl">
                            The Spearfishing AI Agent is an experimental tool built by me, Kinshuk Goel.
                            This is a simulation for how the actual tool could look like.
                            Always verify critical policy decisions against the official Rutgers Policy Library.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
