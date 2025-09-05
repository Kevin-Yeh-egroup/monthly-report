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
  // 新增手動編輯字段
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

// CSV 匯出匯入輔助函數
const escapeCSV = (str: string): string => {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const exportWeeklyReportsToCSV = (weeklyReports: WeeklyReport[]): string => {
  const headers = ['週次', '專案ID', '專案名稱', '類別', '預期工作', '狀態', '完成狀況', '問題', '備註']
  const rows = [headers.join(',')]
  
  weeklyReports.forEach(report => {
    report.projects.forEach(project => {
      const row = [
        escapeCSV(report.weekRange),
        escapeCSV(project.id),
        escapeCSV(project.name),
        escapeCSV(project.category),
        escapeCSV(project.expectedWork),
        escapeCSV(project.status),
        escapeCSV(project.completion),
        escapeCSV(project.issues || ''),
        escapeCSV(project.notes || '')
      ]
      rows.push(row.join(','))
    })
  })
  
  // 添加 UTF-8 BOM 確保 Excel 正確識別編碼
  const BOM = '\uFEFF'
  return BOM + rows.join('\n')
}

const exportVoiceToTextToCSV = (voiceToTextData: { week: string; total: number; new: number }[]): string => {
  const headers = ['週次', '辭庫總數', '新增數量']
  const rows = [headers.join(',')]
  
  voiceToTextData.forEach(data => {
    const row = [
      escapeCSV(data.week),
      data.total.toString(),
      data.new.toString()
    ]
    rows.push(row.join(','))
  })
  
  // 添加 UTF-8 BOM 確保 Excel 正確識別編碼
  const BOM = '\uFEFF'
  return BOM + rows.join('\n')
}

const exportKnowledgeBaseToCSV = (knowledgeBaseData: { category: string; description: string; details: string }[]): string => {
  const headers = ['分類', '描述', '詳細說明']
  const rows = [headers.join(',')]
  
  knowledgeBaseData.forEach(data => {
    const row = [
      escapeCSV(data.category),
      escapeCSV(data.description),
      escapeCSV(data.details)
    ]
    rows.push(row.join(','))
  })
  
  // 添加 UTF-8 BOM 確保 Excel 正確識別編碼
  const BOM = '\uFEFF'
  return BOM + rows.join('\n')
}

const importWeeklyReportsFromCSV = (csvContent: string): WeeklyReport[] | null => {
  try {
    // 移除 UTF-8 BOM 如果存在
    let content = csvContent
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1)
    }
    
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null
    
    const headers = lines[0].split(',').map(h => h.trim())
    const weeklyReportsMap = new Map<string, Project[]>()
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      if (values.length >= 6) {
        const weekRange = values[0]
        const project: Project = {
          id: values[1],
          name: values[2],
          category: values[3],
          expectedWork: values[4],
          status: values[5] as "completed" | "in-progress" | "pending",
          completion: values[6] || '',
          issues: values[7] || undefined,
          notes: values[8] || undefined
        }
        
        if (!weeklyReportsMap.has(weekRange)) {
          weeklyReportsMap.set(weekRange, [])
        }
        weeklyReportsMap.get(weekRange)!.push(project)
      }
    }
    
    const weeklyReports: WeeklyReport[] = []
    weeklyReportsMap.forEach((projects, weekRange) => {
      weeklyReports.push({
        weekRange,
        projects
      })
    })
    
    return weeklyReports
  } catch (error) {
    console.error('CSV 匯入錯誤:', error)
    return null
  }
}

const importVoiceToTextFromCSV = (csvContent: string): { week: string; total: number; new: number }[] | null => {
  try {
    // 移除 UTF-8 BOM 如果存在
    let content = csvContent
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1)
    }
    
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null
    
    const voiceToTextData: { week: string; total: number; new: number }[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      if (values.length >= 3) {
        voiceToTextData.push({
          week: values[0],
          total: parseInt(values[1]) || 0,
          new: parseInt(values[2]) || 0
        })
      }
    }
    
    return voiceToTextData
  } catch (error) {
    console.error('CSV 匯入錯誤:', error)
    return null
  }
}

const importKnowledgeBaseFromCSV = (csvContent: string): { category: string; description: string; details: string }[] | null => {
  try {
    // 移除 UTF-8 BOM 如果存在
    let content = csvContent
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1)
    }
    
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null
    
    const knowledgeBaseData: { category: string; description: string; details: string }[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      if (values.length >= 3) {
        knowledgeBaseData.push({
          category: values[0],
          description: values[1],
          details: values[2]
        })
      }
    }
    
    return knowledgeBaseData
  } catch (error) {
    console.error('CSV 匯入錯誤:', error)
    return null
  }
}

// 預設數據
const defaultWeeklyReports: WeeklyReport[] = [
  {
    weekRange: "7/7-7/13",
    projects: [
      {
        id: "1",
        name: "語音轉文字實習生測試",
        category: "語音轉文字",
        expectedWork: "語音轉文字實習生測試",
        status: "completed",
        completion: "完成實習生測試流程",
        issues: "需要持續優化測試流程",
      },
      {
        id: "2",
        name: "Gemini 2.5 flash版本測試",
        category: "語音轉文字",
        expectedWork: "測試Gemini 2.5 flash版本",
        status: "completed",
        completion: "版本測試完成",
        issues: "版本穩定性需要持續監控",
      },
      {
        id: "3",
        name: "課程摘要確認",
        category: "語音轉文字",
        expectedWork: "讓Ivy確認的課程摘要：完成19篇",
        status: "completed",
        completion: "完成19篇課程摘要確認",
        issues: "部分摘要需要進一步校對",
      },
      {
        id: "4",
        name: "自定義辭庫更新",
        category: "語音轉文字",
        expectedWork: "自定義辭庫更新",
        status: "completed",
        completion: "辭庫更新完成",
        issues: "辭庫維護需要定期更新",
      },
      {
        id: "5",
        name: "語音轉文字逐字稿轉譯狀況回報",
        category: "語音轉文字",
        expectedWork: "語音轉文字逐字稿轉譯狀況回報泰元",
        status: "completed",
        completion: "回報完成",
        issues: "回報格式需要標準化",
      },
      {
        id: "6",
        name: "家庭經濟圖譜寵物選項",
        category: "家庭經濟圖譜",
        expectedWork: "增加寵物選項",
        status: "completed",
        completion: "完成寵物項目",
        issues: "功能測試需要更多使用者回饋",
      },
      {
        id: "7",
        name: "好理家知識庫擴充與工具開發",
        category: "好理家知識庫",
        expectedWork: "好理家在知識庫擴充與工具開發工作計畫",
        status: "in-progress",
        completion: "社工經驗人力（3人）、行政人力（3人）、技術開發組：先博+泰元、外部測試人力",
        notes: "個案處理進度：于沁(1/47)、雅筑(2/52)、雅茵(1/38)、資旻(1/42)、Kevin(2/43)",
      },
      {
        id: "8",
        name: "知識庫社福資源資料庫",
        category: "知識庫",
        expectedWork: "新增社福資源資料庫",
        status: "in-progress",
        completion: "知識庫補足清單(規劃完成，執行中)",
      },
    ],
  },
  {
    weekRange: "7/14-7/20",
    projects: [
      {
        id: "9",
        name: "語音轉文字實習生測試",
        category: "語音轉文字",
        expectedWork: "語音轉文字實習生測試",
        status: "completed",
        completion: "測試流程需要進一步優化",
      },
      {
        id: "10",
        name: "Gemini 2.5 flash版本測試",
        category: "語音轉文字",
        expectedWork: "測試Gemini 2.5 flash版本",
        status: "completed",
        completion: "版本穩定性持續監控中",
      },
      {
        id: "11",
        name: "課程摘要確認",
        category: "語音轉文字",
        expectedWork: "讓Ivy確認的課程摘要：共30篇，新增11篇",
        status: "completed",
        completion: "摘要品質需要持續提升",
      },
      {
        id: "12",
        name: "自定義辭庫更新",
        category: "語音轉文字",
        expectedWork: "自定義辭庫更新：共203個，新增6個",
        status: "completed",
        completion: "辭庫維護需要定期更新",
      },
      {
        id: "13",
        name: "語音轉文字逐字稿轉譯狀況回報",
        category: "語音轉文字",
        expectedWork: "語音轉文字逐字稿轉譯狀況回報泰元",
        status: "completed",
        completion: "回報格式已標準化",
      },
      {
        id: "14",
        name: "財務試算模擬器/V0",
        category: "財務試算模擬器",
        expectedWork: "7月新增12項工具",
        status: "completed",
        completion: "夥伴需求功能試做、財務利率回推計算器、派課系統、小編投稿說明",
      },
      {
        id: "15",
        name: "好理家知識庫擴充與工具開發",
        category: "好理家知識庫",
        expectedWork: "好理家在知識庫擴充與工具開發工作計畫",
        status: "in-progress",
        completion: "社工經驗人力（4人）、行政人力（1人）、技術開發組：先博+泰元、外部測試人力",
        notes: "個案處理進度：于沁(47/47)、雅筑(32/52)、雅茵(2/38)、資旻(11/42)、Kevin(43/43)",
      },
      {
        id: "16",
        name: "工讀生案例分類知識庫補充",
        category: "知識庫",
        expectedWork: "工讀生案例分類知識庫補充清單",
        status: "completed",
        completion: "補充文章135篇",
      },
      {
        id: "17",
        name: "知識庫文章新增",
        category: "知識庫",
        expectedWork: "新增文章：文章7篇",
        status: "completed",
        completion: "文章品質需要提升",
      },
      {
        id: "18",
        name: "上架審核通過文章",
        category: "知識庫",
        expectedWork: "上架審核通過文章",
        status: "completed",
        completion: "審核流程需要優化",
      },
      {
        id: "19",
        name: "工研院測試",
        category: "測試",
        expectedWork: "由工讀生透過好理家在AI問答測試",
        status: "completed",
        completion: "已測試完成，周一分析整理後可給泰元",
        notes: "測試網址：https://www.familyfinhealth.com/chat",
      },
    ],
  },
  {
    weekRange: "7/21-7/27",
    projects: [
      {
        id: "20",
        name: "語音轉文字實習生測試",
        category: "語音轉文字",
        expectedWork: "語音轉文字實習生測試",
        status: "completed",
        completion: "測試流程已優化",
      },
      {
        id: "21",
        name: "Gemini 2.5 flash版本測試",
        category: "語音轉文字",
        expectedWork: "測試Gemini 2.5 flash版本",
        status: "completed",
        completion: "版本穩定性良好",
      },
      {
        id: "22",
        name: "課程摘要確認",
        category: "語音轉文字",
        expectedWork: "讓Ivy確認的課程摘要：共50篇，新增19篇",
        status: "completed",
        completion: "摘要品質持續提升",
      },
      {
        id: "23",
        name: "自定義辭庫更新",
        category: "語音轉文字",
        expectedWork: "自定義辭庫更新：共309個，新增97個",
        status: "completed",
        completion: "辭庫維護正常進行",
      },
      {
        id: "24",
        name: "工讀生語音轉文字測試",
        category: "語音轉文字",
        expectedWork: "工讀生完成31篇語音轉文字測試",
        status: "completed",
        completion: "測試結果需要分析",
      },
      {
        id: "25",
        name: "語音轉文字逐字稿轉譯狀況回報",
        category: "語音轉文字",
        expectedWork: "語音轉文字逐字稿轉譯狀況回報泰元",
        status: "completed",
        completion: "回報流程已標準化",
      },
      {
        id: "26",
        name: "財務試算模擬器/V0",
        category: "財務試算模擬器",
        expectedWork: "7月新增12項工具",
        status: "completed",
        completion: "工具功能完善",
      },
      {
        id: "27",
        name: "夥伴需求功能試做",
        category: "財務試算模擬器",
        expectedWork: "夥伴需求功能試做",
        status: "completed",
        completion: "功能已根據回饋調整",
      },
      {
        id: "28",
        name: "加班費試算",
        category: "財務試算模擬器",
        expectedWork: "加班費試算",
        status: "completed",
        completion: "計算邏輯需要驗證",
      },
      {
        id: "29",
        name: "特休假試算",
        category: "財務試算模擬器",
        expectedWork: "特休假試算",
        status: "completed",
        completion: "試算規則需要確認",
      },
      {
        id: "30",
        name: "債務警示工具",
        category: "財務試算模擬器",
        expectedWork: "債務警示工具",
        status: "completed",
        completion: "警示邏輯需要優化",
      },
      {
        id: "31",
        name: "知識庫社福資源資料庫",
        category: "知識庫",
        expectedWork: "新增社福資源資料庫",
        status: "in-progress",
        completion: "資料庫結構持續優化",
      },
      {
        id: "32",
        name: "知識庫文章新增",
        category: "知識庫",
        expectedWork: "新增文章：文章7篇",
        status: "completed",
        completion: "文章品質持續提升",
      },
      {
        id: "33",
        name: "上架審核通過文章",
        category: "知識庫",
        expectedWork: "上架審核通過文章",
        status: "completed",
        completion: "審核流程已優化",
      },
      {
        id: "34",
        name: "個人財務健康檢測報告",
        category: "個人財務健康檢測報告",
        expectedWork: "1.定義指標 2.做出呈現樣式",
        status: "completed",
        completion: "指標定義需要進一步完善",
      },
      {
        id: "35",
        name: "個人財務健康檢測報告引導式問句",
        category: "個人財務健康檢測報告",
        expectedWork: "新增引導式問句",
        status: "completed",
        completion: "問句設計需要優化",
      },
    ],
  },
  {
    weekRange: "7/28-8/3",
    projects: [
      {
        id: "36",
        name: "語音轉文字實習生測試",
        category: "語音轉文字",
        expectedWork: "語音轉文字實習生測試",
        status: "completed",
        completion: "測試流程持續優化中",
      },
      {
        id: "37",
        name: "Gemini 2.5 flash版本測試",
        category: "語音轉文字",
        expectedWork: "測試Gemini 2.5 flash版本",
        status: "completed",
        completion: "版本穩定性良好，持續監控中",
      },
      {
        id: "38",
        name: "課程摘要確認",
        category: "語音轉文字",
        expectedWork: "讓Ivy確認的課程摘要：共60篇，新增19篇",
        status: "completed",
        completion: "完成19篇課程摘要確認，總計達60篇",
      },
      {
        id: "39",
        name: "自定義辭庫更新",
        category: "語音轉文字",
        expectedWork: "自定義辭庫更新：共350個，本周新增41個",
        status: "completed",
        completion: "辭庫更新完成，總數達350個，本周新增41個",
      },
      {
        id: "40",
        name: "工讀生語音轉文字測試",
        category: "語音轉文字",
        expectedWork: "工讀生本週完成14篇語音轉文字測試，總共完成45篇",
        status: "completed",
        completion: "工讀生本週完成14篇測試，累計完成45篇",
      },
      {
        id: "41",
        name: "脫貧處遇課程文章",
        category: "語音轉文字",
        expectedWork: "提供脫貧處遇課程文章4篇",
        status: "completed",
        completion: "完成4篇脫貧處遇課程文章",
      },
      {
        id: "42",
        name: "語音轉文字逐字稿轉譯狀況回報",
        category: "語音轉文字",
        expectedWork: "語音轉文字逐字稿轉譯狀況回報泰元",
        status: "completed",
        completion: "回報完成，流程已標準化",
      },
      {
        id: "43",
        name: "財務試算模擬器/V0",
        category: "財務試算模擬器",
        expectedWork: "7月新增12項工具",
        status: "completed",
        completion: "7月新增12項工具已完成",
      },
      {
        id: "44",
        name: "夥伴需求功能試做",
        category: "財務試算模擬器",
        expectedWork: "夥伴需求功能試做",
        status: "pending",
        completion: "本週未執行",
        issues: "需要重新安排執行時間",
      },
      {
        id: "45",
        name: "知識庫社福資源資料庫",
        category: "知識庫",
        expectedWork: "新增社福資源資料庫",
        status: "in-progress",
        completion: "知識庫補足清單持續執行中",
      },
      {
        id: "46",
        name: "知識庫文章補充",
        category: "知識庫",
        expectedWork: "補充文章各領域進度",
        status: "in-progress",
        completion: "生育懷孕(雅筑12/12)、關係人死亡/失蹤(資旻0/13)、婚姻(于沁0/12)、關係人入監(資旻0/12)、繼承(于沁0/13)、退休(妤臻0/14)",
        notes: "跨議題基礎知能(0/14)、原住民領域(雅茵2/12)、新住民領域(0/13)、同志領域(雅筑12/12)、婦女領域(于沁0/13)、親子領域(資旻0/12)、單親領域(0/13)、跨族群整合知能(雅筑8/8)、毛小孩飼主領域(妤臻20/26)",
      },
      {
        id: "47",
        name: "上架審核通過文章",
        category: "知識庫",
        expectedWork: "上架審核通過文章",
        status: "completed",
        completion: "審核流程持續進行",
      },
      {
        id: "48",
        name: "反饋回覆流程訂定",
        category: "知識庫",
        expectedWork: "反饋回覆流程訂定",
        status: "completed",
        completion: "流程訂定完成",
      },
      {
        id: "49",
        name: "個人財務健康檢測報告",
        category: "個人財務健康檢測報告",
        expectedWork: "1.定義指標 2.做出呈現樣式 3.對答式問句延伸",
        status: "completed",
        completion: "指標定義和呈現樣式已完成，對答式問句延伸完成",
      },
      {
        id: "50",
        name: "個人財務健康檢測報告對話式問答",
        category: "個人財務健康檢測報告",
        expectedWork: "對話式問答案例-個人財務風險快篩指標-月收入>月支出",
        status: "completed",
        completion: "對話式問答案例完成，包含個人財務風險快篩指標",
      },
    ],
  },
  // 8月份資料
  {
    weekRange: "8/4-8/10",
    projects: [
      {
        id: "august_1",
        name: "語音轉文字實習生測試",
        category: "語音轉文字",
        expectedWork: "測試Gemini 2.5 flash版本",
        status: "completed",
        completion: "工讀生本週完成14篇語音轉文字測試，總共完成45篇",
      },
      {
        id: "august_2",
        name: "課程摘要確認",
        category: "語音轉文字",
        expectedWork: "讓Ivy確認的課程摘要",
        status: "completed",
        completion: "共68篇，新增19篇",
      },
      {
        id: "august_3",
        name: "自定義辭庫更新",
        category: "語音轉文字",
        expectedWork: "辭庫維護與擴充",
        status: "completed",
        completion: "共350個，本週新增41個",
      },
      {
        id: "august_4",
        name: "財務試算模擬器工具開發",
        category: "財務試算模擬器/V0",
        expectedWork: "新增工具功能",
        status: "completed",
        completion: "7月新增12項工具",
      },
      {
        id: "august_5",
        name: "知識庫管理",
        category: "知識庫",
        expectedWork: "新增資料庫內容",
        status: "completed",
        completion: "新增社福資源資料庫",
      },
      {
        id: "august_6",
        name: "個人財務健康檢測報告",
        category: "個人財務健康檢測報告",
        expectedWork: "定義指標、做出呈現樣式",
        status: "completed",
        completion: "完成指標定義、呈現樣式、對答式問句延伸",
      },
    ],
  },
  {
    weekRange: "8/11-8/17",
    projects: [
      {
        id: "august_7",
        name: "語音轉文字實習生測試",
        category: "語音轉文字",
        expectedWork: "測試Gemini 2.5 flash版本",
        status: "completed",
        completion: "工讀生本週完成11篇語音轉文字測試，總共完成73篇",
      },
      {
        id: "august_8",
        name: "課程摘要確認",
        category: "語音轉文字",
        expectedWork: "讓Ivy確認的課程摘要",
        status: "completed",
        completion: "共69篇，新增1篇",
      },
      {
        id: "august_9",
        name: "自定義辭庫更新",
        category: "語音轉文字",
        expectedWork: "辭庫維護與擴充",
        status: "completed",
        completion: "共361個辭彙",
      },
      {
        id: "august_10",
        name: "財務試算模擬器開發",
        category: "財務試算模擬器/V0",
        expectedWork: "功能開發測試",
        status: "completed",
        completion: "本週製作1項，工讀生雅筑加入測試",
      },
      {
        id: "august_11",
        name: "知識庫文章補充",
        category: "知識庫",
        expectedWork: "補充文章內容",
        status: "completed",
        completion: "關係人入監、親子領域完成，文章共757篇",
      },
      {
        id: "august_12",
        name: "教育訓練專案",
        category: "新增專案",
        expectedWork: "工讀生教育訓練、星展基金會訓練",
        status: "completed",
        completion: "制定教育訓練計畫，完成訓練大綱及簡報製作",
      },
    ],
  },
  {
    weekRange: "8/18-8/24",
    projects: [
      {
        id: "august_13",
        name: "語音轉文字持續測試",
        category: "語音轉文字",
        expectedWork: "課程摘要優化",
        status: "completed",
        completion: "共72篇，新增3篇",
      },
      {
        id: "august_14",
        name: "自定義辭庫擴充",
        category: "語音轉文字",
        expectedWork: "辭庫維護與擴充",
        status: "completed",
        completion: "共393個辭彙",
      },
      {
        id: "august_15",
        name: "財務試算模擬器優化",
        category: "財務試算模擬器/V0",
        expectedWork: "功能優化",
        status: "completed",
        completion: "8項小工具修正及上架準備",
      },
      {
        id: "august_16",
        name: "知識庫品質提升",
        category: "知識庫",
        expectedWork: "文章審核與檢查",
        status: "completed",
        completion: "同志領域12篇完成，初步審核工讀生生成文章",
      },
      {
        id: "august_17",
        name: "電子報製作",
        category: "知識庫",
        expectedWork: "電子報第一期",
        status: "completed",
        completion: "電子報第一期初稿完成，內容確認中",
      },
      {
        id: "august_18",
        name: "2025 IT Matters AI Selected獎",
        category: "新增專案",
        expectedWork: "資料整理蒐集",
        status: "in-progress",
        completion: "已指定主要窗口，資料整理蒐集進行中",
      },
    ],
  },
]

export default function ReportDashboard() {
  // 從 localStorage 讀取保存的資料，如果沒有則使用預設資料
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(defaultWeeklyReports)
  
  const [selectedWeek, setSelectedWeek] = useState<string>("8/4-8/10")
  const [activeTab, setActiveTab] = useState<string>("weekly")
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-08")
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null)
  
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
    { week: "6月", total: 170, new: 0 },
    { week: "7/7-7/13", total: 170, new: 0 },
    { week: "7/14-7/20", total: 203, new: 6 },
    { week: "7/21-7/27", total: 309, new: 97 },
    { week: "7/28-8/3", total: 350, new: 41 },
    { week: "8/4-8/10", total: 350, new: 0 },
    { week: "8/11-8/17", total: 361, new: 11 },
    { week: "8/18-8/24", total: 393, new: 32 }
  ])
  
  // 知識庫編輯狀態
  const [isKnowledgeBaseEditing, setIsKnowledgeBaseEditing] = useState(false)
  const [editKnowledgeBaseData, setEditKnowledgeBaseData] = useState([
    {
      category: "社福資源資料庫",
      description: "新增社福資源資料庫",
      details: "建立完整的社福資源分類體系，包含各類補助、服務項目等"
    },
    {
      category: "文章上架狀況",
      description: "上架審核通過文章：目前共757篇",
      details: "持續審核並上架高品質文章，8月份達到重要里程碑"
    },
    {
      category: "知識庫文章補充",
      description: "完成多個領域文章補充",
      details: "關係人入監(12/12)、親子領域(12/12)、同志領域(12篇)等領域已完成，原住民領域進行中(2/12)"
    },
    {
      category: "電子報製作",
      description: "電子報第一期初稿完成",
      details: "電子報第一期初稿完成，內容給Ivy素菁確認中，標誌著內容產出能力的重要提升"
    },
    {
      category: "品質管控機制",
      description: "建立完整的審核和檢查機制",
      details: "完成工讀生生成文章初步審核、提供知識庫生成領域建議、完成知識庫文章內容深度檢查"
    },
    {
      category: "熱門文章排行",
      description: "8月第二週文章瀏覽排行TOP 3",
      details: "1. 運用網絡資源強化經濟輔導知能，助弱勢家庭邁向財務自立(55次) 2. 從督導視角看經濟輔導—如何提供社工經濟處遇的專業支持？(38次) 3. 家庭經濟輔導經驗分享與風險評估-課程摘要(29次)"
    }
  ])

  // 添加調試日誌
  const handleWeekChange = (week: string) => {
    console.log("週次變更:", week)
    setSelectedWeek(week)
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedWeek', week)
    }
  }

  const handleTabChange = (tab: string) => {
    console.log("標籤變更:", tab)
    setActiveTab(tab)
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', tab)
    }
  }

  const handleMonthChange = (month: string) => {
    console.log("月份變更:", month)
    setSelectedMonth(month)
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedMonth', month)
    }
    // 當月份變更時，重置週次選擇為該月份的第一週
    const weekOptions = getWeekOptions(month)
    if (weekOptions.length > 0) {
      const firstWeek = weekOptions[0].value
      setSelectedWeek(firstWeek)
      // 保存新的週次選擇
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedWeek', firstWeek)
      }
    }
  }

  // 調試：檢查載入的資料
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 調試：檢查所有保存的資料
      console.log('=== 載入的 localStorage 資料 ===')
      console.log('weeklyReports:', localStorage.getItem('weeklyReports'))
      console.log('voiceToTextData:', localStorage.getItem('voiceToTextData'))
      console.log('knowledgeBaseData:', localStorage.getItem('knowledgeBaseData'))
      console.log('editStats:', localStorage.getItem('editStats'))
      console.log('editAchievements:', localStorage.getItem('editAchievements'))
      console.log('editGoals:', localStorage.getItem('editGoals'))
      console.log('editChallenges:', localStorage.getItem('editChallenges'))
      console.log('monthlySummary:', localStorage.getItem('monthlySummary'))
      
      // 調試：檢查當前狀態
      console.log('=== 當前狀態 ===')
      console.log('selectedWeek:', selectedWeek)
      console.log('selectedMonth:', selectedMonth)
      console.log('weeklyReports length:', weeklyReports.length)
      console.log('editVoiceToTextData length:', editVoiceToTextData.length)
      console.log('editKnowledgeBaseData length:', editKnowledgeBaseData.length)
      console.log('monthlySummary:', monthlySummary)
    }
  }, [])

  // 自動保存編輯狀態
  useEffect(() => {
    if (typeof window !== 'undefined' && isEditing) {
      localStorage.setItem('editStats', JSON.stringify(editStats))
      localStorage.setItem('editAchievements', JSON.stringify(editAchievements))
      localStorage.setItem('editChallenges', JSON.stringify(editChallenges))
      localStorage.setItem('editGoals', JSON.stringify(editGoals))
    }
  }, [editStats, editAchievements, editChallenges, editGoals, isEditing])

  // 頁面卸載前保存資料
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (typeof window !== 'undefined') {
        // 保存所有當前資料
        localStorage.setItem('weeklyReports', JSON.stringify(weeklyReports))
        localStorage.setItem('voiceToTextData', JSON.stringify(editVoiceToTextData))
        localStorage.setItem('knowledgeBaseData', JSON.stringify(editKnowledgeBaseData))
        
        if (monthlySummary) {
          localStorage.setItem('monthlySummary', JSON.stringify(monthlySummary))
        }
        
        if (isEditing) {
          localStorage.setItem('editStats', JSON.stringify(editStats))
          localStorage.setItem('editAchievements', JSON.stringify(editAchievements))
          localStorage.setItem('editChallenges', JSON.stringify(editChallenges))
          localStorage.setItem('editGoals', JSON.stringify(editGoals))
        }
        
        if (isWeeklyEditing) {
          localStorage.setItem('editWeeklyProjects', JSON.stringify(editWeeklyProjects))
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [weeklyReports, editVoiceToTextData, editKnowledgeBaseData, monthlySummary, isEditing, editStats, editAchievements, editChallenges, editGoals, isWeeklyEditing, editWeeklyProjects])

  // 定期自動保存（每30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('weeklyReports', JSON.stringify(weeklyReports))
          localStorage.setItem('voiceToTextData', JSON.stringify(editVoiceToTextData))
          localStorage.setItem('knowledgeBaseData', JSON.stringify(editKnowledgeBaseData))
          
          if (monthlySummary) {
            localStorage.setItem('monthlySummary', JSON.stringify(monthlySummary))
          }
          
          if (isEditing) {
            localStorage.setItem('editStats', JSON.stringify(editStats))
            localStorage.setItem('editAchievements', JSON.stringify(editAchievements))
            localStorage.setItem('editChallenges', JSON.stringify(editChallenges))
            localStorage.setItem('editGoals', JSON.stringify(editGoals))
          }
          
          if (isWeeklyEditing) {
            localStorage.setItem('editWeeklyProjects', JSON.stringify(editWeeklyProjects))
          }
          
          console.log('資料已自動保存')
        } catch (error) {
          console.warn('自動保存失敗:', error)
        }
      }
    }, 30000) // 30秒

    return () => clearInterval(interval)
  }, [weeklyReports, editVoiceToTextData, editKnowledgeBaseData, monthlySummary, isEditing, editStats, editAchievements, editChallenges, editGoals, isWeeklyEditing, editWeeklyProjects])

  // 在客戶端載入時從 localStorage 恢復數據
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 恢復週報數據
      const savedWeeklyReports = localStorage.getItem('weeklyReports')
      if (savedWeeklyReports) {
        setWeeklyReports(JSON.parse(savedWeeklyReports))
      }

      // 恢復導航狀態
      const savedSelectedWeek = localStorage.getItem('selectedWeek')
      if (savedSelectedWeek) {
        setSelectedWeek(savedSelectedWeek)
      }

      const savedActiveTab = localStorage.getItem('activeTab')
      if (savedActiveTab) {
        setActiveTab(savedActiveTab)
      }

      const savedSelectedMonth = localStorage.getItem('selectedMonth')
      if (savedSelectedMonth) {
        setSelectedMonth(savedSelectedMonth)
      }

      // 恢復月度摘要
      const savedMonthlySummary = localStorage.getItem('monthlySummary')
      if (savedMonthlySummary) {
        setMonthlySummary(JSON.parse(savedMonthlySummary))
      }

      // 恢復編輯狀態
      const savedIsEditing = localStorage.getItem('isEditing')
      if (savedIsEditing === 'true') {
        setIsEditing(true)
      }

      const savedIsWeeklyEditing = localStorage.getItem('isWeeklyEditing')
      if (savedIsWeeklyEditing === 'true') {
        setIsWeeklyEditing(true)
      }

      const savedIsVoiceToTextEditing = localStorage.getItem('isVoiceToTextEditing')
      if (savedIsVoiceToTextEditing === 'true') {
        setIsVoiceToTextEditing(true)
      }

      const savedIsKnowledgeBaseEditing = localStorage.getItem('isKnowledgeBaseEditing')
      if (savedIsKnowledgeBaseEditing === 'true') {
        setIsKnowledgeBaseEditing(true)
      }

      // 恢復編輯數據
      const savedEditStats = localStorage.getItem('editStats')
      if (savedEditStats) {
        setEditStats(JSON.parse(savedEditStats))
      }

      const savedEditAchievements = localStorage.getItem('editAchievements')
      if (savedEditAchievements) {
        setEditAchievements(JSON.parse(savedEditAchievements))
      }

      const savedEditGoals = localStorage.getItem('editGoals')
      if (savedEditGoals) {
        setEditGoals(JSON.parse(savedEditGoals))
      }

      const savedEditChallenges = localStorage.getItem('editChallenges')
      if (savedEditChallenges) {
        setEditChallenges(JSON.parse(savedEditChallenges))
      }

      const savedEditWeeklyProjects = localStorage.getItem('editWeeklyProjects')
      if (savedEditWeeklyProjects) {
        setEditWeeklyProjects(JSON.parse(savedEditWeeklyProjects))
      }

      const savedEditVoiceToTextData = localStorage.getItem('voiceToTextData')
      if (savedEditVoiceToTextData) {
        setEditVoiceToTextData(JSON.parse(savedEditVoiceToTextData))
      }

      const savedEditKnowledgeBaseData = localStorage.getItem('knowledgeBaseData')
      if (savedEditKnowledgeBaseData) {
        setEditKnowledgeBaseData(JSON.parse(savedEditKnowledgeBaseData))
      }

      console.log('數據已從 localStorage 恢復')
    }
  }, [])

  // 計算月度摘要
  useEffect(() => {
    // 根據選擇的月份過濾週報數據
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
            "辭庫從6月的170個擴充至7月底的350個，淨成長180個。",
            "課程摘要確認達60篇",
            "工讀生完成45篇語音轉文字測試。"
          ]
        },
        {
          title: "開發12項財務試算模擬器，包含夥伴提出功能需求",
          description: "技術：泰元，開發：先博，測試：公司夥伴、星展志工",
          details: [
            "開發夥伴需求功能試做、財務利率回推計算器、派課系統、小編投稿說明、加班費試算、特休假試算、債務警示工具等12項實用工具"
          ]
        },
        {
          title: "好理家在知識庫",
          description: "文章審核：James，技術：泰元，文章檢查：先博，文章生成：先博、工讀生、小編",
          details: [
            "詳細敘述如下"
          ]
        },
        {
          title: "個人財務健康檢測報告規格定義",
          description: "知識確認：Ivy，技術：泰元、若海，資料整理：先博",
          details: [
            "完成指標定義和呈現樣式設計",
            "開發對話式問答案例整理"
          ]
        },
        {
          title: "建立工作機制",
          description: "機制確認：James，執行：先博、公司夥伴、工讀生、星展志工",
          details: [
            "好理家網站功能測試機制：星展志工執行小工具測試，公司夥伴部分測試，工讀生本月尚未執行",
            "課程影音處理機制：實現於語音轉文字測試及摘要調整",
            "知識庫文章管理機制：目前執行中"
          ]
        },
        {
          title: "工研院題目測試",
          description: "技術：泰元，資料整理：先博、工讀生",
          details: [
            "用好理家在AI問答進行測試完畢，先博人工確認結果"
          ]
        }
      ],
      workChallenges: [
        {
          title: "產出內容被退回好幾次",
          description: "過於依賴AI、沒有掌握好該不同類型文件需要的角度與內容需求",
          details: [
            "1. 思考此工作內容背後的動機、需求",
            "2. 在AI生成後，需在留意與前面思考的內容是否符合，是否偏題",
            "3. 將工作經驗拆解並進行紀錄",
            "4. 做完可利用AI重新檢查"
          ]
        }
      ],
      nextMonthGoals: [
        "知識庫文章新增、處理投稿、推廣增加點閱率",
        "開發12項小工具",
        "主責許願池回覆",
        "個人財務健康檢測報告-問答式問句整理，提供個案有希望感的結尾"
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
  }, [weeklyReports])

  // 獲取當前週次數據 - 根據選擇的月份過濾
  const monthWeekOptions = getWeekOptions(selectedMonth)
  const monthWeekRanges = monthWeekOptions.map(option => option.value)
  const filteredReports = weeklyReports.filter(report => 
    monthWeekRanges.includes(report.weekRange)
  )
  const currentWeekData = filteredReports.find(report => report.weekRange === selectedWeek)

  // 獲取類別圖標
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "語音轉文字":
        return <Mic className="h-4 w-4" />
      case "財務試算模擬器":
        return <Calculator className="h-4 w-4" />
      case "知識庫":
        return <Database className="h-4 w-4" />
      case "好理家知識庫":
        return <BookOpen className="h-4 w-4" />
      case "個人財務健康檢測報告":
        return <BarChart3 className="h-4 w-4" />
      case "家庭經濟圖譜":
        return <Users className="h-4 w-4" />
      case "測試":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // 獲取狀態顏色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      case "pending":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  // 獲取狀態文字
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "in-progress":
        return "進行中"
      case "pending":
        return "待處理"
      default:
        return "待處理"
    }
  }

  // 保存編輯
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
      
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('monthlySummary', JSON.stringify(updatedSummary))
        localStorage.setItem('editStats', JSON.stringify(editStats))
        localStorage.setItem('editAchievements', JSON.stringify(editAchievements))
        localStorage.setItem('editChallenges', JSON.stringify(editChallenges))
        localStorage.setItem('editGoals', JSON.stringify(editGoals))
      }
      
      setEditingState(false)
    }
  }

  // 取消編輯
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
    setEditingState(false)
  }

  // 設置編輯狀態並保存到 localStorage
  const setEditingState = (isEditing: boolean, isWeeklyEditing: boolean = false) => {
    setIsEditing(isEditing)
    setIsWeeklyEditing(isWeeklyEditing)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isEditing', isEditing.toString())
      localStorage.setItem('isWeeklyEditing', isWeeklyEditing.toString())
    }
  }

  // 週報編輯功能
  const handleWeeklyEdit = () => {
    if (currentWeekData) {
      setEditWeeklyProjects([...currentWeekData.projects])
      setEditingState(false, true)
    }
  }

  const handleWeeklySave = () => {
    // 更新週報數據
    const updatedReports = weeklyReports.map(report => 
      report.weekRange === selectedWeek 
        ? { ...report, projects: editWeeklyProjects }
        : report
    )
    
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('weeklyReports', JSON.stringify(updatedReports))
    }
    
    setWeeklyReports(updatedReports)
    setEditingState(false, false)
  }

  const handleWeeklyCancel = () => {
    if (currentWeekData) {
      setEditWeeklyProjects([...currentWeekData.projects])
    }
    setEditingState(false, false)
  }

  const updateWeeklyProject = (projectId: string, field: keyof Project, value: string) => {
    setEditWeeklyProjects(prev => {
      const updated = prev.map(project => 
        project.id === projectId 
          ? { ...project, [field]: value }
          : project
      )
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        const updatedReports = weeklyReports.map(report => 
          report.weekRange === selectedWeek 
            ? { ...report, projects: updated }
            : report
        )
        localStorage.setItem('weeklyReports', JSON.stringify(updatedReports))
      }
      return updated
    })
  }

  const addWeeklyProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      category: "其他",
      expectedWork: "",
      status: "pending",
      completion: "",
      issues: "",
      notes: ""
    }
    setEditWeeklyProjects(prev => {
      const updated = [...prev, newProject]
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        const updatedReports = weeklyReports.map(report => 
          report.weekRange === selectedWeek 
            ? { ...report, projects: updated }
            : report
        )
        localStorage.setItem('weeklyReports', JSON.stringify(updatedReports))
      }
      return updated
    })
  }

  const removeWeeklyProject = (projectId: string) => {
    setEditWeeklyProjects(prev => {
      const updated = prev.filter(project => project.id !== projectId)
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        const updatedReports = weeklyReports.map(report => 
          report.weekRange === selectedWeek 
            ? { ...report, projects: updated }
            : report
        )
        localStorage.setItem('weeklyReports', JSON.stringify(updatedReports))
      }
      return updated
    })
  }

  // 月度摘要重新整理功能
  const handleRefreshMonthlySummary = () => {
    // 保存當前月份數據作為上個月數據
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
    
    const newSummary: MonthlySummary = {
      totalProjects: allProjects.length,
      completedProjects: allProjects.filter(p => p.status === "completed").length,
      inProgressProjects: allProjects.filter(p => p.status === "in-progress").length,
      pendingProjects: allProjects.filter(p => p.status === "pending").length,
      keyAchievements: [
        {
          title: "語音轉文字功能優化",
          description: "技術：泰元，管理：先博，合作：小編、工讀生",
          details: [
            "辭庫從6月的170個擴充至7月底的350個，淨成長180個。",
            "課程摘要確認達60篇",
            "工讀生完成45篇語音轉文字測試。"
          ]
        },
        {
          title: "開發12項財務試算模擬器，包含夥伴提出功能需求",
          description: "技術：泰元，開發：先博，測試：公司夥伴、星展志工",
          details: [
            "開發夥伴需求功能試做、財務利率回推計算器、派課系統、小編投稿說明、加班費試算、特休假試算、債務警示工具等12項實用工具"
          ]
        },
        {
          title: "好理家在知識庫",
          description: "文章審核：James，技術：泰元，文章檢查：先博，文章生成：先博、工讀生、小編",
          details: [
            "詳細敘述如下"
          ]
        },
        {
          title: "個人財務健康檢測報告規格定義",
          description: "知識確認：Ivy，技術：泰元、若海，資料整理：先博",
          details: [
            "完成指標定義和呈現樣式設計",
            "開發對話式問答案例整理"
          ]
        },
        {
          title: "建立工作機制",
          description: "機制確認：James，執行：先博、公司夥伴、工讀生、星展志工",
          details: [
            "好理家網站功能測試機制：星展志工執行小工具測試，公司夥伴部分測試，工讀生本月尚未執行",
            "課程影音處理機制：實現於語音轉文字測試及摘要調整",
            "知識庫文章管理機制：目前執行中"
          ]
        },
        {
          title: "工研院題目測試",
          description: "技術：泰元，資料整理：先博、工讀生",
          details: [
            "用好理家在AI問答進行測試完畢，先博人工確認結果"
          ]
        }
      ],
      workChallenges: [
        {
          title: "產出內容被退回好幾次",
          description: "過於依賴AI、沒有掌握好該不同類型文件需要的角度與內容需求",
          details: [
            "1. 思考此工作內容背後的動機、需求",
            "2. 在AI生成後，需在留意與前面思考的內容是否符合，是否偏題",
            "3. 將工作經驗拆解並進行紀錄",
            "4. 做完可利用AI重新檢查"
          ]
        }
      ],
      nextMonthGoals: [
        "知識庫文章新增、處理投稿、推廣增加點閱率",
        "開發12項小工具",
        "主責許願池回覆",
        "個人財務健康檢測報告-問答式問句整理，提供個案有希望感的結尾"
      ]
    }
    
    setMonthlySummary(newSummary)
    
    // 檢查是否有重複欄位需要詢問
    if (previousMonthData) {
      const hasChanges = 
        newSummary.totalProjects !== previousMonthData.totalProjects ||
        newSummary.completedProjects !== previousMonthData.completedProjects ||
        newSummary.inProgressProjects !== previousMonthData.inProgressProjects ||
        newSummary.pendingProjects !== previousMonthData.pendingProjects
      
      if (hasChanges) {
        // 這裡可以添加確認對話框
        console.log("檢測到數據變化，請確認是否需要更新")
      }
    }
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

  // 語音轉文字辭庫編輯功能
  const handleVoiceToTextEdit = () => {
    setIsVoiceToTextEditing(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isVoiceToTextEditing', 'true')
    }
  }

  const handleVoiceToTextSave = () => {
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('voiceToTextData', JSON.stringify(editVoiceToTextData))
    }
    setIsVoiceToTextEditing(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isVoiceToTextEditing', 'false')
    }
  }

  const handleVoiceToTextCancel = () => {
    setEditVoiceToTextData([
      { week: "6月", total: 170, new: 0 },
      { week: "7/7-7/13", total: 170, new: 0 },
      { week: "7/14-7/20", total: 203, new: 6 },
      { week: "7/21-7/27", total: 309, new: 97 },
      { week: "7/28-8/3", total: 350, new: 41 },
      { week: "8/4-8/10", total: 350, new: 0 },
      { week: "8/11-8/17", total: 361, new: 11 },
      { week: "8/18-8/24", total: 393, new: 32 }
    ])
    setIsVoiceToTextEditing(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isVoiceToTextEditing', 'false')
    }
  }

  const updateVoiceToTextData = (index: number, field: 'week' | 'total' | 'new', value: string | number) => {
    setEditVoiceToTextData(prev => {
      const updated = prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('voiceToTextData', JSON.stringify(updated))
      }
      return updated
    })
  }

  const addVoiceToTextWeek = () => {
    setEditVoiceToTextData(prev => {
      const updated = [...prev, { week: "", total: 0, new: 0 }]
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('voiceToTextData', JSON.stringify(updated))
      }
      return updated
    })
  }

  const removeVoiceToTextWeek = (index: number) => {
    setEditVoiceToTextData(prev => {
      const updated = prev.filter((_, i) => i !== index)
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('voiceToTextData', JSON.stringify(updated))
      }
      return updated
    })
  }

  // 知識庫編輯功能
  const handleKnowledgeBaseEdit = () => {
    setIsKnowledgeBaseEditing(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isKnowledgeBaseEditing', 'true')
    }
  }

  const handleKnowledgeBaseSave = () => {
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('knowledgeBaseData', JSON.stringify(editKnowledgeBaseData))
    }
    setIsKnowledgeBaseEditing(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isKnowledgeBaseEditing', 'false')
    }
  }

  const handleKnowledgeBaseCancel = () => {
    setEditKnowledgeBaseData([
      {
        category: "社福資源資料庫",
        description: "新增社福資源資料庫",
        details: "建立完整的社福資源分類體系，包含各類補助、服務項目等"
      },
      {
        category: "工讀生案例分類知識庫",
        description: "補充135篇文章",
        details: "涵蓋各類工讀生相關案例，提供實用的參考資料"
      },
      {
        category: "新增文章",
        description: "新增7篇文章",
        details: "持續擴充知識庫內容，提升內容豐富度"
      },
      {
        category: "上架審核",
        description: "上架審核通過文章",
        details: "建立內容審核機制，確保知識庫內容品質"
      }
    ])
    setIsKnowledgeBaseEditing(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isKnowledgeBaseEditing', 'false')
    }
  }

  const updateKnowledgeBaseData = (index: number, field: 'category' | 'description' | 'details', value: string) => {
    setEditKnowledgeBaseData(prev => {
      const updated = prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('knowledgeBaseData', JSON.stringify(updated))
      }
      return updated
    })
  }

  const addKnowledgeBaseItem = () => {
    setEditKnowledgeBaseData(prev => {
      const updated = [...prev, { category: "", description: "", details: "" }]
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('knowledgeBaseData', JSON.stringify(updated))
      }
      return updated
    })
  }

  const removeKnowledgeBaseItem = (index: number) => {
    setEditKnowledgeBaseData(prev => {
      const updated = prev.filter((_, i) => i !== index)
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('knowledgeBaseData', JSON.stringify(updated))
      }
      return updated
    })
  }

  // 添加成就
  const addAchievement = () => {
    setEditAchievements([...editAchievements, { title: "", description: "", details: "" }])
  }

  // 刪除成就
  const removeAchievement = (index: number) => {
    setEditAchievements(editAchievements.filter((_, i) => i !== index))
  }

  // 更新成就
  const updateAchievement = (index: number, field: keyof Achievement, value: string | string[]) => {
    const newAchievements = [...editAchievements]
    newAchievements[index] = { ...newAchievements[index], [field]: value }
    setEditAchievements(newAchievements)
  }

  // 添加目標
  const addGoal = () => {
    setEditGoals([...editGoals, ""])
  }

  // 刪除目標
  const removeGoal = (index: number) => {
    setEditGoals(editGoals.filter((_, i) => i !== index))
  }

  // 更新目標
  const updateGoal = (index: number, value: string) => {
    const newGoals = [...editGoals]
    newGoals[index] = value
    setEditGoals(newGoals)
  }

  const addChallenge = () => {
    const newChallenges = [...editChallenges, { title: "", description: "", details: "" }]
    setEditChallenges(newChallenges)
  }

  const removeChallenge = (index: number) => {
    const newChallenges = editChallenges.filter((_, i) => i !== index)
    setEditChallenges(newChallenges)
  }

  const updateChallenge = (index: number, field: keyof Achievement, value: string | string[]) => {
    const newChallenges = [...editChallenges]
    newChallenges[index] = { ...newChallenges[index], [field]: value }
    setEditChallenges(newChallenges)
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
    // 如果有編輯的成就，優先顯示編輯的成就
    if (editAchievements.length > 0) {
      return editAchievements
    }
    // 如果有保存的手動成就，顯示手動成就
    if (monthlySummary?.manualAchievements) {
      return monthlySummary.manualAchievements
    }
    // 最後顯示預設成就
    return monthlySummary?.keyAchievements || []
  }

  // 獲取顯示的目標
  const getDisplayGoals = () => {
    // 如果有編輯的目標，優先顯示編輯的目標
    if (editGoals.length > 0) {
      return editGoals
    }
    // 如果有保存的手動目標，顯示手動目標
    if (monthlySummary?.manualGoals) {
      return monthlySummary.manualGoals
    }
    // 最後顯示預設目標
    return monthlySummary?.nextMonthGoals || []
  }

  // 獲取顯示的困難或挑戰
  const getDisplayChallenges = () => {
    // 如果有編輯的挑戰，優先顯示編輯的挑戰
    if (editChallenges.length > 0) {
      return editChallenges
    }
    // 如果有保存的手動挑戰，顯示手動挑戰
    if (monthlySummary?.manualChallenges) {
      return monthlySummary.manualChallenges
    }
    // 最後顯示預設挑戰
    return monthlySummary?.workChallenges || []
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 頂部標題 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black">週報進度整理系統</h1>
          </div>
          <p className="text-xl text-gray-600">
            {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年7月"} 工作進度追蹤與管理
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button
              onClick={() => {
                if (confirm('確定要重置所有資料到預設狀態嗎？這將清除所有本地保存的編輯內容。')) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重置資料
            </Button>
            <Button
              onClick={() => {
                console.log('=== 當前 localStorage 內容 ===')
                console.log('weeklyReports:', localStorage.getItem('weeklyReports'))
                console.log('voiceToTextData:', localStorage.getItem('voiceToTextData'))
                console.log('knowledgeBaseData:', localStorage.getItem('knowledgeBaseData'))
                console.log('editStats:', localStorage.getItem('editStats'))
                console.log('editAchievements:', localStorage.getItem('editAchievements'))
                console.log('editGoals:', localStorage.getItem('editGoals'))
                console.log('editChallenges:', localStorage.getItem('editChallenges'))
                console.log('monthlySummary:', localStorage.getItem('monthlySummary'))
                
                console.log('=== 當前狀態 ===')
                console.log('monthlySummary state:', monthlySummary)
                console.log('editAchievements state:', editAchievements)
                console.log('getDisplayAchievements():', getDisplayAchievements())
                console.log('isEditing:', isEditing)
                
                alert('已將詳細資訊輸出到瀏覽器控制台，請按 F12 查看')
              }}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <Info className="h-4 w-4 mr-2" />
              檢查資料
            </Button>
            <Button
              onClick={() => {
                // 強制保存所有當前資料
                if (typeof window !== 'undefined') {
                  localStorage.setItem('weeklyReports', JSON.stringify(weeklyReports))
                  localStorage.setItem('voiceToTextData', JSON.stringify(editVoiceToTextData))
                  localStorage.setItem('knowledgeBaseData', JSON.stringify(editKnowledgeBaseData))
                  
                  if (monthlySummary) {
                    localStorage.setItem('monthlySummary', JSON.stringify(monthlySummary))
                  }
                  
                  localStorage.setItem('editStats', JSON.stringify(editStats))
                  localStorage.setItem('editAchievements', JSON.stringify(editAchievements))
                  localStorage.setItem('editChallenges', JSON.stringify(editChallenges))
                  localStorage.setItem('editGoals', JSON.stringify(editGoals))
                  
                  alert('已強制保存所有資料到 localStorage')
                }
              }}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Save className="h-4 w-4 mr-2" />
              強制保存
            </Button>
            <Button
              onClick={() => {
                // 手動觸發月度摘要計算
                handleRefreshMonthlySummary()
                alert('已重新計算月度摘要')
              }}
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              重新計算摘要
            </Button>
            <Button
              onClick={() => {
                // 匯出週報資料為 CSV
                const weeklyReportsCSV = exportWeeklyReportsToCSV(weeklyReports)
                const weeklyBlob = new Blob([weeklyReportsCSV], { type: 'text/csv;charset=utf-8;' })
                const weeklyUrl = URL.createObjectURL(weeklyBlob)
                const weeklyLink = document.createElement('a')
                weeklyLink.href = weeklyUrl
                weeklyLink.download = `週報資料_${new Date().toISOString().split('T')[0]}.csv`
                weeklyLink.click()
                URL.revokeObjectURL(weeklyUrl)

                // 匯出語音轉文字資料為 CSV
                const voiceToTextCSV = exportVoiceToTextToCSV(editVoiceToTextData)
                const voiceBlob = new Blob([voiceToTextCSV], { type: 'text/csv;charset=utf-8;' })
                const voiceUrl = URL.createObjectURL(voiceBlob)
                const voiceLink = document.createElement('a')
                voiceLink.href = voiceUrl
                voiceLink.download = `語音轉文字統計_${new Date().toISOString().split('T')[0]}.csv`
                voiceLink.click()
                URL.revokeObjectURL(voiceUrl)

                // 匯出知識庫資料為 CSV
                const knowledgeBaseCSV = exportKnowledgeBaseToCSV(editKnowledgeBaseData)
                const kbBlob = new Blob([knowledgeBaseCSV], { type: 'text/csv;charset=utf-8;' })
                const kbUrl = URL.createObjectURL(kbBlob)
                const kbLink = document.createElement('a')
                kbLink.href = kbUrl
                kbLink.download = `知識庫統計_${new Date().toISOString().split('T')[0]}.csv`
                kbLink.click()
                URL.revokeObjectURL(kbUrl)

                alert('已匯出三個 CSV 檔案：週報資料、語音轉文字統計、知識庫統計')
              }}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              匯出資料(CSV)
            </Button>
                        <Button
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.csv'
                input.multiple = true
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files
                  if (files && files.length > 0) {
                    // 自動備份當前資料
                    const backupData = {
                      weeklyReports,
                      voiceToTextData: editVoiceToTextData,
                      knowledgeBaseData: editKnowledgeBaseData,
                      monthlySummary,
                      backupTime: new Date().toISOString()
                    }
                    const backupBlob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
                    const backupUrl = URL.createObjectURL(backupBlob)
                    const backupLink = document.createElement('a')
                    backupLink.href = backupUrl
                    backupLink.download = `備份資料_${new Date().toISOString().split('T')[0]}_${new Date().toISOString().split('T')[1].split('.')[0]}.json`
                    backupLink.click()
                    URL.revokeObjectURL(backupUrl)
                    
                    let processedFiles = 0
                    const totalFiles = files.length
                    
                    Array.from(files).forEach((file) => {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        try {
                          let csvContent = e.target?.result as string
                          // 移除 UTF-8 BOM 如果存在
                          if (csvContent.charCodeAt(0) === 0xFEFF) {
                            csvContent = csvContent.slice(1)
                          }
                          const fileName = file.name.toLowerCase()
                          
                          if (fileName.includes('週報') || fileName.includes('weekly')) {
                            const importedWeeklyReports = importWeeklyReportsFromCSV(csvContent)
                            if (importedWeeklyReports) {
                              setWeeklyReports(importedWeeklyReports)
                              localStorage.setItem('weeklyReports', JSON.stringify(importedWeeklyReports))
                            }
                          } else if (fileName.includes('語音') || fileName.includes('voice')) {
                            const importedVoiceToText = importVoiceToTextFromCSV(csvContent)
                            if (importedVoiceToText) {
                              setEditVoiceToTextData(importedVoiceToText)
                              localStorage.setItem('voiceToTextData', JSON.stringify(importedVoiceToText))
                            }
                          } else if (fileName.includes('知識庫') || fileName.includes('knowledge')) {
                            const importedKnowledgeBase = importKnowledgeBaseFromCSV(csvContent)
                            if (importedKnowledgeBase) {
                              setEditKnowledgeBaseData(importedKnowledgeBase)
                              localStorage.setItem('knowledgeBaseData', JSON.stringify(importedKnowledgeBase))
                            }
                          }
                          
                          processedFiles++
                          if (processedFiles === totalFiles) {
                            alert('資料匯入完成！')
                          }
                        } catch (error) {
                          alert(`檔案 ${file.name} 格式錯誤，請檢查 CSV 格式。`)
                        }
                      }
                      reader.readAsText(file)
                    })
                  }
                }
                input.click()
              }}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              匯入資料(CSV)
            </Button>
            <Button
              onClick={() => {
                // 下載週報資料範本
                const weeklyTemplate = exportWeeklyReportsToCSV([
                  {
                    weekRange: "範例週次",
                    projects: [
                      {
                        id: "1",
                        name: "範例專案",
                        category: "範例類別",
                        expectedWork: "預期工作內容",
                        status: "completed",
                        completion: "完成狀況描述",
                        issues: "問題或挑戰",
                        notes: "備註說明"
                      }
                    ]
                  }
                ])
                const weeklyTemplateBlob = new Blob([weeklyTemplate], { type: 'text/csv;charset=utf-8;' })
                const weeklyTemplateUrl = URL.createObjectURL(weeklyTemplateBlob)
                const weeklyTemplateLink = document.createElement('a')
                weeklyTemplateLink.href = weeklyTemplateUrl
                weeklyTemplateLink.download = '週報資料範本.csv'
                weeklyTemplateLink.click()
                URL.revokeObjectURL(weeklyTemplateUrl)

                // 下載語音轉文字範本
                const voiceTemplate = exportVoiceToTextToCSV([
                  { week: "範例週次", total: 0, new: 0 }
                ])
                const voiceTemplateBlob = new Blob([voiceTemplate], { type: 'text/csv;charset=utf-8;' })
                const voiceTemplateUrl = URL.createObjectURL(voiceTemplateBlob)
                const voiceTemplateLink = document.createElement('a')
                voiceTemplateLink.href = voiceTemplateUrl
                voiceTemplateLink.download = '語音轉文字統計範本.csv'
                voiceTemplateLink.click()
                URL.revokeObjectURL(voiceTemplateUrl)

                // 下載知識庫範本
                const kbTemplate = exportKnowledgeBaseToCSV([
                  {
                    category: "範例分類",
                    description: "範例描述",
                    details: "範例詳細說明"
                  }
                ])
                const kbTemplateBlob = new Blob([kbTemplate], { type: 'text/csv;charset=utf-8;' })
                const kbTemplateUrl = URL.createObjectURL(kbTemplateBlob)
                const kbTemplateLink = document.createElement('a')
                kbTemplateLink.href = kbTemplateUrl
                kbTemplateLink.download = '知識庫統計範本.csv'
                kbTemplateLink.click()
                URL.revokeObjectURL(kbTemplateUrl)

                alert('已下載三個 CSV 範本檔案：週報資料範本、語音轉文字統計範本、知識庫統計範本')
              }}
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              下載範本(CSV)
            </Button>
          </div>
        </div>

        {/* 資料管理說明 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">資料管理說明</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>自動保存已啟用</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">📤 匯出功能</h4>
              <ul className="space-y-1">
                <li>• <strong>匯出資料(CSV)</strong>：將資料匯出為三個 CSV 檔案</li>
                <li>• <strong>下載範本(CSV)</strong>：下載標準格式的 CSV 範本檔案</li>
                <li>• CSV 格式方便在 Excel 中編輯</li>
                <li>• 建議定期匯出資料作為備份</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">📥 匯入功能</h4>
              <ul className="space-y-1">
                <li>• <strong>匯入資料(CSV)</strong>：從 CSV 檔案匯入資料（支援多檔案同時匯入）</li>
                <li>• 支援從範本檔案開始編輯</li>
                <li>• 匯入前會自動備份當前資料</li>
                <li>• 根據檔案名稱自動識別資料類型</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>注意：</strong>匯入資料會覆蓋當前的所有編輯內容，請確保已備份重要資料。CSV 檔案請使用 UTF-8 編碼，並確保欄位格式正確。
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <strong>自動保存功能：</strong>所有編輯內容會自動保存到瀏覽器本地儲存，包括即時保存、定期保存（每30秒）和頁面關閉前保存。重新整理頁面後資料不會遺失，請放心編輯。
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>編碼說明：</strong>下載的 CSV 檔案已自動添加 UTF-8 BOM 標記，確保在 Excel 等軟體中正確顯示中文字符。如果仍然出現亂碼，請在 Excel 中選擇「資料」→「從文字/CSV」匯入，並選擇 UTF-8 編碼。
              </div>
            </div>
          </div>
        </div>

        {/* 月份和週次選擇 */}
        <div className="flex justify-center mb-8 gap-4">
          {/* 月份選擇 */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">選擇月份：</Label>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-48">
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

          {/* 週次選擇 */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">選擇週次：</Label>
            <Select value={selectedWeek} onValueChange={handleWeekChange}>
              <SelectTrigger className="w-48">
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
        </div>

        {/* 標籤切換 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <Button
              variant={activeTab === "weekly" ? "default" : "ghost"}
              onClick={() => handleTabChange("weekly")}
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
              onClick={() => handleTabChange("monthly")}
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

        {/* 內容區域 */}
        <div className="space-y-6">
          {/* 週報詳情 */}
          {activeTab === "weekly" && (
            <>
              {currentWeekData ? (
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    <CardTitle className="text-2xl">
                      {selectedWeek} 週報詳情
                    </CardTitle>
                  </div>
                  {!isWeeklyEditing ? (
                    <Button
                      onClick={handleWeeklyEdit}
                      variant="outline"
                      size="sm"
                      className="text-white border-white hover:bg-white hover:text-red-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      編輯
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleWeeklySave}
                        variant="outline"
                        size="sm"
                        className="text-white border-white hover:bg-white hover:text-green-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        保存
                      </Button>
                      <Button
                        onClick={handleWeeklyCancel}
                        variant="outline"
                        size="sm"
                        className="text-white border-white hover:bg-white hover:text-gray-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        取消
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription className="text-red-100">
                  本週各專案項目完成狀況
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="space-y-6">
                  {isWeeklyEditing && (
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={addWeeklyProject}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        添加項目
                      </Button>
                    </div>
                  )}
                  {Array.from(new Set((isWeeklyEditing ? editWeeklyProjects : currentWeekData.projects).map(p => p.category))).map(category => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-lg font-semibold text-black flex items-center gap-2 border-b border-gray-200 pb-2">
                        {getCategoryIcon(category)}
                        {category}
                      </h3>
                      <div className="grid gap-4">
                        {(isWeeklyEditing ? editWeeklyProjects : currentWeekData.projects)
                          .filter(project => project.category === category)
                          .map(project => (
                            <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                              {isWeeklyEditing ? (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className={`h-3 w-3 rounded-full ${getStatusColor(project.status)}`} />
                                      <Input
                                        value={project.name}
                                        onChange={(e) => updateWeeklyProject(project.id, "name", e.target.value)}
                                        placeholder="項目名稱"
                                        className="flex-1"
                                      />
                                      <Select
                                        value={project.status}
                                        onValueChange={(value) => updateWeeklyProject(project.id, "status", value)}
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">待處理</SelectItem>
                                          <SelectItem value="in-progress">進行中</SelectItem>
                                          <SelectItem value="completed">已完成</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      onClick={() => removeWeeklyProject(project.id)}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">預期工作</Label>
                                      <Textarea
                                        value={project.expectedWork}
                                        onChange={(e) => updateWeeklyProject(project.id, "expectedWork", e.target.value)}
                                        placeholder="預期工作內容"
                                        className="min-h-[60px]"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">完成狀況</Label>
                                      <Textarea
                                        value={project.completion}
                                        onChange={(e) => updateWeeklyProject(project.id, "completion", e.target.value)}
                                        placeholder="完成狀況"
                                        className="min-h-[60px]"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">問題（可選）</Label>
                                      <Textarea
                                        value={project.issues || ""}
                                        onChange={(e) => updateWeeklyProject(project.id, "issues", e.target.value)}
                                        placeholder="遇到的問題"
                                        className="min-h-[60px]"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">備註（可選）</Label>
                                      <Textarea
                                        value={project.notes || ""}
                                        onChange={(e) => updateWeeklyProject(project.id, "notes", e.target.value)}
                                        placeholder="備註"
                                        className="min-h-[60px]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className={`h-3 w-3 rounded-full ${getStatusColor(project.status)}`} />
                                      <h4 className="font-semibold text-black">{project.name}</h4>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          project.status === "completed"
                                            ? "border-green-500 text-green-600 bg-green-50"
                                            : project.status === "in-progress"
                                              ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                                              : "border-gray-500 text-gray-600 bg-gray-50"
                                        }`}
                                      >
                                        {getStatusText(project.status)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                      <span className="font-medium text-black">預期工作：</span>
                                      {project.expectedWork}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-2">
                                      <span className="font-medium text-black">完成狀況：</span>
                                      {project.completion}
                                    </p>
                                    {project.issues && (
                                      <div className="flex items-start gap-2 mt-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-red-600">
                                          <span className="font-medium">問題：</span>
                                          {project.issues}
                                        </p>
                                      </div>
                                    )}
                                    {project.notes && (
                                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700 border border-blue-200">
                                        <span className="font-medium">備註：</span>
                                        {project.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
              ) : (
                <Card className="shadow-lg border border-gray-200 bg-white">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Calendar className="h-6 w-6" />
                      {selectedWeek} 週報詳情
                    </CardTitle>
                    <CardDescription className="text-red-100">
                      本週各專案項目完成狀況
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <FileText className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">暫無數據</h3>
                      <p className="text-sm text-gray-500">
                        該週次目前沒有相關的專案數據
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* 月度摘要 */}
          {activeTab === "monthly" && (
            <>
              {/* 月度統計 */}
              {monthlySummary && getDisplayStats().totalProjects > 0 ? (
                <Card className="shadow-lg border border-gray-200 bg-white">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-6 w-6" />
                        <CardTitle className="text-2xl">
                          {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年7月"} 月度統計
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {!isEditing ? (
                          <>
                            <Button
                              onClick={handleRefreshMonthlySummary}
                              variant="outline"
                              size="sm"
                              className="text-white border-white hover:bg-white hover:text-blue-600"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              重新整理
                            </Button>
                            <Button
                              onClick={() => setEditingState(true)}
                              variant="outline"
                              size="sm"
                              className="text-white border-white hover:bg-white hover:text-red-600"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              編輯
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={handleSave}
                              variant="outline"
                              size="sm"
                              className="text-white border-white hover:bg-white hover:text-green-600"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              保存
                            </Button>
                            <Button
                              onClick={handleCancel}
                              variant="outline"
                              size="sm"
                              className="text-white border-white hover:bg-white hover:text-gray-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              取消
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-red-100">
                      {monthOptions.find(option => option.value === selectedMonth)?.label || "2025年7月"} 整體工作統計數據
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Label htmlFor="totalProjects" className="text-sm text-gray-600">總專案數</Label>
                            <Input
                              id="totalProjects"
                              type="number"
                              value={editStats.totalProjects}
                              onChange={(e) => setEditStats({...editStats, totalProjects: parseInt(e.target.value) || 0})}
                              className="text-center"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold text-black mb-2">{getDisplayStats().totalProjects}</div>
                            <div className="text-sm text-gray-600">總專案數</div>
                            {getMonthlyChanges() && (
                              <div className={`text-xs font-medium ${getMonthlyChanges()!.totalProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {getMonthlyChanges()!.totalProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.totalProjects}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Label htmlFor="completedProjects" className="text-sm text-gray-600">已完成</Label>
                            <Input
                              id="completedProjects"
                              type="number"
                              value={editStats.completedProjects}
                              onChange={(e) => setEditStats({...editStats, completedProjects: parseInt(e.target.value) || 0})}
                              className="text-center"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold text-green-600 mb-2">{getDisplayStats().completedProjects}</div>
                            <div className="text-sm text-gray-600">已完成</div>
                            {getMonthlyChanges() && (
                              <div className={`text-xs font-medium ${getMonthlyChanges()!.completedProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {getMonthlyChanges()!.completedProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.completedProjects}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Label htmlFor="inProgressProjects" className="text-sm text-gray-600">進行中</Label>
                            <Input
                              id="inProgressProjects"
                              type="number"
                              value={editStats.inProgressProjects}
                              onChange={(e) => setEditStats({...editStats, inProgressProjects: parseInt(e.target.value) || 0})}
                              className="text-center"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold text-yellow-600 mb-2">{getDisplayStats().inProgressProjects}</div>
                            <div className="text-sm text-gray-600">進行中</div>
                            {getMonthlyChanges() && (
                              <div className={`text-xs font-medium ${getMonthlyChanges()!.inProgressProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {getMonthlyChanges()!.inProgressProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.inProgressProjects}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Label htmlFor="pendingProjects" className="text-sm text-gray-600">待處理</Label>
                            <Input
                              id="pendingProjects"
                              type="number"
                              value={editStats.pendingProjects}
                              onChange={(e) => setEditStats({...editStats, pendingProjects: parseInt(e.target.value) || 0})}
                              className="text-center"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold text-gray-600 mb-2">{getDisplayStats().pendingProjects}</div>
                            <div className="text-sm text-gray-600">待處理</div>
                            {getMonthlyChanges() && (
                              <div className={`text-xs font-medium ${getMonthlyChanges()!.pendingProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {getMonthlyChanges()!.pendingProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.pendingProjects}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* 月度變化摘要 */}
                    {getMonthlyChanges() && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <h5 className="font-semibold text-gray-800">與上個月相比的變化</h5>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className={`font-medium ${getMonthlyChanges()!.totalProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {getMonthlyChanges()!.totalProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.totalProjects}
                            </div>
                            <div className="text-gray-600">總專案數</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-medium ${getMonthlyChanges()!.completedProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {getMonthlyChanges()!.completedProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.completedProjects}
                            </div>
                            <div className="text-gray-600">已完成</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-medium ${getMonthlyChanges()!.inProgressProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {getMonthlyChanges()!.inProgressProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.inProgressProjects}
                            </div>
                            <div className="text-gray-600">進行中</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-medium ${getMonthlyChanges()!.pendingProjects >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {getMonthlyChanges()!.pendingProjects >= 0 ? '+' : ''}{getMonthlyChanges()!.pendingProjects}
                            </div>
                            <div className="text-gray-600">待處理</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border border-gray-200 bg-white">
                  <CardContent className="p-6 bg-white">
                    <div className="text-center text-gray-500">
                      載入中...
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 七月份執行狀況 */}
              {monthlySummary && (
                <Card className="shadow-lg border border-gray-200 bg-white">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6" />
                        <CardTitle className="text-2xl">七月份執行狀況</CardTitle>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={addAchievement}
                          variant="outline"
                          size="sm"
                          className="text-white border-white hover:bg-white hover:text-red-600"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          添加
                        </Button>
                      )}
                    </div>
                    <CardDescription className="text-red-100">
                      2025年7月份達成的重要成果
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-6">
                      {(isEditing ? editAchievements : getDisplayAchievements()).map((achievement, index) => (
                        <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <Input
                                  value={achievement.title}
                                  onChange={(e) => updateAchievement(index, "title", e.target.value)}
                                  placeholder="成就標題"
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() => removeAchievement(index)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <Textarea
                                value={achievement.description}
                                onChange={(e) => updateAchievement(index, "description", e.target.value)}
                                placeholder="成就描述"
                                className="min-h-[60px]"
                              />
                              <div className="space-y-2">
                                <Label className="text-sm text-gray-600 flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  詳細說明
                                </Label>
                                <div className="space-y-2">
                                  {Array.isArray(achievement.details) ? (
                                    achievement.details.map((detail, detailIndex) => (
                                      <div key={detailIndex} className="flex gap-2">
                                        <Textarea
                                          value={detail}
                                          onChange={(e) => {
                                            const newDetails = [...(achievement.details as string[])]
                                            newDetails[detailIndex] = e.target.value
                                            updateAchievement(index, "details", newDetails)
                                          }}
                                          placeholder={`詳細說明 ${detailIndex + 1}`}
                                          className="flex-1 min-h-[60px]"
                                        />
                                        <Button
                                          onClick={() => {
                                            const newDetails = (achievement.details as string[]).filter((_, i) => i !== detailIndex)
                                            updateAchievement(index, "details", newDetails)
                                          }}
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))
                                  ) : (
                                    <Textarea
                                      value={achievement.details || ""}
                                      onChange={(e) => updateAchievement(index, "details", e.target.value)}
                                      placeholder="詳細說明（可選）"
                                      className="min-h-[80px]"
                                    />
                                  )}
                                  <Button
                                    onClick={() => {
                                      const currentDetails = Array.isArray(achievement.details) ? achievement.details : [achievement.details || ""]
                                      updateAchievement(index, "details", [...currentDetails, ""])
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    添加詳細說明
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-black mb-1">{achievement.title}</h4>
                                  <p className="text-gray-700 mb-2">{achievement.description}</p>
                                  {achievement.details && (
                                    <div className="p-3 bg-white rounded border border-green-200">
                                      {Array.isArray(achievement.details) ? (
                                        <div className="space-y-2">
                                          {achievement.details.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-sm text-gray-600">
                                              <span className="font-medium">說明 {detailIndex + 1}：</span>
                                              {detail}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-600">{achievement.details}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 工作困難或挑戰 */}
              {monthlySummary && (
                <Card className="shadow-lg border border-gray-200 bg-white">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6" />
                        <CardTitle className="text-2xl">工作困難或挑戰</CardTitle>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={addChallenge}
                          variant="outline"
                          size="sm"
                          className="text-white border-white hover:bg-white hover:text-orange-600"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          添加
                        </Button>
                      )}
                    </div>
                    <CardDescription className="text-orange-100">
                      本月工作中遇到的困難與挑戰
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-6">
                      {(isEditing ? editChallenges : getDisplayChallenges()).map((challenge, index) => (
                        <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                <Input
                                  value={challenge.title}
                                  onChange={(e) => updateChallenge(index, "title", e.target.value)}
                                  placeholder="困難或挑戰標題"
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() => removeChallenge(index)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <Textarea
                                value={challenge.description}
                                onChange={(e) => updateChallenge(index, "description", e.target.value)}
                                placeholder="困難或挑戰描述"
                                className="min-h-[60px]"
                              />
                              <div className="space-y-2">
                                <Label className="text-sm text-gray-600 flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  解決方案或後續處理
                                </Label>
                                <div className="space-y-2">
                                  {Array.isArray(challenge.details) ? (
                                    challenge.details.map((detail, detailIndex) => (
                                      <div key={detailIndex} className="flex gap-2">
                                        <Textarea
                                          value={detail}
                                          onChange={(e) => {
                                            const newDetails = [...(challenge.details as string[])]
                                            newDetails[detailIndex] = e.target.value
                                            updateChallenge(index, "details", newDetails)
                                          }}
                                          placeholder={`解決方案 ${detailIndex + 1}`}
                                          className="flex-1 min-h-[60px]"
                                        />
                                        <Button
                                          onClick={() => {
                                            const newDetails = (challenge.details as string[]).filter((_, i) => i !== detailIndex)
                                            updateChallenge(index, "details", newDetails)
                                          }}
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))
                                  ) : (
                                    <Textarea
                                      value={challenge.details || ""}
                                      onChange={(e) => updateChallenge(index, "details", e.target.value)}
                                      placeholder="解決方案或後續處理（可選）"
                                      className="min-h-[80px]"
                                    />
                                  )}
                                  <Button
                                    onClick={() => {
                                      const currentDetails = Array.isArray(challenge.details) ? challenge.details : [challenge.details || ""]
                                      updateChallenge(index, "details", [...currentDetails, ""])
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    添加解決方案
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-black mb-1">{challenge.title}</h4>
                                  <p className="text-gray-700 mb-2">{challenge.description}</p>
                                  {challenge.details && (
                                    <div className="p-3 bg-white rounded border border-orange-200">
                                      <div className="mb-2">
                                        <span className="text-sm font-medium text-gray-700">解決方案或後續處理：</span>
                                      </div>
                                      {Array.isArray(challenge.details) ? (
                                        <div className="space-y-2">
                                          {challenge.details.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-sm text-gray-600">
                                              {detail}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-600">{challenge.details}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 下月目標 */}
              {monthlySummary && getDisplayGoals().length > 0 && (
                <Card className="shadow-lg border border-gray-200 bg-white">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-6 w-6" />
                        <CardTitle className="text-2xl">下月目標</CardTitle>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={addGoal}
                          variant="outline"
                          size="sm"
                          className="text-white border-white hover:bg-white hover:text-red-600"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          添加
                        </Button>
                      )}
                    </div>
                    <CardDescription className="text-red-100">
                      2025年8月份的工作目標與計畫
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-4">
                      {(isEditing ? editGoals : getDisplayGoals()).map((goal, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          {isEditing ? (
                            <div className="flex-1 flex gap-2">
                              <Textarea
                                value={goal}
                                onChange={(e) => updateGoal(index, e.target.value)}
                                className="flex-1"
                                placeholder="輸入目標內容"
                              />
                              <Button
                                onClick={() => removeGoal(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <p className="text-black">{goal}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 語音轉文字辭庫更新統計 */}
              <VoiceToTextStats 
                isEditing={isVoiceToTextEditing}
                weeklyData={editVoiceToTextData}
                onEdit={handleVoiceToTextEdit}
                onSave={handleVoiceToTextSave}
                onCancel={handleVoiceToTextCancel}
                onUpdateData={updateVoiceToTextData}
                onAddWeek={addVoiceToTextWeek}
                onRemoveWeek={removeVoiceToTextWeek}
              />

              {/* 知識庫擴充統計 */}
              <KnowledgeBaseStats 
                isEditing={isKnowledgeBaseEditing}
                knowledgeBaseData={editKnowledgeBaseData}
                onEdit={handleKnowledgeBaseEdit}
                onSave={handleKnowledgeBaseSave}
                onCancel={handleKnowledgeBaseCancel}
                onUpdateData={updateKnowledgeBaseData}
                onAddItem={addKnowledgeBaseItem}
                onRemoveItem={removeKnowledgeBaseItem}
              />

            </>
          )}
        </div>
      </div>
    </div>
  )
}

const VoiceToTextStats = ({ 
  isEditing, 
  weeklyData, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdateData, 
  onAddWeek, 
  onRemoveWeek 
}: {
  isEditing: boolean
  weeklyData: { week: string; total: number; new: number }[]
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onUpdateData: (index: number, field: 'week' | 'total' | 'new', value: string | number) => void
  onAddWeek: () => void
  onRemoveWeek: (index: number) => void
}) => {
  const juneTotal = weeklyData[0].total // 6月辭庫總數
  const julyTotal = weeklyData[weeklyData.length - 1].total // 7月辭庫總數
  const netGrowth = julyTotal - juneTotal // 淨成長數
  const totalNew = weeklyData.reduce((sum, data) => sum + data.new, 0)

  return (
    <Card className="shadow-lg border border-gray-200 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-6 w-6" />
            <CardTitle className="text-2xl">語音轉文字辭庫更新統計</CardTitle>
          </div>
          {!isEditing ? (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              編輯
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={onSave}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-green-600"
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-gray-600"
              >
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-blue-100">
          自定義辭庫更新進度追蹤
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">{weeklyData[weeklyData.length - 1].total}</div>
            <div className="text-sm text-gray-600">辭庫總數</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">{juneTotal}</div>
            <div className="text-sm text-gray-600">上個月辭庫總數</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">{netGrowth}</div>
            <div className="text-sm text-gray-600">本月淨成長</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">週度更新詳情</h4>
            {isEditing && (
              <Button
                onClick={onAddWeek}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加週次
              </Button>
            )}
          </div>
          {weeklyData.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              {isEditing ? (
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600">週次</Label>
                      <Input
                        value={data.week}
                        onChange={(e) => onUpdateData(index, 'week', e.target.value)}
                        placeholder="週次範圍"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">辭庫總數</Label>
                      <Input
                        type="number"
                        value={data.total}
                        onChange={(e) => onUpdateData(index, 'total', parseInt(e.target.value) || 0)}
                        placeholder="總數"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">新增數量</Label>
                      <Input
                        type="number"
                        value={data.new}
                        onChange={(e) => onUpdateData(index, 'new', parseInt(e.target.value) || 0)}
                        placeholder="新增"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => onRemoveWeek(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{data.week}</div>
                      <div className="text-sm text-gray-600">辭庫總數: {data.total}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">+{data.new}</div>
                    <div className="text-sm text-gray-600">新增</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h5 className="font-semibold text-gray-800">更新趨勢分析</h5>
          </div>
          <p className="text-sm text-gray-700">
            辭庫從6月的{juneTotal}個詞條擴充至7月的{julyTotal}個詞條，淨成長{netGrowth}個詞條，
            增長率達{Math.round((netGrowth / juneTotal) * 100)}%，顯示語音轉文字系統的持續優化與完善。
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const KnowledgeBaseStats = ({ 
  isEditing, 
  knowledgeBaseData, 
  onEdit, 
  onSave, 
  onCancel, 
  onUpdateData, 
  onAddItem, 
  onRemoveItem 
}: {
  isEditing: boolean
  knowledgeBaseData: { category: string; description: string; details: string }[]
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onUpdateData: (index: number, field: 'category' | 'description' | 'details', value: string) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
}) => {
  const totalArticles = 538 // 7月總文章數
  const previousMonthArticles = 236 // 6月總文章數
  const monthlyIncrease = totalArticles - previousMonthArticles // 本月增加文章數

  // 詳細分類數據
  const categoryData = [
    {
      category: "主要問題彙編",
      icon: "📋",
      topics: [
        { name: "債務", june: 39, july: 97, increase: 58 },
        { name: "政府救助資源", june: 52, july: 101, increase: 49 },
        { name: "罹病求助", june: 12, july: 65, increase: 53 },
        { name: "民間社會資源", june: 6, july: 15, increase: 9 }
      ]
    },
    {
      category: "不同對象需求",
      icon: "👥",
      topics: [
        { name: "身心障礙領域", june: 21, july: 57, increase: 36 },
        { name: "兒少領域", june: 16, july: 55, increase: 39 },
        { name: "成人領域", june: 23, july: 62, increase: 39 },
        { name: "銀髮族領域", june: 11, july: 53, increase: 42 },
        { name: "同志領域", june: 2, july: 4, increase: 2 },
        { name: "婦女領域", june: 2, july: 14, increase: 12 },
        { name: "原住民領域", june: 0, july: 7, increase: 7 },
        { name: "新住民領域", june: 0, july: 14, increase: 14 },
        { name: "單親領域", june: 0, july: 24, increase: 24 },
        { name: "親子領域", june: 2, july: 27, increase: 25 },
        { name: "醫療需求者領域", june: 5, july: 26, increase: 21 }
      ]
    },
    {
      category: "家庭重大事件",
      icon: "🏠",
      topics: [
        { name: "生育懷孕", june: 5, july: 16, increase: 11 },
        { name: "銀髮族照顧", june: 11, july: 50, increase: 39 },
        { name: "關係人死亡/失蹤", june: 3, july: 8, increase: 5 },
        { name: "關係人身障", june: 16, july: 53, increase: 37 },
        { name: "婚姻", june: 7, july: 17, increase: 10 },
        { name: "意外", june: 17, july: 47, increase: 30 },
        { name: "就業", june: 12, july: 82, increase: 70 },
        { name: "詐騙", june: 10, july: 13, increase: 3 },
        { name: "關係人入監", june: 2, july: 19, increase: 17 },
        { name: "買車", june: 2, july: 9, increase: 7 },
        { name: "買房", june: 5, july: 11, increase: 6 },
        { name: "繼承", june: 4, july: 7, increase: 3 },
        { name: "創業", june: 16, july: 33, increase: 17 },
        { name: "退休", june: 3, july: 13, increase: 10 }
      ]
    },
    {
      category: "評估與輔導觀點",
      icon: "🎓",
      topics: [
        { name: "專業知能", june: 34, july: 36, increase: 2 },
        { name: "工作坊", june: 3, july: 4, increase: 1 },
        { name: "課程摘要", june: 3, july: 11, increase: 8 },
        { name: "研討會", june: 3, july: 3, increase: 0 },
        { name: "影片專區", june: 0, july: 4, increase: 4 }
      ]
    },
    {
      category: "財務管理與規劃",
      icon: "💰",
      topics: [
        { name: "管理技巧", june: 28, july: 97, increase: 69 }
      ]
    },
    {
      category: "政策法規",
      icon: "📜",
      topics: [
        { name: "法規", june: 30, july: 41, increase: 11 },
        { name: "政策", june: 0, july: 3, increase: 3 }
      ]
    }
  ]

  return (
    <Card className="shadow-lg border border-gray-200 bg-white">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            <CardTitle className="text-2xl">知識庫擴充統計</CardTitle>
          </div>
          {!isEditing ? (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-green-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              編輯
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={onSave}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-green-600"
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-gray-600"
              >
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-green-100">
          知識庫內容擴充與品質提升統計
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">{totalArticles}</div>
            <div className="text-sm text-gray-600">7月總文章數</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">{previousMonthArticles}</div>
            <div className="text-sm text-gray-600">6月總文章數</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">{monthlyIncrease}</div>
            <div className="text-sm text-gray-600">本月增加文章數</div>
          </div>
        </div>
        
        {/* 詳細分類統計 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-green-600" />
              <h4 className="font-bold text-gray-800 text-xl">詳細分類統計</h4>
            </div>
            <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              共 {categoryData.length} 個主要分類
            </div>
          </div>
          
          {categoryData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* 分類標題 */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 px-6 py-4 border-b-2 border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h5 className="font-bold text-gray-800 text-xl">{category.category}</h5>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-medium text-gray-600">
                          6月: <span className="text-blue-600 font-bold">{category.topics.reduce((sum, topic) => sum + topic.june, 0)}</span>篇
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          7月: <span className="text-green-600 font-bold">{category.topics.reduce((sum, topic) => sum + topic.july, 0)}</span>篇
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          增加: <span className="text-purple-600 font-bold">+{category.topics.reduce((sum, topic) => sum + topic.increase, 0)}</span>篇
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold px-4 py-2 rounded-full shadow-md ${
                    category.topics.reduce((sum, topic) => sum + topic.increase, 0) > 0 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-400 text-white'
                  }`}>
                    +{category.topics.reduce((sum, topic) => sum + topic.increase, 0)}
                  </div>
                </div>
              </div>
              
              {/* 主題列表 */}
              <div className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {category.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-semibold text-gray-800 text-base">{topic.name}</h6>
                        <div className={`text-sm font-bold px-3 py-2 rounded-full shadow-sm ${
                          topic.increase > 0 
                            ? 'bg-green-500 text-white' 
                            : topic.increase === 0 
                              ? 'bg-gray-400 text-white'
                              : 'bg-red-500 text-white'
                        }`}>
                          {topic.increase > 0 ? '+' : ''}{topic.increase}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                        <span className="font-medium">6月: {topic.june}</span>
                        <span className="text-gray-400 text-lg">→</span>
                        <span className="font-medium">7月: {topic.july}</span>
                      </div>
                      {topic.increase > 0 && (
                        <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                          <div className="text-sm font-semibold text-green-700">
                            增長率: {Math.round((topic.increase / topic.june) * 100)}%
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 增長分析 */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-2 border-blue-300">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h5 className="font-bold text-gray-800 text-lg">增長分析</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-300 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {categoryData.reduce((sum, cat) => sum + cat.topics.filter(t => t.increase > 0).length, 0)}
              </div>
              <div className="text-sm font-semibold text-gray-700">增長主題數</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-green-300 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((categoryData.reduce((sum, cat) => sum + cat.topics.filter(t => t.increase > 0).length, 0) / 
                  categoryData.reduce((sum, cat) => sum + cat.topics.length, 0)) * 100)}%
              </div>
              <div className="text-sm font-semibold text-gray-700">增長主題比例</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-purple-300 shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {categoryData.reduce((sum, cat) => {
                  const maxIncrease = Math.max(...cat.topics.map(t => t.increase))
                  return sum + maxIncrease
                }, 0)}
              </div>
              <div className="text-sm font-semibold text-gray-700">最大單項增長</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h5 className="font-semibold text-gray-800">擴充成果分析</h5>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>整體增長：</strong>知識庫文章數從6月的{previousMonthArticles}篇增加到7月的{totalArticles}篇，
              本月新增{monthlyIncrease}篇文章，增長率達{Math.round((monthlyIncrease / previousMonthArticles) * 100)}%。
            </p>
            <p>
              <strong>分類覆蓋：</strong>涵蓋{categoryData.length}個主要分類，包括主要問題彙編、不同對象需求、
              家庭重大事件、評估與輔導觀點、財務管理與規劃、政策法規等領域。
            </p>
            <p>
              <strong>重點增長領域：</strong>就業相關文章增長最多（+70篇），其次是財務管理技巧（+69篇）、
              債務問題（+58篇）、罹病求助（+53篇）等，顯示知識庫內容更加全面和實用。
            </p>
            <p>
              <strong>新增服務對象：</strong>新增原住民、新住民、單親等領域的專業內容，
              擴展了服務覆蓋範圍，為更多群體提供專業支持。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
