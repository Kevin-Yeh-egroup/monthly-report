"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"

export default function TestPage() {
  const [activeTab, setActiveTab] = useState("weekly")

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">測試頁面</h1>
        
        {/* 標籤切換 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <Button
              variant={activeTab === "weekly" ? "default" : "ghost"}
              onClick={() => {
                console.log("切換到週報詳情")
                setActiveTab("weekly")
              }}
              className={`flex items-center gap-2 ${
                activeTab === "weekly"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-gray-700 hover:text-black hover:bg-gray-200"
              }`}
            >
              <FileText className="h-4 w-4" />
              週報詳情
            </Button>
            <Button
              variant={activeTab === "monthly" ? "default" : "ghost"}
              onClick={() => {
                console.log("切換到月度摘要")
                setActiveTab("monthly")
              }}
              className={`flex items-center gap-2 ${
                activeTab === "monthly"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-gray-700 hover:text-black hover:bg-gray-200"
              }`}
            >
              <Calendar className="h-4 w-4" />
              月度摘要
            </Button>
          </div>
        </div>

        {/* 調試信息 */}
        <div className="text-center mb-4 text-sm text-gray-500">
          當前標籤: {activeTab}
        </div>

        {/* 內容區域 */}
        {activeTab === "weekly" && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-4">週報詳情內容</h2>
            <p className="text-gray-700">這是週報詳情的內容區域</p>
          </div>
        )}

        {activeTab === "monthly" && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-4">月度摘要內容</h2>
            <p className="text-gray-700">這是月度摘要的內容區域</p>
          </div>
        )}
      </div>
    </div>
  )
} 