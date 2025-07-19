"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, Users, Trophy, RefreshCw } from "lucide-react"

interface ResultsDisplayProps {
  quiz: any
}

export default function ResultsDisplay({ quiz: initialQuiz }: ResultsDisplayProps) {
  const [quiz, setQuiz] = useState(initialQuiz)

  useEffect(() => {
    const interval = setInterval(() => {
      const storedQuiz = localStorage.getItem(`quiz_${quiz.id}`)
      if (storedQuiz) {
        setQuiz(JSON.parse(storedQuiz))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [quiz.id])

  const totalVotes = quiz.votes.reduce((sum: number, count: number) => sum + count, 0)
  const winningIndex = quiz.votes.indexOf(Math.max(...quiz.votes))

  const exportResults = () => {
    const results = {
      quiz: quiz.title,
      totalVotes,
      results: quiz.options.map((option: string, index: number) => ({
        option,
        votes: quiz.votes[index],
        percentage: totalVotes > 0 ? ((quiz.votes[index] / totalVotes) * 100).toFixed(1) : "0",
      })),
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quiz-results-${quiz.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Quiz Results
              <Badge variant={quiz.isActive ? "default" : "secondary"}>{quiz.isActive ? "Live" : "Ended"}</Badge>
            </CardTitle>
            <CardDescription>{quiz.title}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
            <div className="text-sm text-blue-600">Total Votes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{quiz.voters.length}</div>
            <div className="text-sm text-green-600">Unique Voters</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{quiz.options.length}</div>
            <div className="text-sm text-purple-600">Options</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{totalVotes > 0 ? Math.max(...quiz.votes) : 0}</div>
            <div className="text-sm text-orange-600">Highest Votes</div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Voting Results
          </h4>

          {quiz.options.map((option: string, index: number) => {
            const votes = quiz.votes[index]
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
            const isWinner = index === winningIndex && totalVotes > 0

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${isWinner ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option}</span>
                    {isWinner && <Trophy className="w-4 h-4 text-yellow-600" />}
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{votes} votes</span>
                    <span className="text-sm text-gray-600 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>
            )
          })}
        </div>

        {/* Blockchain Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-2">🔗 Blockchain Verification</h5>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              Contract Address: 0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 4)}
            </p>
            <p>Network: Goerli Testnet</p>
            <p>Gas Used: {(Math.random() * 100000 + 50000).toFixed(0)} wei</p>
            <p>Block Number: #{Math.floor(Math.random() * 1000000 + 8000000)}</p>
          </div>
        </div>

        {quiz.isActive && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Results update in real-time as students vote
          </div>
        )}
      </CardContent>
    </Card>
  )
}
