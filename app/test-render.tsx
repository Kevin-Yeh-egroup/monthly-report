"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"

export default function TestRender() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-4xl">
        {/* 頂部標題 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">週報進度整理系統</h1>
          </div>
          <p className="text-xl text-gray-600">2025年7月份工作進度追蹤與管理</p>
        </div>

        {/* 標籤切換 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              <FileText className="h-4 w-4" />
              週報詳情
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700 hover:text-black hover:bg-gray-200"
            >
              <Calendar className="h-4 w-4" />
              月度摘要
            </Button>
          </div>
        </div>

        {/* 測試卡片 */}
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              測試卡片
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <p className="text-black">這是一個測試卡片，用來檢查渲染效果。</p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">綠色背景測試</p>
            </div>
          </CardContent>
        </Card>

        {/* 統計數據測試 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-black mb-2">35</div>
            <div className="text-sm text-gray-600">任務數</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">32</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
            <div className="text-sm text-gray-600">進行中</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-gray-600 mb-2">0</div>
            <div className="text-sm text-gray-600">待處理</div>
          </div>
        </div>
      </div>
    </div>
  )
} 