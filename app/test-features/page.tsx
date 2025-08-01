"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Save, X, Plus, RefreshCw, TrendingUp, FileText, Calendar } from "lucide-react"

export default function TestFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">新功能測試頁面</h1>
          <p className="text-gray-600">測試週報和月報系統的新增功能</p>
        </div>

        <div className="grid gap-6">
          {/* 週報編輯功能 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                週報編輯功能
              </CardTitle>
              <CardDescription>
                測試週報詳情的編輯功能，包括項目增刪改查
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    編輯週報
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    添加項目
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• 點擊「編輯」按鈕進入週報編輯模式</p>
                  <p>• 可以修改項目名稱、狀態、預期工作、完成狀況等</p>
                  <p>• 可以添加新項目或刪除現有項目</p>
                  <p>• 編輯完成後點擊「保存」或「取消」</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 月度摘要重新整理功能 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                月度摘要重新整理功能
              </CardTitle>
              <CardDescription>
                測試月度摘要的重新整理功能，更新週報更改的資訊
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重新整理
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    編輯摘要
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• 點擊「重新整理」按鈕更新月度摘要數據</p>
                  <p>• 系統會根據最新的週報數據重新計算統計</p>
                  <p>• 若有重複欄位會詢問是否需要修改</p>
                  <p>• 可以手動編輯統計數據、成就、目標等</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 月度變化顯示功能 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                月度變化顯示功能
              </CardTitle>
              <CardDescription>
                顯示與上個月的變化對比
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">+5</div>
                    <div className="text-sm text-gray-600">總專案數</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">+3</div>
                    <div className="text-sm text-gray-600">已完成</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600">+2</div>
                    <div className="text-sm text-gray-600">進行中</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-600">0</div>
                    <div className="text-sm text-gray-600">待處理</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• 顯示當前月份與上個月的數據變化</p>
                  <p>• 綠色表示增長，紅色表示減少</p>
                  <p>• 變化數據會顯示在每個統計卡片下方</p>
                  <p>• 底部有完整的變化摘要表格</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 使用說明 */}
          <Card>
            <CardHeader>
              <CardTitle>使用說明</CardTitle>
              <CardDescription>
                如何正確使用這些新功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">1. 週報編輯</h4>
                  <p className="text-gray-600">在週報詳情頁面，點擊右上角的「編輯」按鈕進入編輯模式，可以修改項目內容、添加新項目或刪除項目。</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">2. 月度摘要重新整理</h4>
                  <p className="text-gray-600">在月度摘要頁面，點擊「重新整理」按鈕會根據最新的週報數據重新計算月度統計，並保存當前數據作為上個月數據用於比較。</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">3. 月度變化查看</h4>
                  <p className="text-gray-600">重新整理後，系統會顯示與上個月的數據變化，包括總專案數、已完成、進行中、待處理的增減情況。</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 