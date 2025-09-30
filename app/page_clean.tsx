"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  TrendingUp,
  Target,
  Calendar,
  FileText,
  BarChart3,
  AlertTriangle,
  Users,
  Database,
  Calculator,
  Mic,
  BookOpen,
  Edit,
  Save,
  X,
  Plus,
  Info,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react"

// 數據類型定義
interface Project {
  id: string
  name: string
  category: string
  expectedWork: string
  status: "completed" | "in-progress" | "pending"
  completion: string
  issues?: string
  notes?: string
}

interface WeeklyReport {
  weekRange: string
  projects: Project[]
}

interface Achievement {
  title: string
  description: string
  details?: string | string[]
}

interface MonthlySummary {
  totalProjects: number
  completedProjects: number
  inProgressProjects: number
  pendingProjects: number
  keyAchievements: Achievement[]
  workChallenges: Achievement[]
  nextMonthGoals: string[]
  manualStats?: {
    totalProjects: number
    completedProjects: number
    inProgressProjects: number
    pendingProjects: number
  }
  manualAchievements?: Achievement[]
  manualChallenges?: Achievement[]
  manualGoals?: string[]
}

// 主組件
export default function ReportDashboard() {
  // 從 localStorage 讀取保存的資料，如果沒有則使用預設資料
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([])
  const [selectedWeek, setSelectedWeek] = useState<string>("9/1-9/7")
  const [activeTab, setActiveTab] = useState<string>("weekly")
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-09")
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null)

  // 編輯狀態
  const [isEditing, setIsEditing] = useState(false)
  const [isWeeklyEditing, setIsWeeklyEditing] = useState(false)
  const [editStats, setEditStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    pendingProjects: 0,
  })
  const [editAchievements, setEditAchievements] = useState<Achievement[]>([])
  const [editGoals, setEditGoals] = useState<string[]>([])
  const [editChallenges, setEditChallenges] = useState<Achievement[]>([])
  const [editWeeklyProjects, setEditWeeklyProjects] = useState<Project[]>([])
  const [previousMonthData, setPreviousMonthData] = useState<MonthlySummary | null>(null)

  // 語音轉文字辭庫編輯狀態
  const [isVoiceToTextEditing, setIsVoiceToTextEditing] = useState(false)
  const [editVoiceToTextData, setEditVoiceToTextData] = useState([
    { week: "7月底", total: 350, new: 0 },
    { week: "8/4-8/10", total: 350, new: 0 },
    { week: "8/11-8/17", total: 361, new: 11 },
    { week: "8/18-8/24", total: 393, new: 32 },
    { week: "8/25-8/31", total: 644, new: 251 },
    { week: "9/1-9/7", total: 798, new: 154 },
    { week: "9/8-9/14", total: 811, new: 13 },
    { week: "9/15-9/21", total: 925, new: 114 },
    { week: "9/22-9/28", total: 940, new: 15 }
  ])

  // 知識庫編輯狀態
  const [isKnowledgeBaseEditing, setIsKnowledgeBaseEditing] = useState(false)
  const [editKnowledgeBaseData, setEditKnowledgeBaseData] = useState<{ category: string; description: string; details: string }[]>([
    {
      category: "知識庫總統計",
      description: "總文章數：942篇",
      details: "截至9月底，知識庫共累積942篇文章，涵蓋各領域專業知識與實務經驗"
    },
    {
      category: "債務領域",
      description: "債務相關文章：147篇",
      details: "涵蓋債務協助、債務管理、債務風險評估等專業知識與實務案例"
    },
    {
      category: "政府救助資源",
      description: "政府補助與資源：128篇",
      details: "整合各級政府社福資源、補助申請指南、福利政策說明等資訊"
    },
    {
      category: "身心障礙領域",
      description: "身心障礙相關知識：58篇",
      details: "身心障礙者權益、福利資源、照護技巧與社會支持系統"
    },
    {
      category: "兒少領域",
      description: "兒童少年福利：75篇",
      details: "兒童保護、少年福利、兒少權益保障等專業知識與資源"
    },
    {
      category: "銀髮族領域",
      description: "銀髮族福利資源：57篇",
      details: "老人福利、長期照護、退休生活規劃等銀髮族相關資訊"
    }
  ])

  // 根據選擇的月份獲取對應的統計數據
  const getStatsForMonth = (month: string) => {
    switch (month) {
      case '2025-09':
        return {
          voiceToTextData: [
            { week: "7月底", total: 350, new: 0 },
            { week: "8/4-8/10", total: 350, new: 0 },
            { week: "8/11-8/17", total: 361, new: 11 },
            { week: "8/18-8/24", total: 393, new: 32 },
            { week: "8/25-8/31", total: 644, new: 251 },
            { week: "9/1-9/7", total: 798, new: 154 },
            { week: "9/8-9/14", total: 811, new: 13 },
            { week: "9/15-9/21", total: 925, new: 114 },
            { week: "9/22-9/28", total: 940, new: 15 }
          ],
          knowledgeBaseData: [
            {
              category: "知識庫總統計",
              description: "總文章數：942篇",
              details: "截至9月底，知識庫共累積942篇文章，涵蓋各領域專業知識與實務經驗"
            },
            {
              category: "債務領域",
              description: "債務相關文章：147篇",
              details: "涵蓋債務協助、債務管理、債務風險評估等專業知識與實務案例"
            },
            {
              category: "政府救助資源",
              description: "政府補助與資源：128篇",
              details: "整合各級政府社福資源、補助申請指南、福利政策說明等資訊"
            },
            {
              category: "身心障礙領域",
              description: "身心障礙相關知識：58篇",
              details: "身心障礙者權益、福利資源、照護技巧與社會支持系統"
            },
            {
              category: "兒少領域",
              description: "兒童少年福利：75篇",
              details: "兒童保護、少年福利、兒少權益保障等專業知識與資源"
            },
            {
              category: "銀髮族領域",
              description: "銀髮族福利資源：57篇",
              details: "老人福利、長期照護、退休生活規劃等銀髮族相關資訊"
            }
          ]
        }
      default:
        return {
          voiceToTextData: [
            { week: "7月底", total: 350, new: 0 }
          ],
          knowledgeBaseData: [
            {
              category: "知識庫總統計",
              description: "持續擴充中",
              details: "知識庫系統持續建設與內容擴充"
            }
          ]
        }
    }
  }

  // 月份選項
  const monthOptions = [
    { value: "2025-07", label: "2025年7月" },
    { value: "2025-08", label: "2025年8月" },
    { value: "2025-09", label: "2025年9月" },
    { value: "2025-10", label: "2025年10月" },
    { value: "2025-11", label: "2025年11月" },
    { value: "2025-12", label: "2025年12月" },
  ]

  // 週次選項 - 根據月份動態生成
  const getWeekOptions = (month: string) => {
    const weekOptions = {
      "2025-07": [
        { value: "7/7-7/13", label: "7/7-7/13" },
        { value: "7/14-7/20", label: "7/14-7/20" },
        { value: "7/21-7/27", label: "7/21-7/27" },
        { value: "7/28-8/3", label: "7/28-8/3" },
      ],
      "2025-08": [
        { value: "8/4-8/10", label: "8/4-8/10" },
        { value: "8/11-8/17", label: "8/11-8/17" },
        { value: "8/18-8/24", label: "8/18-8/24" },
        { value: "8/25-8/31", label: "8/25-8/31" },
      ],
      "2025-09": [
        { value: "9/1-9/7", label: "9/1-9/7" },
        { value: "9/8-9/14", label: "9/8-9/14" },
        { value: "9/15-9/21", label: "9/15-9/21" },
        { value: "9/22-9/28", label: "9/22-9/28" },
      ],
      "2025-10": [
        { value: "10/6-10/12", label: "10/6-10/12" },
        { value: "10/13-10/19", label: "10/13-10/19" },
        { value: "10/20-10/26", label: "10/20-10/26" },
        { value: "10/27-11/2", label: "10/27-11/2" },
      ],
      "2025-11": [
        { value: "11/3-11/9", label: "11/3-11/9" },
        { value: "11/10-11/16", label: "11/10-11/16" },
        { value: "11/17-11/23", label: "11/17-11/23" },
        { value: "11/24-11/30", label: "11/24-11/30" },
      ],
      "2025-12": [
        { value: "12/1-12/7", label: "12/1-12/7" },
        { value: "12/8-12/14", label: "12/8-12/14" },
        { value: "12/15-12/21", label: "12/15-12/21" },
        { value: "12/22-12/28", label: "12/22-12/28" },
      ],
    }
    return weekOptions[month as keyof typeof weekOptions] || weekOptions["2025-07"]
  }

  // 處理週次變更
  const handleWeekChange = (week: string) => {
    setSelectedWeek(week)
  }

  // 處理標籤變更
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // 處理月份變更
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    const weekOptions = getWeekOptions(month)
    if (weekOptions.length > 0) {
      setSelectedWeek(weekOptions[0].value)
    }

    // 更新統計數據根據選擇的月份
    const monthStats = getStatsForMonth(month)
    setEditVoiceToTextData(monthStats.voiceToTextData)
    setEditKnowledgeBaseData(monthStats.knowledgeBaseData)
  }

  // 獲取顯示的統計數據
  const getDisplayStats = () => {
    if (monthlySummary?.manualStats) {
      return monthlySummary.manualStats
    }
    return {
      totalProjects: monthlySummary?.totalProjects || 0,
      completedProjects: monthlySummary?.completedProjects || 0,
      inProgressProjects: monthlySummary?.inProgressProjects || 0,
      pendingProjects: monthlySummary?.pendingProjects || 0,
    }
  }

  // 獲取顯示的成就
  const getDisplayAchievements = () => {
    if (editAchievements.length > 0) {
      return editAchievements
    }
    return monthlySummary?.keyAchievements || []
  }

  // 獲取顯示的目標
  const getDisplayGoals = () => {
    if (editGoals.length > 0) {
      return editGoals
    }
    return monthlySummary?.nextMonthGoals || []
  }

  // 獲取顯示的困難或挑戰
  const getDisplayChallenges = () => {
    if (editChallenges.length > 0) {
      return editChallenges
    }
    return monthlySummary?.workChallenges || []
  }

  // 計算與上個月的變化
  const getMonthlyChanges = () => {
    if (!previousMonthData || !monthlySummary) return null

    return {
      totalProjects: monthlySummary.totalProjects - previousMonthData.totalProjects,
      completedProjects: monthlySummary.completedProjects - previousMonthData.completedProjects,
      inProgressProjects: monthlySummary.inProgressProjects - previousMonthData.inProgressProjects,
      pendingProjects: monthlySummary.pendingProjects - previousMonthData.pendingProjects,
    }
  }

  // 處理週報編輯
  const handleWeeklyEdit = () => {
    setIsWeeklyEditing(true)
  }

  // 處理週報保存
  const handleWeeklySave = () => {
    setIsWeeklyEditing(false)
  }

  // 處理週報取消
  const handleWeeklyCancel = () => {
    setIsWeeklyEditing(false)
  }

  // 處理語音轉文字編輯
  const handleVoiceToTextEdit = () => {
    setIsVoiceToTextEditing(true)
  }

  // 處理語音轉文字保存
  const handleVoiceToTextSave = () => {
    setIsVoiceToTextEditing(false)
  }

  // 處理語音轉文字取消
  const handleVoiceToTextCancel = () => {
    setIsVoiceToTextEditing(false)
  }

  // 處理知識庫編輯
  const handleKnowledgeBaseEdit = () => {
    setIsKnowledgeBaseEditing(true)
  }

  // 處理知識庫保存
  const handleKnowledgeBaseSave = () => {
    setIsKnowledgeBaseEditing(false)
  }

  // 處理知識庫取消
  const handleKnowledgeBaseCancel = () => {
    setIsKnowledgeBaseEditing(false)
  }

  // 處理月度摘要重新整理
  const handleRefreshMonthlySummary = () => {
    if (monthlySummary) {
      setPreviousMonthData(monthlySummary)
    }

    // 重新計算月度摘要
    const monthWeekOptions = getWeekOptions(selectedMonth)
    const monthWeekRanges = monthWeekOptions.map(option => option.value)
    const filteredReports = weeklyReports.filter(report =>
      monthWeekRanges.includes(report.weekRange)
    )

    const allProjects = filteredReports.flatMap(report => report.projects)

    const summary: MonthlySummary = {
      totalProjects: allProjects.length,
      completedProjects: allProjects.filter(p => p.status === "completed").length,
      inProgressProjects: allProjects.filter(p => p.status === "in-progress").length,
      pendingProjects: allProjects.filter(p => p.status === "pending").length,
      keyAchievements: [
        {
          title: "語音轉文字功能優化",
          description: "技術：泰元，管理：先博，合作：小編、工讀生",
          details: [
            "辭庫至9月底的940個，全月成長142個（15.9%成長）。",
            "課程摘要至9月底的78篇，全月新增3篇。",
            "語音轉文字實習生測試持續進行",
            "Gemini 2.5 flash版本測試優化"
          ]
        },
        {
          title: "財務試算模擬器擴充",
          description: "技術：泰元，開發：先博，測試：公司夥伴、星展志工",
          details: [
            "學貸計算器：協助學生財務規劃",
            "二胎車貸計算器：複雜貸款計算",
            "最低生活費計算器：基本生活開銷評估",
            "強制執行計算器：債務執行風險評估",
            "個人財務快篩流程示意：快速財務健康檢查",
            "信用貸款月還款計算：貸款負擔評估",
            "8月建議優化小工具6項：持續改進"
          ]
        },
        {
          title: "知識庫管理",
          description: "文章審核：James，技術：泰元，文章檢查：先博，文章生成：先博、工讀生、小編、婉仙",
          details: [
            "知識庫總文章數達942篇，涵蓋38個專業領域",
            "社福資源資料庫持續擴充，各領域文章數量顯著成長",
            "星展志工投稿機制穩定運行（全月44位投稿，68篇文章）",
            "電子報預備四期完成，季刊債務名詞參考提供",
            "9月份稿件整理完成，建立完善內容管理流程",
            "知識庫補足清單持續完善，多領域內容均衡發展"
          ]
        }
      ],
      workChallenges: [
        {
          title: "測試案例蒐集",
          description: "個人財務健康檢測與家庭經濟圖譜需要更多測試案例來驗證系統準確性"
        },
        {
          title: "團隊擴張適應",
          description: "新進人員需要時間熟悉工作流程與系統操作"
        }
      ],
      nextMonthGoals: [
        "完成個人財務健康檢測16面向完整測試",
        "深化家庭經濟圖譜測試案例擴大",
        "持續優化語音轉文字辭庫品質",
        "推進知識庫內容多元化發展",
        "強化團隊協作與培訓機制"
      ]
    }

    setMonthlySummary(summary)

    // 初始化編輯數據
    setEditStats({
      totalProjects: summary.totalProjects,
      completedProjects: summary.completedProjects,
      inProgressProjects: summary.inProgressProjects,
      pendingProjects: summary.pendingProjects,
    })
    setEditAchievements([...summary.keyAchievements])
    setEditGoals([...summary.nextMonthGoals])
    setEditChallenges([...summary.workChallenges])
  }

  // 處理保存
  const handleSave = () => {
    if (monthlySummary) {
      const updatedSummary: MonthlySummary = {
        ...monthlySummary,
        manualStats: editStats,
        manualAchievements: editAchievements,
        manualChallenges: editChallenges,
        manualGoals: editGoals,
      }
      setMonthlySummary(updatedSummary)
      setIsEditing(false)
    }
  }

  // 處理取消
  const handleCancel = () => {
    if (monthlySummary) {
      setEditStats({
        totalProjects: monthlySummary.totalProjects,
        completedProjects: monthlySummary.completedProjects,
        inProgressProjects: monthlySummary.inProgressProjects,
        pendingProjects: monthlySummary.pendingProjects,
      })
      setEditAchievements([...monthlySummary.keyAchievements])
      setEditChallenges([...monthlySummary.workChallenges])
      setEditGoals([...monthlySummary.nextMonthGoals])
    }
    setIsEditing(false)
  }

  // 設置編輯狀態
  const setEditingState = (isEditing: boolean, isWeeklyEditing: boolean = false) => {
    setIsEditing(isEditing)
    setIsWeeklyEditing(isWeeklyEditing)
  }

  // 載入初始數據
  useEffect(() => {
    // 初始化統計數據根據選擇的月份
    const monthStats = getStatsForMonth(selectedMonth)
    setEditVoiceToTextData(monthStats.voiceToTextData)
    setEditKnowledgeBaseData(monthStats.knowledgeBaseData)

    // 計算月度摘要
    handleRefreshMonthlySummary()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-black">週報進度整理系統</h1>
          <p className="text-xl text-gray-600">
            {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年9月"} 工作進度追蹤與管理
          </p>
        </div>

        {/* 導航區域 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Label htmlFor="month-select" className="text-sm font-medium text-gray-700">
              選擇月份
            </Label>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="選擇月份" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="week-select" className="text-sm font-medium text-gray-700">
              選擇週次
            </Label>
            <Select value={selectedWeek} onValueChange={handleWeekChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="選擇週次" />
              </SelectTrigger>
              <SelectContent>
                {getWeekOptions(selectedMonth).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "weekly" ? "default" : "outline"}
              onClick={() => handleTabChange("weekly")}
              className="flex-1"
            >
              週報
            </Button>
            <Button
              variant={activeTab === "monthly" ? "default" : "outline"}
              onClick={() => handleTabChange("monthly")}
              className="flex-1"
            >
              月度摘要
            </Button>
          </div>
        </div>

        {/* 內容區域 */}
        {activeTab === "weekly" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>週報內容</CardTitle>
                <CardDescription>
                  {selectedWeek} 的工作內容
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">這裡將顯示週報的詳細內容...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "monthly" && (
          <div className="space-y-6">
            {/* 月度統計 */}
            {monthlySummary && getDisplayStats().totalProjects > 0 && (
              <Card className="shadow-lg border border-gray-200 bg-white">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <CardTitle className="text-2xl">
                        {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年9月"} 月度統計
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-green-100">
                    {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年9月"} 整體工作統計數據
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-3xl font-bold text-gray-600 mb-2">{getDisplayStats().totalProjects}</div>
                      <div className="text-sm text-gray-600">總專案數</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">{getDisplayStats().completedProjects}</div>
                      <div className="text-sm text-gray-600">已完成</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{getDisplayStats().inProgressProjects}</div>
                      <div className="text-sm text-gray-600">進行中</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{getDisplayStats().pendingProjects}</div>
                      <div className="text-sm text-gray-600">待處理</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 月度執行狀況 */}
            {monthlySummary && (
              <Card className="shadow-lg border border-gray-200 bg-white">
                <CardHeader className={`text-white rounded-t-lg ${selectedMonth === '2025-09' ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-red-600 to-red-500'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      <CardTitle className="text-2xl">
                        {monthOptions.find(option => option.value === selectedMonth)?.label.replace('2025年', '')}月份執行狀況
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-white opacity-90">
                    {monthOptions.find(option => option.value === selectedMonth)?.label}達成的重要成果
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    {getDisplayAchievements().map((achievement, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        {Array.isArray(achievement.details) ? (
                          <ul className="text-sm text-gray-600 space-y-1">
                            {achievement.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-600">{achievement.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 語音轉文字辭庫更新統計 */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Mic className="h-6 w-6" />
                  <CardTitle className="text-2xl">語音轉文字辭庫更新統計</CardTitle>
                </div>
                <CardDescription className="text-blue-100">
                  辭庫成長趨勢與數據統計
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{editVoiceToTextData[editVoiceToTextData.length - 1]?.total || 0}</div>
                  <div className="text-sm text-gray-600">9月底辭庫總數</div>
                </div>
                <div className="text-sm text-gray-600">
                  辭庫從7月底的350個擴充至9月底的940個，淨成長590個，增長率達169%。
                </div>
              </CardContent>
            </Card>

            {/* 知識庫擴充統計 */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-6 w-6" />
                  <CardTitle className="text-2xl">知識庫擴充統計</CardTitle>
                </div>
                <CardDescription className="text-purple-100">
                  知識庫內容擴充與品質提升統計
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-600 mb-2">942</div>
                  <div className="text-sm text-gray-600">9月底總文章數</div>
                </div>
                <div className="text-sm text-gray-600">
                  知識庫從8月的757篇增加到9月的942篇，月增185篇，增長率達24.4%。
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
