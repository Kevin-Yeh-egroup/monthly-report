"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"

export default function DebugButtons() {
  const [selectedWeek, setSelectedWeek] = useState<string>("7/21-7/27")
  const [activeTab, setActiveTab] = useState<string>("weekly")

  const weeks = ["7/7-7/13", "7/14-7/20", "7/21-7/27"]

  const handleWeekClick = (week: string) => {
    console.log("週次按鈕點擊:", week)
    setSelectedWeek(week)
  }

  const handleTabClick = (tab: string) => {
    console.log("標籤按鈕點擊:", tab)
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-black mb-8 text-center">按鈕測試頁面</h1>
        
        {/* 當前狀態顯示 */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">當前狀態：</p>
          <p className="font-semibold">選中的週次：{selectedWeek}</p>
          <p className="font-semibold">當前標籤：{activeTab}</p>
        </div>

        {/* 週次選擇按鈕 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">週次選擇按鈕</h2>
          <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-2 border border-gray-200">
            {weeks.map((week) => (
              <Button
                key={week}
                size="sm"
                variant={selectedWeek === week ? "default" : "ghost"}
                onClick={() => handleWeekClick(week)}
                className={`${
                  selectedWeek === week
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-700 hover:text-black hover:bg-gray-200"
                }`}
              >
                {week}
              </Button>
            ))}
          </div>
        </div>

        {/* 標籤切換按鈕 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">標籤切換按鈕</h2>
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <Button
              variant={activeTab === "weekly" ? "default" : "ghost"}
              onClick={() => handleTabClick("weekly")}
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
              onClick={() => handleTabClick("monthly")}
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

        {/* 內容顯示 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2">當前顯示內容：</h3>
          {activeTab === "weekly" ? (
            <p>顯示週報詳情 - {selectedWeek}</p>
          ) : (
            <p>顯示月度摘要</p>
          )}
        </div>

        {/* 測試按鈕 */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">測試按鈕</h2>
          <div className="flex gap-4">
            <Button 
              onClick={() => console.log("測試按鈕1點擊")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              測試按鈕1
            </Button>
            <Button 
              onClick={() => console.log("測試按鈕2點擊")}
              className="bg-green-600 hover:bg-green-700"
            >
              測試按鈕2
            </Button>
            <Button 
              onClick={() => alert("測試按鈕3點擊成功！")}
              className="bg-red-600 hover:bg-red-700"
            >
              測試按鈕3 (Alert)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 