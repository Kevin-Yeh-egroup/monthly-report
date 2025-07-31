"use client"

import { useState } from "react"

export default function SimpleTest() {
  const [activeTab, setActiveTab] = useState("weekly")

  const handleTabClick = (tab: string) => {
    console.log("按鈕點擊:", tab)
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-black mb-8 text-center">簡單按鈕測試</h1>
        
        {/* 當前狀態 */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">當前標籤：{activeTab}</p>
        </div>

        {/* 簡單按鈕 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">原生按鈕測試</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => handleTabClick("weekly")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              週報詳情
            </button>
            <button 
              onClick={() => handleTabClick("monthly")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              月度摘要
            </button>
          </div>
        </div>

        {/* 內容顯示 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2">顯示內容：</h3>
          {activeTab === "weekly" ? (
            <p>這是週報詳情內容</p>
          ) : (
            <p>這是月度摘要內容</p>
          )}
        </div>

        {/* 測試按鈕 */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">其他測試</h2>
          <button 
            onClick={() => alert("測試按鈕工作正常！")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            測試 Alert
          </button>
        </div>
      </div>
    </div>
  )
} 