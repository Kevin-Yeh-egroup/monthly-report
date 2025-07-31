"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  TrendingUp,
  Target,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Edit,
  X,
  AlertTriangle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ReportType = "weekly" | "monthly" | "yearly"

interface WorkItem {
  id: string
  project: string
  expectedWork: string
  status: "completed" | "in-progress" | "pending"
  issues?: string
  goals?: string
}

interface WeeklyData {
  weekRange: string
  lastWeek: WorkItem[]
  thisWeek: WorkItem[]
  createdAt: string
  updatedAt: string
}

interface MonthlyGoal {
  id: string
  title: string
  description: string
  responsible: string
  status: "completed" | "in-progress" | "pending"
}

interface MonthlyAchievement {
  id: string
  title: string
  content: string
  statistics?: { [key: string]: number | string }
  details?: string
}

interface MonthlyData {
  month: string
  goals: MonthlyGoal[]
  achievements: MonthlyAchievement[]
  nextMonthGoals: MonthlyGoal[]
  createdAt: string
  updatedAt: string
}

interface YearlyData {
  year: string
  summary: string
  keyAchievements: string[]
  challenges: string[]
  nextYearGoals: string[]
  statistics: { [key: string]: number | string }
  createdAt: string
  updatedAt: string
}

interface MonthlyStats {
  totalProjects: number
  completedTasks: number
  ongoingTasks: number
  totalIssues: number
  weeksCovered: number
  topProjects: string[]
}

export default function ReportDashboard() {
  const [currentView, setCurrentView] = useState<"report" | "admin">("report")
  const [reportType, setReportType] = useState<ReportType>("weekly")
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [weeklyReports, setWeeklyReports] = useState<WeeklyData[]>([])
  const [monthlyReports, setMonthlyReports] = useState<MonthlyData[]>([])
  const [yearlyReports, setYearlyReports] = useState<YearlyData[]>([])

  // 載入數據
  useEffect(() => {
    // 載入週報數據
    const savedWeeklyReports = localStorage.getItem("weeklyReports")
    if (savedWeeklyReports) {
      const reports = JSON.parse(savedWeeklyReports)
      setWeeklyReports(reports)
      if (reports.length > 0 && !selectedWeek) {
        setSelectedWeek(reports[reports.length - 1].weekRange)
      }
    } else {
      // 預載入週報數據
      const initialWeeklyData: WeeklyData[] = [
        {
          weekRange: "6/16-6/22",
          lastWeek: [
            {
              id: "1",
              project: "語音轉文字實習生測試",
              expectedWork: "提供逐字稿測試語音檔案，協助實習生進行語音轉文字功能測試",
              status: "completed",
              issues: "需要更多樣化的語音檔案進行測試，確保系統穩定性",
            },
            {
              id: "2",
              project: "財務試算模擬器開發",
              expectedWork: "完成財務試算相關工具開發，提升工具總數",
              status: "completed",
              issues: "工具需求理解需要更多溝通時間",
            },
            {
              id: "3",
              project: "好理家工作計畫會議",
              expectedWork: "召開說明會議，確定團隊人力配置和工作分工",
              status: "completed",
              issues: "人力協調時間安排較為困難",
            },
          ],
          thisWeek: [
            {
              id: "4",
              project: "語音轉文字系統升級",
              expectedWork: "測試Gemini 2.5 flash版本，評估升級可行性",
              goals: "完成版本測試，確認系統穩定性和準確度提升",
            },
            {
              id: "5",
              project: "知識庫內容整理",
              expectedWork: "整理社福資源資料庫，進行標籤分類統計",
              goals: "建立完整的標籤分類系統",
            },
          ],
          createdAt: "2024-06-16T00:00:00.000Z",
          updatedAt: "2024-06-22T23:59:59.000Z",
        },
        {
          weekRange: "6/23-6/29",
          lastWeek: [
            {
              id: "6",
              project: "語音轉文字系統升級",
              expectedWork: "測試Gemini 2.5 flash版本，評估升級可行性",
              status: "completed",
              issues: "Gemini版本穩定性需要持續監控",
            },
            {
              id: "7",
              project: "知識庫內容整理",
              expectedWork: "整理社福資源資料庫，進行標籤分類統計",
              status: "completed",
              issues: "標籤分類標準化需要更多時間討論",
            },
          ],
          thisWeek: [
            {
              id: "8",
              project: "課程摘要處理",
              expectedWork: "處理和確認課程摘要內容，建立知識庫",
              goals: "完成19篇課程摘要的處理和確認",
            },
            {
              id: "9",
              project: "家庭經濟圖譜優化",
              expectedWork: "增加寵物選項功能，完善圖譜系統",
              goals: "完成寵物選項的開發和測試",
            },
          ],
          createdAt: "2024-06-23T00:00:00.000Z",
          updatedAt: "2024-06-29T23:59:59.000Z",
        },
        {
          weekRange: "6/30-7/6",
          lastWeek: [
            {
              id: "10",
              project: "課程摘要處理",
              expectedWork: "處理和確認課程摘要內容，建立知識庫",
              status: "completed",
              issues: "部分課程摘要需要Ivy進一步確認和校對",
            },
            {
              id: "11",
              project: "家庭經濟圖譜優化",
              expectedWork: "增加寵物選項功能，完善圖譜系統",
              status: "completed",
              issues: "功能測試需要更多使用者回饋",
            },
            {
              id: "12",
              project: "個案處理追蹤",
              expectedWork: "持續追蹤和處理個案進度，提供專業服務",
              status: "in-progress",
              issues: "個案資訊收集完整性有待提升，部分個案配合度需要改善",
            },
          ],
          thisWeek: [
            {
              id: "13",
              project: "語音轉文字系統穩定性測試",
              expectedWork: "持續測試Gemini 2.5 flash版本的穩定性",
              goals: "確保系統在大量使用下的穩定表現",
            },
            {
              id: "14",
              project: "V0課程規劃",
              expectedWork: "與夥伴協調課程時間，安排學習計畫",
              goals: "確定課程時間表，開始系統性學習",
            },
            {
              id: "15",
              project: "知識庫擴充計畫執行",
              expectedWork: "執行好理家知識庫擴充，協調團隊工作",
              goals: "建立完整的團隊協作流程，推進知識庫建設",
            },
          ],
          createdAt: "2024-06-30T00:00:00.000Z",
          updatedAt: "2024-07-06T23:59:59.000Z",
        },
      ]
      localStorage.setItem("weeklyReports", JSON.stringify(initialWeeklyData))
      setWeeklyReports(initialWeeklyData)
      setSelectedWeek("6/30-7/6")
    }

    // 載入月報數據
    const savedMonthlyReports = localStorage.getItem("monthlyReports")
    if (savedMonthlyReports) {
      const reports = JSON.parse(savedMonthlyReports)
      setMonthlyReports(reports)
      if (reports.length > 0 && !selectedMonth) {
        setSelectedMonth(reports[reports.length - 1].month)
      }
    } else {
      // 預載入6月份月報數據
      const initialMonthlyData: MonthlyData[] = [
        {
          month: "2024-06",
          goals: [
            {
              id: "1",
              title: "家庭經濟圖譜測試",
              description: "完成家庭經濟圖譜的技術測試和優化",
              responsible: "技術：泰元，測試：Kevin、工讀生",
              status: "completed",
            },
            {
              id: "2",
              title: "知識庫內容新增",
              description: "新增重大事件&各縣市資源相關內容",
              responsible: "審核：James、素菁",
              status: "completed",
            },
            {
              id: "3",
              title: "學習Vibe coding",
              description: "學習並掌握Vibe coding技術",
              responsible: "技術：泰元",
              status: "completed",
            },
            {
              id: "4",
              title: "星展研討會協助及資訊蒐集",
              description: "協助星展研討會並進行相關資訊收集",
              responsible: "討論：素菁",
              status: "completed",
            },
          ],
          achievements: [
            {
              id: "1",
              title: "家庭經濟圖譜測試成果",
              content: "已調整prompt，並在Vertex上以Gemini 2.5 flash測試15案，與手動整理節點及關係約有80-90%相同",
              statistics: {
                測試案例數: 15,
                準確度: "80-90%",
                節點種類_現在: 3,
                節點種類_未來: 8,
                關係種類_現在: 15,
                關係種類_未來: 9,
              },
              details: `節點種類優化：
現在Prompt: PERSON、FINANCIAL_UNIT、RESOURCE_UNIT
未來Prompt: PERSON、RELATED_PERSON、GROUP、EMPLOYMENT_UNIT、EDUCATIONAL_UNIT、FINANCIAL_UNIT、RESOURCE_UNIT、GOVERNMENT_UNIT、INSURANCE_UNIT

關係種類優化：
現在Prompt: 15種具體關係（PARENT_OF、BORROWED_FROM等）
未來Prompt: 9種抽象分類（EMOTIONAL_RELATIONSHIP、SOCIAL_RELATIONSHIP、LEGAL_RELATIONSHIP等）

屬性結構化：
- 節點屬性更細緻，包含完整的financialInfo和majorFinancialEvents
- 關係屬性提供極高的細節粒度，記錄時間點、狀態、具體原因等深層資訊`,
            },
            {
              id: "2",
              title: "知識庫內容新增成果",
              content: "台灣22縣市社會局資源整理完畢，知識庫畫面呈現設計完畢",
              statistics: {
                知識庫文章總數: 236,
                縣市資源: 22,
                債務: 39,
                政府救助資源: 52,
                罹病求助: 12,
                民間社會資源: 6,
                身心障礙領域: 21,
                兒少領域: 16,
                成人領域: 23,
                銀髮族領域: 11,
                學術理論: 34,
                管理技巧: 28,
                法規: 30,
              },
            },
            {
              id: "3",
              title: "Vibe coding學習成果",
              content: "用v0整理12個小工具，目前兩位夥伴(郁卿、怡君)有嘗試使用並提供回饋",
              statistics: {
                開發工具數: 12,
                測試夥伴: 2,
              },
              details: `使用回饋：
- 專有名詞較多，須說明
- 須提供較多資訊才能輸入，但個案經常不會提供這麼多資訊，可能需要多依些提醒
- 月報用V0製作`,
            },
            {
              id: "4",
              title: "星展研討會協助成果",
              content: "北區研討會協助，並整理研討會摘要",
              statistics: {
                研討會場次: 1,
                研討會摘要: 1,
              },
            },
          ],
          nextMonthGoals: [
            {
              id: "1",
              title: "知識庫文章上架",
              description: "完成知識庫文章的上架工作",
              responsible: "技術：泰元，管理：先博，合作：小編",
              status: "pending",
            },
            {
              id: "2",
              title: "整理馴錢師課程摘要",
              description: "整理和審核馴錢師相關課程摘要",
              responsible: "審核：Ivy",
              status: "pending",
            },
            {
              id: "3",
              title: "好理家知識庫擴充與工具開發",
              description: "擴充好理家知識庫並開發相關工具",
              responsible: "技術：泰元、先博，合作：實習生",
              status: "pending",
            },
            {
              id: "4",
              title: "星展研討會協助及資訊蒐集",
              description: "持續協助星展研討會並進行資訊收集",
              responsible: "討論：素菁",
              status: "pending",
            },
          ],
          createdAt: "2024-06-01T00:00:00.000Z",
          updatedAt: "2024-06-30T23:59:59.000Z",
        },
      ]
      localStorage.setItem("monthlyReports", JSON.stringify(initialMonthlyData))
      setMonthlyReports(initialMonthlyData)
      setSelectedMonth("2024-06")
    }

    // 載入年報數據
    const savedYearlyReports = localStorage.getItem("yearlyReports")
    if (savedYearlyReports) {
      const reports = JSON.parse(savedYearlyReports)
      setYearlyReports(reports)
      if (reports.length > 0 && !selectedYear) {
        setSelectedYear(reports[reports.length - 1].year)
      }
    }
  }, [])

  // 保存數據
  const saveWeeklyReports = (reports: WeeklyData[]) => {
    localStorage.setItem("weeklyReports", JSON.stringify(reports))
    setWeeklyReports(reports)
  }

  const saveMonthlyReports = (reports: MonthlyData[]) => {
    localStorage.setItem("monthlyReports", JSON.stringify(reports))
    setMonthlyReports(reports)
  }

  const saveYearlyReports = (reports: YearlyData[]) => {
    localStorage.setItem("yearlyReports", JSON.stringify(reports))
    setYearlyReports(reports)
  }

  // 新增月報
  const addNewMonthlyReport = (month: string) => {
    const newReport: MonthlyData = {
      month,
      goals: [],
      achievements: [],
      nextMonthGoals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedReports = [...monthlyReports, newReport]
    saveMonthlyReports(updatedReports)
    setSelectedMonth(month)
  }

  // 新增年報
  const addNewYearlyReport = (year: string) => {
    const newReport: YearlyData = {
      year,
      summary: "",
      keyAchievements: [],
      challenges: [],
      nextYearGoals: [],
      statistics: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedReports = [...yearlyReports, newReport]
    saveYearlyReports(updatedReports)
    setSelectedYear(year)
  }

  // 新增月報目標
  const addMonthlyGoal = (month: string, type: "goals" | "nextMonthGoals") => {
    const newGoal: MonthlyGoal = {
      id: Date.now().toString(),
      title: "",
      description: "",
      responsible: "",
      status: "pending",
    }

    const updatedReports = monthlyReports.map((report) => {
      if (report.month === month) {
        return {
          ...report,
          [type]: [...report[type], newGoal],
          updatedAt: new Date().toISOString(),
        }
      }
      return report
    })

    saveMonthlyReports(updatedReports)
  }

  // 新增月報成果
  const addMonthlyAchievement = (month: string) => {
    const newAchievement: MonthlyAchievement = {
      id: Date.now().toString(),
      title: "",
      content: "",
      statistics: {},
      details: "",
    }

    const updatedReports = monthlyReports.map((report) => {
      if (report.month === month) {
        return {
          ...report,
          achievements: [...report.achievements, newAchievement],
          updatedAt: new Date().toISOString(),
        }
      }
      return report
    })

    saveMonthlyReports(updatedReports)
  }

  // 更新月報項目
  const updateMonthlyGoal = (
    month: string,
    type: "goals" | "nextMonthGoals",
    goalId: string,
    updates: Partial<MonthlyGoal>,
  ) => {
    const updatedReports = monthlyReports.map((report) => {
      if (report.month === month) {
        return {
          ...report,
          [type]: report[type].map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)),
          updatedAt: new Date().toISOString(),
        }
      }
      return report
    })

    saveMonthlyReports(updatedReports)
  }

  // 更新月報成果
  const updateMonthlyAchievement = (month: string, achievementId: string, updates: Partial<MonthlyAchievement>) => {
    const updatedReports = monthlyReports.map((report) => {
      if (report.month === month) {
        return {
          ...report,
          achievements: report.achievements.map((achievement) =>
            achievement.id === achievementId ? { ...achievement, ...updates } : achievement,
          ),
          updatedAt: new Date().toISOString(),
        }
      }
      return report
    })

    saveMonthlyReports(updatedReports)
  }

  // 刪除月報項目
  const deleteMonthlyGoal = (month: string, type: "goals" | "nextMonthGoals", goalId: string) => {
    const updatedReports = monthlyReports.map((report) => {
      if (report.month === month) {
        return {
          ...report,
          [type]: report[type].filter((goal) => goal.id !== goalId),
          updatedAt: new Date().toISOString(),
        }
      }
      return report
    })

    saveMonthlyReports(updatedReports)
  }

  // 刪除月報成果
  const deleteMonthlyAchievement = (month: string, achievementId: string) => {
    const updatedReports = monthlyReports.map((report) => {
      if (report.month === month) {
        return {
          ...report,
          achievements: report.achievements.filter((achievement) => achievement.id !== achievementId),
          updatedAt: new Date().toISOString(),
        }
      }
      return report
    })

    saveMonthlyReports(updatedReports)
  }

  // 計算月度統計
  const calculateMonthlyStats = (month: string): MonthlyStats => {
    const monthReports = weeklyReports.filter(
      (report) => report.weekRange.includes(month) || report.weekRange.includes(month.split("/")[0]),
    )

    const allTasks = monthReports.flatMap((report) => [...report.lastWeek, ...report.thisWeek])
    const projects = [...new Set(allTasks.map((task) => task.project).filter(Boolean))]

    return {
      totalProjects: projects.length,
      completedTasks: allTasks.filter((task) => task.status === "completed").length,
      ongoingTasks: allTasks.filter((task) => task.status === "in-progress").length,
      totalIssues: allTasks.filter((task) => task.issues && task.issues.trim()).length,
      weeksCovered: monthReports.length,
      topProjects: projects.slice(0, 5),
    }
  }

  const currentWeekData = weeklyReports.find((report) => report.weekRange === selectedWeek)
  const currentMonthData = monthlyReports.find((report) => report.month === selectedMonth)
  const currentYearData = yearlyReports.find((report) => report.year === selectedYear)
  const monthlyStats = calculateMonthlyStats("7")

  // 月報目標編輯組件
  const MonthlyGoalEditor = ({
    goal,
    type,
    month,
    onUpdate,
    onDelete,
  }: {
    goal: MonthlyGoal
    type: "goals" | "nextMonthGoals"
    month: string
    onUpdate: (updates: Partial<MonthlyGoal>) => void
    onDelete: () => void
  }) => (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">目標標題</label>
            <Input
              value={goal.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="輸入目標標題"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">目標描述</label>
            <Textarea
              value={goal.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="描述目標的具體內容"
              className="bg-gray-700 border-gray-600 text-white"
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">負責人員</label>
            <Input
              value={goal.responsible}
              onChange={(e) => onUpdate({ responsible: e.target.value })}
              placeholder="例如：技術：泰元，測試：Kevin"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {type === "goals" && (
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">完成狀況</label>
              <Select value={goal.status} onValueChange={(value: any) => onUpdate({ status: value })}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="in-progress">進行中</SelectItem>
                  <SelectItem value="pending">待處理</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  // 月報成果編輯組件
  const MonthlyAchievementEditor = ({
    achievement,
    month,
    onUpdate,
    onDelete,
  }: {
    achievement: MonthlyAchievement
    month: string
    onUpdate: (updates: Partial<MonthlyAchievement>) => void
    onDelete: () => void
  }) => (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">成果標題</label>
            <Input
              value={achievement.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="輸入成果標題"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">成果內容</label>
            <Textarea
              value={achievement.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="描述具體的成果內容"
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">統計數據 (JSON格式)</label>
            <Textarea
              value={JSON.stringify(achievement.statistics || {}, null, 2)}
              onChange={(e) => {
                try {
                  const stats = JSON.parse(e.target.value)
                  onUpdate({ statistics: stats })
                } catch (error) {
                  // 忽略JSON解析錯誤
                }
              }}
              placeholder='{"項目名稱": 數值, "另一項目": "文字值"}'
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1">詳細說明</label>
            <Textarea
              value={achievement.details || ""}
              onChange={(e) => onUpdate({ details: e.target.value })}
              placeholder="補充詳細的說明內容"
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 頂部導航 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Button
              variant={currentView === "report" ? "default" : "ghost"}
              onClick={() => setCurrentView("report")}
              className={`${
                currentView === "report"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              報告檢視
            </Button>
            <Button
              variant={currentView === "admin" ? "default" : "ghost"}
              onClick={() => setCurrentView("admin")}
              className={`${
                currentView === "admin"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              後台管理
            </Button>
          </div>

          {currentView === "report" && (
            <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
              <Button
                variant={reportType === "weekly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("weekly")}
                className={`flex items-center gap-2 ${
                  reportType === "weekly"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <FileText className="h-4 w-4" />
                週報
              </Button>
              <Button
                variant={reportType === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("monthly")}
                className={`flex items-center gap-2 ${
                  reportType === "monthly"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Calendar className="h-4 w-4" />
                月報
              </Button>
              <Button
                variant={reportType === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setReportType("yearly")}
                className={`flex items-center gap-2 ${
                  reportType === "yearly"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                年報
              </Button>
            </div>
          )}
        </div>

        {/* 後台管理界面 */}
        {currentView === "admin" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">工作內容管理後台</h1>
              <p className="text-xl text-gray-300">新增、編輯和管理您的工作報告內容</p>
            </div>

            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger
                  value="weekly"
                  className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  週報管理
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  月報管理
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  年報管理
                </TabsTrigger>
              </TabsList>

              {/* 週報管理 */}
              <TabsContent value="weekly" className="space-y-6">
                {/* 新增週報 */}
                <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      新增週報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-gray-900">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-300 block mb-2">週次範圍</label>
                        <Input
                          placeholder="例如：7/7-7/13"
                          className="bg-gray-700 border-gray-600 text-white"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const weekRange = (e.target as HTMLInputElement).value
                              if (weekRange && !weeklyReports.find((r) => r.weekRange === weekRange)) {
                                const newReport: WeeklyData = {
                                  weekRange,
                                  lastWeek: [],
                                  thisWeek: [],
                                  createdAt: new Date().toISOString(),
                                  updatedAt: new Date().toISOString(),
                                }
                                const updatedReports = [...weeklyReports, newReport]
                                saveWeeklyReports(updatedReports)
                                setSelectedWeek(weekRange)
                                ;(e.target as HTMLInputElement).value = ""
                              }
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          const input = document.querySelector(
                            'input[placeholder="例如：7/7-7/13"]',
                          ) as HTMLInputElement
                          const weekRange = input?.value
                          if (weekRange && !weeklyReports.find((r) => r.weekRange === weekRange)) {
                            const newReport: WeeklyData = {
                              weekRange,
                              lastWeek: [],
                              thisWeek: [],
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            }
                            const updatedReports = [...weeklyReports, newReport]
                            saveWeeklyReports(updatedReports)
                            setSelectedWeek(weekRange)
                            input.value = ""
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        新增週報
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 週報編輯 */}
                {weeklyReports.length > 0 && (
                  <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-black to-red-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        編輯週報內容
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-gray-900">
                      {/* 週次選擇 */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {weeklyReports.map((report) => (
                          <Button
                            key={report.weekRange}
                            size="sm"
                            variant={selectedWeek === report.weekRange ? "default" : "ghost"}
                            onClick={() => setSelectedWeek(report.weekRange)}
                            className={`${
                              selectedWeek === report.weekRange
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }`}
                          >
                            {report.weekRange}
                          </Button>
                        ))}
                      </div>

                      {/* 編輯內容 */}
                      {currentWeekData && (
                        <Tabs defaultValue="lastWeek" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                            <TabsTrigger
                              value="lastWeek"
                              className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                            >
                              上週工作
                            </TabsTrigger>
                            <TabsTrigger
                              value="thisWeek"
                              className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                            >
                              本週計畫
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="lastWeek" className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">上週工作內容</h3>
                              <Button
                                onClick={() => {
                                  const newItem: WorkItem = {
                                    id: Date.now().toString(),
                                    project: "",
                                    expectedWork: "",
                                    status: "pending",
                                    issues: "",
                                  }
                                  const updatedReports = weeklyReports.map((report) => {
                                    if (report.weekRange === selectedWeek) {
                                      return {
                                        ...report,
                                        lastWeek: [...report.lastWeek, newItem],
                                        updatedAt: new Date().toISOString(),
                                      }
                                    }
                                    return report
                                  })
                                  saveWeeklyReports(updatedReports)
                                }}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                新增項目
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {currentWeekData.lastWeek.map((item) => (
                                <div
                                  key={item.id}
                                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-1">專案項目</label>
                                        <Input
                                          value={item.project}
                                          onChange={(e) => {
                                            const updatedReports = weeklyReports.map((report) => {
                                              if (report.weekRange === selectedWeek) {
                                                return {
                                                  ...report,
                                                  lastWeek: report.lastWeek.map((workItem) =>
                                                    workItem.id === item.id
                                                      ? { ...workItem, project: e.target.value }
                                                      : workItem,
                                                  ),
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              }
                                              return report
                                            })
                                            saveWeeklyReports(updatedReports)
                                          }}
                                          placeholder="輸入專案名稱"
                                          className="bg-gray-700 border-gray-600 text-white"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-1">預期工作</label>
                                        <Textarea
                                          value={item.expectedWork}
                                          onChange={(e) => {
                                            const updatedReports = weeklyReports.map((report) => {
                                              if (report.weekRange === selectedWeek) {
                                                return {
                                                  ...report,
                                                  lastWeek: report.lastWeek.map((workItem) =>
                                                    workItem.id === item.id
                                                      ? { ...workItem, expectedWork: e.target.value }
                                                      : workItem,
                                                  ),
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              }
                                              return report
                                            })
                                            saveWeeklyReports(updatedReports)
                                          }}
                                          placeholder="描述預期完成的工作內容"
                                          className="bg-gray-700 border-gray-600 text-white"
                                          rows={2}
                                        />
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-1">完成狀況</label>
                                        <Select
                                          value={item.status}
                                          onValueChange={(value: any) => {
                                            const updatedReports = weeklyReports.map((report) => {
                                              if (report.weekRange === selectedWeek) {
                                                return {
                                                  ...report,
                                                  lastWeek: report.lastWeek.map((workItem) =>
                                                    workItem.id === item.id ? { ...workItem, status: value } : workItem,
                                                  ),
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              }
                                              return report
                                            })
                                            saveWeeklyReports(updatedReports)
                                          }}
                                        >
                                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="completed">已完成</SelectItem>
                                            <SelectItem value="in-progress">進行中</SelectItem>
                                            <SelectItem value="pending">待處理</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-1">遇到問題</label>
                                        <Textarea
                                          value={item.issues || ""}
                                          onChange={(e) => {
                                            const updatedReports = weeklyReports.map((report) => {
                                              if (report.weekRange === selectedWeek) {
                                                return {
                                                  ...report,
                                                  lastWeek: report.lastWeek.map((workItem) =>
                                                    workItem.id === item.id
                                                      ? { ...workItem, issues: e.target.value }
                                                      : workItem,
                                                  ),
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              }
                                              return report
                                            })
                                            saveWeeklyReports(updatedReports)
                                          }}
                                          placeholder="描述遇到的問題或困難"
                                          className="bg-gray-700 border-gray-600 text-white"
                                          rows={2}
                                        />
                                      </div>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedReports = weeklyReports.map((report) => {
                                          if (report.weekRange === selectedWeek) {
                                            return {
                                              ...report,
                                              lastWeek: report.lastWeek.filter((workItem) => workItem.id !== item.id),
                                              updatedAt: new Date().toISOString(),
                                            }
                                          }
                                          return report
                                        })
                                        saveWeeklyReports(updatedReports)
                                      }}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              {currentWeekData.lastWeek.length === 0 && (
                                <div className="text-center py-8 text-gray-400">尚未新增上週工作項目</div>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="thisWeek" className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">本週工作計畫</h3>
                              <Button
                                onClick={() => {
                                  const newItem: WorkItem = {
                                    id: Date.now().toString(),
                                    project: "",
                                    expectedWork: "",
                                    status: "pending",
                                    goals: "",
                                  }
                                  const updatedReports = weeklyReports.map((report) => {
                                    if (report.weekRange === selectedWeek) {
                                      return {
                                        ...report,
                                        thisWeek: [...report.thisWeek, newItem],
                                        updatedAt: new Date().toISOString(),
                                      }
                                    }
                                    return report
                                  })
                                  saveWeeklyReports(updatedReports)
                                }}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                新增項目
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {currentWeekData.thisWeek.map((item) => (
                                <div
                                  key={item.id}
                                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-1">專案項目</label>
                                        <Input
                                          value={item.project}
                                          onChange={(e) => {
                                            const updatedReports = weeklyReports.map((report) => {
                                              if (report.weekRange === selectedWeek) {
                                                return {
                                                  ...report,
                                                  thisWeek: report.thisWeek.map((workItem) =>
                                                    workItem.id === item.id
                                                      ? { ...workItem, project: e.target.value }
                                                      : workItem,
                                                  ),
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              }
                                              return report
                                            })
                                            saveWeeklyReports(updatedReports)
                                          }}
                                          placeholder="輸入專案名稱"
                                          className="bg-gray-700 border-gray-600 text-white"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-1">預期工作</label>
                                        <Textarea
                                          value={item.expectedWork}
                                          onChange={(e) => {
                                            const updatedReports = weeklyReports.map((report) => {
                                              if (report.weekRange === selectedWeek) {
                                                return {
                                                  ...report,
                                                  thisWeek: report.thisWeek.map((workItem) =>
                                                    workItem.id === item.id
                                                      ? { ...workItem, expectedWork: e.target.value }
                                                      : workItem,
                                                  ),
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              }
                                              return report
                                            })
                                            saveWeeklyReports(updatedReports)
                                          }}
                                          placeholder="描述預期完成的工作內容"
                                          className="bg-gray-700 border-gray-600 text-white"
                                          rows={2}
                                        />
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-1">本週目標</label>
                                        <Textarea
                                          value={item.goals || ""}
                                          onChange={(e) => {
                                            const updatedReports = weeklyReports.map((report) => {
                                              if (report.weekRange === selectedWeek) {
                                                return {
                                                  ...report,
                                                  thisWeek: report.thisWeek.map((workItem) =>
                                                    workItem.id === item.id
                                                      ? { ...workItem, goals: e.target.value }
                                                      : workItem,
                                                  ),
                                                  updatedAt: new Date().toISOString(),
                                                }
                                              }
                                              return report
                                            })
                                            saveWeeklyReports(updatedReports)
                                          }}
                                          placeholder="設定本週的具體目標"
                                          className="bg-gray-700 border-gray-600 text-white"
                                          rows={2}
                                        />
                                      </div>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedReports = weeklyReports.map((report) => {
                                          if (report.weekRange === selectedWeek) {
                                            return {
                                              ...report,
                                              thisWeek: report.thisWeek.filter((workItem) => workItem.id !== item.id),
                                              updatedAt: new Date().toISOString(),
                                            }
                                          }
                                          return report
                                        })
                                        saveWeeklyReports(updatedReports)
                                      }}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              {currentWeekData.thisWeek.length === 0 && (
                                <div className="text-center py-8 text-gray-400">尚未新增本週工作項目</div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* 月報管理 */}
              <TabsContent value="monthly" className="space-y-6">
                {/* 新增月報 */}
                <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      新增月報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-gray-900">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-300 block mb-2">月份</label>
                        <Input
                          placeholder="例如：2024-07"
                          className="bg-gray-700 border-gray-600 text-white"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const month = (e.target as HTMLInputElement).value
                              if (month && !monthlyReports.find((r) => r.month === month)) {
                                addNewMonthlyReport(month)
                                ;(e.target as HTMLInputElement).value = ""
                              }
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="例如：2024-07"]') as HTMLInputElement
                          const month = input?.value
                          if (month && !monthlyReports.find((r) => r.month === month)) {
                            addNewMonthlyReport(month)
                            input.value = ""
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        新增月報
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 月報編輯 */}
                {monthlyReports.length > 0 && (
                  <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-black to-red-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        編輯月報內容
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-gray-900">
                      {/* 月份選擇 */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {monthlyReports.map((report) => (
                          <Button
                            key={report.month}
                            size="sm"
                            variant={selectedMonth === report.month ? "default" : "ghost"}
                            onClick={() => setSelectedMonth(report.month)}
                            className={`${
                              selectedMonth === report.month
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }`}
                          >
                            {report.month}
                          </Button>
                        ))}
                      </div>

                      {/* 編輯內容 */}
                      {currentMonthData && (
                        <Tabs defaultValue="goals" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                            <TabsTrigger
                              value="goals"
                              className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                            >
                              本月目標
                            </TabsTrigger>
                            <TabsTrigger
                              value="achievements"
                              className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                            >
                              成果展示
                            </TabsTrigger>
                            <TabsTrigger
                              value="nextGoals"
                              className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                            >
                              下月目標
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="goals" className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">本月目標</h3>
                              <Button
                                onClick={() => addMonthlyGoal(selectedMonth, "goals")}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                新增目標
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {currentMonthData.goals.map((goal) => (
                                <MonthlyGoalEditor
                                  key={goal.id}
                                  goal={goal}
                                  type="goals"
                                  month={selectedMonth}
                                  onUpdate={(updates) => updateMonthlyGoal(selectedMonth, "goals", goal.id, updates)}
                                  onDelete={() => deleteMonthlyGoal(selectedMonth, "goals", goal.id)}
                                />
                              ))}

                              {currentMonthData.goals.length === 0 && (
                                <div className="text-center py-8 text-gray-400">尚未新增本月目標</div>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="achievements" className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">成果展示</h3>
                              <Button
                                onClick={() => addMonthlyAchievement(selectedMonth)}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                新增成果
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {currentMonthData.achievements.map((achievement) => (
                                <MonthlyAchievementEditor
                                  key={achievement.id}
                                  achievement={achievement}
                                  month={selectedMonth}
                                  onUpdate={(updates) =>
                                    updateMonthlyAchievement(selectedMonth, achievement.id, updates)
                                  }
                                  onDelete={() => deleteMonthlyAchievement(selectedMonth, achievement.id)}
                                />
                              ))}

                              {currentMonthData.achievements.length === 0 && (
                                <div className="text-center py-8 text-gray-400">尚未新增成果展示</div>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="nextGoals" className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">下月目標</h3>
                              <Button
                                onClick={() => addMonthlyGoal(selectedMonth, "nextMonthGoals")}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                新增目標
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {currentMonthData.nextMonthGoals.map((goal) => (
                                <MonthlyGoalEditor
                                  key={goal.id}
                                  goal={goal}
                                  type="nextMonthGoals"
                                  month={selectedMonth}
                                  onUpdate={(updates) =>
                                    updateMonthlyGoal(selectedMonth, "nextMonthGoals", goal.id, updates)
                                  }
                                  onDelete={() => deleteMonthlyGoal(selectedMonth, "nextMonthGoals", goal.id)}
                                />
                              ))}

                              {currentMonthData.nextMonthGoals.length === 0 && (
                                <div className="text-center py-8 text-gray-400">尚未新增下月目標</div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* 年報管理 */}
              <TabsContent value="yearly" className="space-y-6">
                {/* 新增年報 */}
                <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      新增年報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-gray-900">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-300 block mb-2">年份</label>
                        <Input
                          placeholder="例如：2024"
                          className="bg-gray-700 border-gray-600 text-white"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const year = (e.target as HTMLInputElement).value
                              if (year && !yearlyReports.find((r) => r.year === year)) {
                                addNewYearlyReport(year)
                                ;(e.target as HTMLInputElement).value = ""
                              }
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="例如：2024"]') as HTMLInputElement
                          const year = input?.value
                          if (year && !yearlyReports.find((r) => r.year === year)) {
                            addNewYearlyReport(year)
                            input.value = ""
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        新增年報
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center py-8 text-gray-400">
                  <p>年報編輯功能開發中...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* 報告檢視界面 */}
        {currentView === "report" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                {reportType === "weekly" && "週報"}
                {reportType === "monthly" && "月報"}
                {reportType === "yearly" && "年報"}
              </h1>
              <p className="text-xl text-gray-300">
                {reportType === "weekly" && "本週工作進度與計畫"}
                {reportType === "monthly" && "月度目標達成與成果展示"}
                {reportType === "yearly" && "年度整體表現回顧"}
              </p>
            </div>

            {/* 月報檢視 */}
            {reportType === "monthly" && (
              <>
                {monthlyReports.length > 0 && (
                  <div className="flex justify-center mb-6">
                    <div className="flex flex-wrap gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
                      {monthlyReports.map((report) => (
                        <Button
                          key={report.month}
                          size="sm"
                          variant={selectedMonth === report.month ? "default" : "ghost"}
                          onClick={() => setSelectedMonth(report.month)}
                          className={`${
                            selectedMonth === report.month
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "text-gray-300 hover:text-white hover:bg-gray-700"
                          }`}
                        >
                          {report.month}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {currentMonthData ? (
                  <>
                    {/* 月度目標達成情況 */}
                    <Card className="mb-8 shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <CheckCircle className="h-6 w-6" />
                          {selectedMonth} 月度目標達成情況
                        </CardTitle>
                        <CardDescription className="text-red-100">本月設定目標的完成狀況</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 bg-gray-900 text-white">
                        <div className="space-y-4">
                          {currentMonthData.goals.map((goal) => (
                            <div key={goal.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`h-5 w-5 rounded-full mt-0.5 flex-shrink-0 ${
                                    goal.status === "completed"
                                      ? "bg-green-500"
                                      : goal.status === "in-progress"
                                        ? "bg-yellow-500"
                                        : "bg-gray-500"
                                  }`}
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white mb-1">{goal.title}</h3>
                                  <p className="text-sm text-gray-300 mb-2">{goal.description}</p>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        goal.status === "completed"
                                          ? "border-green-500 text-green-400"
                                          : goal.status === "in-progress"
                                            ? "border-yellow-500 text-yellow-400"
                                            : "border-gray-500 text-gray-400"
                                      }`}
                                    >
                                      {goal.status === "completed"
                                        ? "已完成"
                                        : goal.status === "in-progress"
                                          ? "進行中"
                                          : "待處理"}
                                    </Badge>
                                    <span>負責人：{goal.responsible}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {currentMonthData.goals.length === 0 && (
                            <div className="text-center py-8 text-gray-400">本月尚未設定任何目標</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 月度成果展示 */}
                    <Card className="mb-8 shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <TrendingUp className="h-6 w-6" />
                          {selectedMonth} 月度成果展示
                        </CardTitle>
                        <CardDescription className="text-red-100">本月達成的具體成果與數據</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 bg-gray-900 text-white">
                        <div className="space-y-4">
                          {currentMonthData.achievements.map((achievement) => (
                            <div key={achievement.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                              <h3 className="font-semibold text-white mb-2">{achievement.title}</h3>
                              <p className="text-gray-300 mb-3">{achievement.content}</p>

                              {achievement.statistics && Object.keys(achievement.statistics).length > 0 && (
                                <div className="mb-3">
                                  <h4 className="font-semibold text-gray-200 mb-1">統計數據</h4>
                                  <ul className="list-disc list-inside text-sm text-gray-300">
                                    {Object.entries(achievement.statistics).map(([key, value]) => (
                                      <li key={key}>
                                        {key}: {value}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {achievement.details && (
                                <div>
                                  <h4 className="font-semibold text-gray-200 mb-1">詳細說明</h4>
                                  <p className="text-sm text-gray-300">{achievement.details}</p>
                                </div>
                              )}
                            </div>
                          ))}

                          {currentMonthData.achievements.length === 0 && (
                            <div className="text-center py-8 text-gray-400">本月尚未展示任何成果</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 下月目標預覽 */}
                    <Card className="mb-8 shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <Target className="h-6 w-6" />
                          {selectedMonth} 下月目標預覽
                        </CardTitle>
                        <CardDescription className="text-red-100">為下個月設定的目標與計畫</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 bg-gray-900 text-white">
                        <div className="space-y-4">
                          {currentMonthData.nextMonthGoals.map((goal) => (
                            <div key={goal.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`h-5 w-5 rounded-full mt-0.5 flex-shrink-0 ${
                                    goal.status === "completed"
                                      ? "bg-green-500"
                                      : goal.status === "in-progress"
                                        ? "bg-yellow-500"
                                        : "bg-gray-500"
                                  }`}
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white mb-1">{goal.title}</h3>
                                  <p className="text-sm text-gray-300 mb-2">{goal.description}</p>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        goal.status === "completed"
                                          ? "border-green-500 text-green-400"
                                          : goal.status === "in-progress"
                                            ? "border-yellow-500 text-yellow-400"
                                            : "border-gray-500 text-gray-400"
                                      }`}
                                    >
                                      {goal.status === "completed"
                                        ? "已完成"
                                        : goal.status === "in-progress"
                                          ? "進行中"
                                          : "待處理"}
                                    </Badge>
                                    <span>負責人：{goal.responsible}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {currentMonthData.nextMonthGoals.length === 0 && (
                            <div className="text-center py-8 text-gray-400">下月尚未設定任何目標</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 月度統計數據 */}
                    <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <BarChart3 className="h-6 w-6" />
                          {selectedMonth} 月度統計數據
                        </CardTitle>
                        <CardDescription className="text-red-100">本月的關鍵數據指標</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 bg-gray-900 text-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-200 mb-2">專案總數</h4>
                            <p className="text-3xl font-bold">{monthlyStats.totalProjects}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-200 mb-2">已完成任務</h4>
                            <p className="text-3xl font-bold">{monthlyStats.completedTasks}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-200 mb-2">進行中任務</h4>
                            <p className="text-3xl font-bold">{monthlyStats.ongoingTasks}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-200 mb-2">問題總數</h4>
                            <p className="text-3xl font-bold">{monthlyStats.totalIssues}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-200 mb-2">涵蓋週數</h4>
                            <p className="text-3xl font-bold">{monthlyStats.weeksCovered}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-200 mb-2">熱門專案</h4>
                            <ul className="list-disc list-inside">
                              {monthlyStats.topProjects.map((project, index) => (
                                <li key={index}>{project}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">請選擇要檢視的月份</div>
                )}
              </>
            )}

            {/* 週報檢視 */}
            {reportType === "weekly" && (
              <>
                {weeklyReports.length > 0 && (
                  <div className="flex justify-center mb-6">
                    <div className="flex flex-wrap gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
                      {weeklyReports.map((report) => (
                        <Button
                          key={report.weekRange}
                          size="sm"
                          variant={selectedWeek === report.weekRange ? "default" : "ghost"}
                          onClick={() => setSelectedWeek(report.weekRange)}
                          className={`${
                            selectedWeek === report.weekRange
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "text-gray-300 hover:text-white hover:bg-gray-700"
                          }`}
                        >
                          {report.weekRange}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {currentWeekData ? (
                  <>
                    {/* 上週工作內容 */}
                    <Card className="mb-8 shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <CheckCircle className="h-6 w-6" />
                          {selectedWeek} 上週工作內容
                        </CardTitle>
                        <CardDescription className="text-red-100">上週完成的工作項目</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 bg-gray-900 text-white">
                        <div className="space-y-4">
                          {currentWeekData.lastWeek.map((item) => (
                            <div key={item.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                              <h3 className="font-semibold text-white mb-1">{item.project}</h3>
                              <p className="text-sm text-gray-300 mb-2">預期工作：{item.expectedWork}</p>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    item.status === "completed"
                                      ? "border-green-500 text-green-400"
                                      : item.status === "in-progress"
                                        ? "border-yellow-500 text-yellow-400"
                                        : "border-gray-500 text-gray-400"
                                  }`}
                                >
                                  {item.status === "completed"
                                    ? "已完成"
                                    : item.status === "in-progress"
                                      ? "進行中"
                                      : "待處理"}
                                </Badge>
                              </div>
                              {item.issues && (
                                <div>
                                  <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                                  <span className="text-sm text-red-400">問題：{item.issues}</span>
                                </div>
                              )}
                            </div>
                          ))}

                          {currentWeekData.lastWeek.length === 0 && (
                            <div className="text-center py-8 text-gray-400">上週尚未新增任何工作項目</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 本週工作計畫 */}
                    <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <Target className="h-6 w-6" />
                          {selectedWeek} 本週工作計畫
                        </CardTitle>
                        <CardDescription className="text-red-100">本週預計完成的工作項目</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 bg-gray-900 text-white">
                        <div className="space-y-4">
                          {currentWeekData.thisWeek.map((item) => (
                            <div key={item.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                              <h3 className="font-semibold text-white mb-1">{item.project}</h3>
                              <p className="text-sm text-gray-300 mb-2">預期工作：{item.expectedWork}</p>
                              {item.goals && (
                                <div>
                                  <TrendingUp className="h-4 w-4 inline-block mr-1" />
                                  <span className="text-sm text-green-400">目標：{item.goals}</span>
                                </div>
                              )}
                            </div>
                          ))}

                          {currentWeekData.thisWeek.length === 0 && (
                            <div className="text-center py-8 text-gray-400">本週尚未新增任何工作計畫</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">請選擇要檢視的週次</div>
                )}
              </>
            )}

            {/* 年報檢視 */}
            {reportType === "yearly" && (
              <div className="text-center py-8 text-gray-400">
                <p>年報內容開發中...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
