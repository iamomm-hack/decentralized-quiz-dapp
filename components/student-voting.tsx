"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Vote, Clock, CheckCircle, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StudentVotingProps {
  account: string
}

export default function StudentVoting({ account }: StudentVotingProps) {
  const [activeQuiz, setActiveQuiz] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    // Check for active quiz
    const checkActiveQuiz = () => {
      const quiz = localStorage.getItem("activeQuiz")
      if (quiz) {
        const parsedQuiz = JSON.parse(quiz)
        setActiveQuiz(parsedQuiz)

        // Check if user has already voted
        const hasUserVoted = parsedQuiz.voters.includes(account)
        setHasVoted(hasUserVoted)

        // Calculate time left
        const elapsed = (Date.now() - new Date(parsedQuiz.createdAt).getTime()) / 1000
        const remaining = Math.max(0, parsedQuiz.duration - elapsed)
        setTimeLeft(remaining)
      }
    }

    checkActiveQuiz()
    const interval = setInterval(checkActiveQuiz, 1000)

    return () => clearInterval(interval)
  }, [account])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const submitVote = async () => {
    if (selectedOption === null || !activeQuiz) return

    setIsVoting(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update quiz data
      const updatedQuiz = {
        ...activeQuiz,
        votes: activeQuiz.votes.map((count: number, index: number) => (index === selectedOption ? count + 1 : count)),
        voters: [...activeQuiz.voters, account],
      }

      localStorage.setItem(`quiz_${activeQuiz.id}`, JSON.stringify(updatedQuiz))
      localStorage.setItem("activeQuiz", JSON.stringify(updatedQuiz))

      setActiveQuiz(updatedQuiz)
      setHasVoted(true)
    } catch (error) {
      console.error("Error submitting vote:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!activeQuiz) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>No Active Quiz</CardTitle>
          <CardDescription>Waiting for your teacher to create a quiz...</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Vote className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Check back soon for new quizzes!</p>
        </CardContent>
      </Card>
    )
  }

  if (timeLeft <= 0 && activeQuiz.isActive) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Quiz Ended</CardTitle>
          <CardDescription>This quiz has expired</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-600">The voting period has ended.</p>
        </CardContent>
      </Card>
    )
  }

  const totalVotes = activeQuiz.votes.reduce((sum: number, count: number) => sum + count, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                🎓 Student Voting
                <Badge variant="secondary">Live Quiz</Badge>
              </CardTitle>
              <CardDescription>Cast your vote securely on the blockchain</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {totalVotes} votes
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{activeQuiz.title}</CardTitle>
          {activeQuiz.description && <CardDescription>{activeQuiz.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          {hasVoted ? (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your vote has been recorded on the blockchain! Transaction hash: 0x
                  {Math.random().toString(16).substr(2, 8)}...
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium">Live Results:</h4>
                {activeQuiz.options.map((option: string, index: number) => {
                  const votes = activeQuiz.votes[index]
                  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
                  const isSelected = index === selectedOption

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{option}</span>
                        <span className="text-sm text-gray-600">
                          {votes} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {activeQuiz.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedOption === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedOption === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {selectedOption === index && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={submitVote}
                disabled={selectedOption === null || isVoting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Vote className="w-4 h-4 mr-2" />
                {isVoting ? "Submitting to Blockchain..." : "Submit Vote"}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Your vote will be recorded immutably on the blockchain
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
