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
              category: "罹病求助",
              description: "疾病求助資源：66篇",
              details: "慢性病、急症、罕見疾病等醫療資源與求助管道資訊"
            },
            {
              category: "民間社會資源",
              description: "民間組織資源：17篇",
              details: "各類民間慈善機構、社會福利組織的服務項目與申請資訊"
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
              category: "成人領域",
              description: "成人福利與權益：64篇",
              details: "成人保護、社會福利、權益保障等相關知識與服務資訊"
            },
            {
              category: "銀髮族領域",
              description: "銀髮族福利資源：57篇",
              details: "老人福利、長期照護、退休生活規劃等銀髮族相關資訊"
            },
            {
              category: "同志領域",
              description: "同志權益與福利：17篇",
              details: "LGBTQ+族群權益保障、福利資源、社會支持等專業知識"
            },
            {
              category: "婦女領域",
              description: "婦女權益與福利：29篇",
              details: "婦女保護、性別平等、婦女福利資源等相關資訊"
            },
            {
              category: "原住民領域",
              description: "原住民福利資源：19篇",
              details: "原住民傳統文化保護、福利資源、權益保障等專業知識"
            },
            {
              category: "新住民領域",
              description: "新住民福利服務：33篇",
              details: "新住民適應輔導、福利資源、權益保障等相關資訊"
            },
            {
              category: "單親領域",
              description: "單親家庭支援：38篇",
              details: "單親家庭福利、兒童照護、經濟補助等專業知識與資源"
            },
            {
              category: "親子領域",
              description: "親子關係與教育：52篇",
              details: "親職教育、親子溝通、家庭關係調適等專業知識"
            },
            {
              category: "醫療需求者領域",
              description: "醫療資源與服務：30篇",
              details: "醫療補助、醫療資源取得、病患權益等相關資訊"
            },
            {
              category: "毛小孩領域",
              description: "寵物福利與權益：25篇",
              details: "寵物飼養、動物福利、寵物醫療資源等相關知識"
            },
            {
              category: "生育懷孕",
              description: "生育與懷孕支援：38篇",
              details: "生育補助、孕期照護、新生兒福利等相關資源與知識"
            },
            {
              category: "銀髮族照顧",
              description: "銀髮照護服務：58篇",
              details: "老人照護技巧、長期照護資源、照護者支持等專業知識"
            },
            {
              category: "關係人死亡/失蹤",
              description: "喪失與失蹤支援：23篇",
              details: "喪親輔導、失蹤人口協尋、相關福利資源等資訊"
            },
            {
              category: "關係人身障",
              description: "身心障礙家屬支援：54篇",
              details: "身心障礙者家庭支持、照護資源、家屬權益等知識"
            },
            {
              category: "婚姻",
              description: "婚姻與家庭關係：37篇",
              details: "婚姻諉詢、家庭關係調適、離婚相關福利等資訊"
            },
            {
              category: "意外",
              description: "意外事故處理：51篇",
              details: "意外傷害處理、事故求助、相關福利資源等知識"
            },
            {
              category: "就業",
              description: "就業與職業發展：112篇",
              details: "就業服務、職業訓練、職場權益保障等相關資訊"
            },
            {
              category: "詐騙",
              description: "詐騙防範與求助：18篇",
              details: "詐騙識別、防範技巧、受害求助資源等專業知識"
            },
            {
              category: "關係人入監",
              description: "監所相關福利：33篇",
              details: "監所探視、受刑人福利、家庭支持資源等資訊"
            },
            {
              category: "買車",
              description: "購車相關知識：18篇",
              details: "購車貸款、車輛保險、購車補助等相關資訊"
            },
            {
              category: "買房",
              description: "購屋相關知識：33篇",
              details: "購屋貸款、房屋補助、購屋權益保障等資訊"
            },
            {
              category: "繼承",
              description: "繼承與財產規劃：24篇",
              details: "遺產繼承、財產規劃、繼承稅務等專業知識"
            },
            {
              category: "創業",
              description: "創業與經營管理：40篇",
              details: "創業貸款、經營管理、創業輔導資源等資訊"
            },
            {
              category: "退休",
              description: "退休規劃與福利：32篇",
              details: "退休金規劃、退休生活、退休福利資源等知識"
            },
            {
              category: "專業知能",
              description: "專業技能發展：62篇",
              details: "職業技能訓練、專業認證、技能提升資源等資訊"
            },
            {
              category: "工作坊",
              description: "工作坊與研習活動：6篇",
              details: "社工專業工作坊、技能研習、專業交流活動等資訊"
            },
            {
              category: "課程摘要",
              description: "課程內容摘要：14篇",
              details: "專業課程內容整理、重點摘要、學習資源等知識"
            },
            {
              category: "影片專區",
              description: "影音學習資源：6篇",
              details: "專業教學影片、案例分析影片、學習資源等內容"
            },
            {
              category: "研討會",
              description: "學術研討會資訊：3篇",
              details: "社工相關學術研討會、專業交流會議等活動資訊"
            },
            {
              category: "管理技巧",
              description: "管理與領導技能：160篇",
              details: "組織管理、團隊領導、專案管理等專業知識與技巧"
            },
            {
              category: "法規",
              description: "相關法規與政策：51篇",
              details: "社福相關法規、政策解讀、權益保障等專業資訊"
            },
            {
              category: "政策",
              description: "政策分析與解讀：20篇",
              details: "社福政策分析、政策影響評估、政策宣導等內容"
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
            "語音轉文字實習生測試持續進行"
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
            "星展志工投稿機制穩定運行（目前共15位投稿，23篇文章）",
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
        },
        {
          title: "如何清晰的敘述目標與需求",
          description: "需要更清晰地表達工作目標和需求",
          details: [
            "將大目標再切成小的階段性目標",
            "將達成結果數據化"
          ]
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* 標題區域 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            週報進度整理系統
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年9月"} 工作進度追蹤與管理
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* 導航區域 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-1">
              <Label htmlFor="month-select" className="text-base font-semibold text-gray-800 mb-3 block">
                📅 選擇月份
              </Label>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-full h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors">
                <SelectValue placeholder="選擇月份" />
              </SelectTrigger>
                <SelectContent className="rounded-xl">
                {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            <div className="flex-1">
              <Label htmlFor="week-select" className="text-base font-semibold text-gray-800 mb-3 block">
                📋 選擇週次
              </Label>
            <Select value={selectedWeek} onValueChange={handleWeekChange}>
                <SelectTrigger className="w-full h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors">
                <SelectValue placeholder="選擇週次" />
              </SelectTrigger>
                <SelectContent className="rounded-xl">
                {getWeekOptions(selectedMonth).map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

            <div className="flex gap-3">
            <Button
                variant={activeTab === "weekly" ? "default" : "outline"}
              onClick={() => handleTabChange("weekly")}
                className={`h-12 px-8 text-lg font-semibold rounded-xl transition-all duration-200 ${
                activeTab === "weekly"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
                📊 週報
            </Button>
            <Button
                variant={activeTab === "monthly" ? "default" : "outline"}
              onClick={() => handleTabChange("monthly")}
                className={`h-12 px-8 text-lg font-semibold rounded-xl transition-all duration-200 ${
                activeTab === "monthly"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50"
              }`}
            >
                📈 月度摘要
            </Button>
            </div>
          </div>
        </div>

        {/* 內容區域 */}
          {activeTab === "weekly" && (
          <div className="space-y-8">
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                                    <div>
                    <CardTitle className="text-2xl">週報內容</CardTitle>
                    <CardDescription className="text-blue-100">
                      {selectedWeek} 的工作內容
                    </CardDescription>
                      </div>
                    </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 text-lg">這裡將顯示週報的詳細內容...</p>
                  </CardContent>
                </Card>
          </div>
          )}

          {activeTab === "monthly" && (
            <div className="space-y-8">
              {/* 儀表板樣式月度摘要 */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* 儀表板標題 */}
                <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white bg-opacity-10 rounded-2xl">
                      <BarChart3 className="h-12 w-12" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold mb-2">
                        {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年9月"} 工作儀表板
                      </h2>
                      <p className="text-blue-100 text-xl">
                        完整的工作進度追蹤與數據分析
                      </p>
                    </div>
                  </div>
                </div>

                {/* KPI 指標區域 */}
                <div className="p-8 bg-gray-50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                    關鍵績效指標 (KPI)
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">總計</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{getDisplayStats().totalProjects}</div>
                      <div className="text-sm text-gray-600">總專案數</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">完成</span>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">{getDisplayStats().completedProjects}</div>
                      <div className="text-sm text-gray-600">已完成項目</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-yellow-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">進行中</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{getDisplayStats().inProgressProjects}</div>
                      <div className="text-sm text-gray-600">進行中項目</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">待處理</span>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-1">{getDisplayStats().pendingProjects}</div>
                      <div className="text-sm text-gray-600">待處理項目</div>
                    </div>
                  </div>
                </div>

                {/* 主要成就展示 */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                    主要工作成果
                  </h3>
                  <div className="space-y-6">
                    {getDisplayAchievements().map((achievement, index) => (
                      <div key={index} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full flex-shrink-0">
                            <CheckCircle className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h4>
                            <p className="text-base text-gray-600 mb-4 leading-relaxed">{achievement.description}</p>
                            {Array.isArray(achievement.details) && (
                              <div className="space-y-3">
                                {achievement.details.map((detail, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                                      <span className="text-blue-600 font-bold text-sm">{idx + 1}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{detail}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            {/* 月度執行狀況 */}
              {monthlySummary && (
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <TrendingUp className="h-8 w-8" />
                      </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">
                        {monthOptions.find(option => option.value === selectedMonth)?.label.replace('2025年', '')}月份執行狀況
                      </CardTitle>
                      <CardDescription className="text-green-100 text-lg mt-1">
                        {monthOptions.find(option => option.value === selectedMonth)?.label}達成的重要成果
                    </CardDescription>
                    </div>
                  </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-8">
                      {getDisplayAchievements().map((achievement, index) => (
                        <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                          {/* 主要成就標題 */}
                          <div className="p-6 border-b border-green-100">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
                                <CheckCircle className="h-6 w-6 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                                {achievement.title}
                              </h3>
                                      </div>
                            <p className="text-lg text-gray-700 leading-relaxed ml-13">
                              {achievement.description}
                            </p>
                                </div>

                          {/* 詳細內容區域 */}
                          <div className="p-6">
                            <div className="ml-13">
                              {Array.isArray(achievement.details) ? (
                                <div className="space-y-4">
                                  {achievement.details.map((detail, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-100 hover:border-green-200 transition-colors">
                                      <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-0.5">
                                        <span className="text-green-600 font-bold text-sm">{idx + 1}</span>
                              </div>
                                <div className="flex-1">
                                        <p className="text-lg text-gray-700 leading-relaxed">{detail}</p>
                                      </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                <div className="p-4 bg-white rounded-lg border border-green-100">
                                  <p className="text-gray-700 leading-relaxed">{achievement.details}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* 語音轉文字辭庫更新統計 */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                    <Mic className="h-10 w-10" />
                      </div>
                  <div>
                    <CardTitle className="text-4xl font-bold">語音轉文字辭庫更新統計</CardTitle>
                    <CardDescription className="text-blue-100 text-xl mt-2">
                      辭庫成長趨勢與數據統計
                    </CardDescription>
                              </div>
                                      </div>
              </CardHeader>
              <CardContent className="p-10 bg-white">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-2xl mb-6">
                    <span className="text-5xl font-bold text-white">{editVoiceToTextData[editVoiceToTextData.length - 1]?.total || 0}</span>
                                </div>
                  <div className="text-3xl font-semibold text-gray-800 mb-3">9月底辭庫總數</div>
                  <div className="text-2xl text-gray-600 leading-relaxed">
                    辭庫從7月底的350個擴充至9月底的940個<br />
                    <span className="font-bold text-blue-600 text-2xl">淨成長590個，增長率達169%</span>
                              </div>
                    </div>
                  </CardContent>
                </Card>

            {/* 知識庫擴充統計 */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                    <Database className="h-10 w-10" />
                      </div>
                  <div>
                    <CardTitle className="text-4xl font-bold">知識庫擴充統計</CardTitle>
                    <CardDescription className="text-purple-100 text-xl mt-2">
                      知識庫內容擴充與品質提升統計
                    </CardDescription>
                  </div>
                </div>
                  </CardHeader>
              <CardContent className="p-10 bg-white">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full shadow-2xl mb-6">
                    <span className="text-5xl font-bold text-white">942</span>
                            </div>
                  <div className="text-3xl font-semibold text-gray-800 mb-3">9月底總文章數</div>
                  <div className="text-2xl text-gray-600 leading-relaxed">
                    知識庫從8月的757篇增加到9月的942篇<br />
                    <span className="font-bold text-purple-600 text-2xl">月增185篇，增長率達24.4%</span>
                        </div>
                    </div>
                  </CardContent>
                </Card>

            {/* 工作困難與挑戰 */}
            {getDisplayChallenges().length > 0 && (
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                      <AlertTriangle className="h-10 w-10" />
        </div>
                    <div>
                      <CardTitle className="text-4xl font-bold">工作困難與挑戰</CardTitle>
                      <CardDescription className="text-orange-100 text-xl mt-2">
                        工作過程中遇到的主要困難與挑戰
                      </CardDescription>
      </div>
    </div>
      </CardHeader>
                <CardContent className="p-8 bg-white">
                  <div className="space-y-6">
                    {getDisplayChallenges().map((challenge, index) => (
                      <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 shadow-sm">
                        <div className="p-6 border-b border-orange-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full">
                              <AlertTriangle className="h-6 w-6 text-white" />
          </div>
                            <h4 className="text-2xl font-bold text-gray-800">{challenge.title}</h4>
          </div>
                          <p className="text-lg text-gray-700 leading-relaxed ml-13">
                            {challenge.description}
                          </p>
          </div>
                        {challenge.details && (
                          <div className="p-6">
                            <div className="ml-13">
                              {Array.isArray(challenge.details) ? (
                                <div className="space-y-3">
                                  {challenge.details.map((detail, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-100">
                                      <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full flex-shrink-0 mt-0.5">
                                        <span className="text-orange-600 font-bold text-sm">{idx + 1}</span>
        </div>
                                      <p className="text-lg text-gray-700 leading-relaxed">{detail}</p>
          </div>
                                  ))}
                </div>
              ) : (
                                <div className="p-4 bg-white rounded-lg border border-orange-100">
                                  <p className="text-gray-700 leading-relaxed">{challenge.details}</p>
                    </div>
                              )}
                    </div>
                  </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
            )}

            {/* 下月目標與規劃 */}
            {getDisplayGoals().length > 0 && (
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                      <Target className="h-10 w-10" />
                    </div>
                    <div>
                      <CardTitle className="text-4xl font-bold">下月目標與規劃</CardTitle>
                      <CardDescription className="text-blue-100 text-xl mt-2">
                        下個月的工作重點與目標規劃
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 bg-white">
                  <div className="space-y-4">
                    {getDisplayGoals().map((goal, index) => (
                      <div key={index} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-full flex-shrink-0">
                              <Target className="h-6 w-6 text-white" />
                  </div>
                            <div className="flex-1">
                              <p className="text-xl font-medium text-gray-800 leading-relaxed">{goal}</p>
                  </div>
                </div>
              </div>
                        </div>
                    ))}
                      </div>
                </CardContent>
              </Card>
            )}
                        </div>
                      )}
                    </div>
                </div>
  )
}
