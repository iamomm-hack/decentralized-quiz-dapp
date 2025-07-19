"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Send, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QuizCreatorProps {
  account: string
  onQuizCreated: (quiz: any) => void
}

export default function QuizCreator({ account, onQuizCreated }: QuizCreatorProps) {
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [duration, setDuration] = useState(300) // 5 minutes default
  const [isCreating, setIsCreating] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState<any>(null)

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const createQuiz = async () => {
    if (!quizTitle.trim() || options.some((opt) => !opt.trim())) {
      return
    }

    setIsCreating(true)

    try {
      // Simulate smart contract deployment
      const quiz = {
        id: Date.now(),
        title: quizTitle,
        description: quizDescription,
        options: options.filter((opt) => opt.trim()),
        duration,
        creator: account,
        votes: options.map(() => 0),
        voters: [],
        createdAt: new Date(),
        isActive: true,
      }

      // Store in localStorage for demo (in real app, this would be on blockchain)
      localStorage.setItem(`quiz_${quiz.id}`, JSON.stringify(quiz))
      localStorage.setItem("activeQuiz", JSON.stringify(quiz))

      setActiveQuiz(quiz)
      onQuizCreated(quiz)

      // Reset form
      setQuizTitle("")
      setQuizDescription("")
      setOptions(["", ""])
      setDuration(300)
    } catch (error) {
      console.error("Error creating quiz:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const endQuiz = () => {
    if (activeQuiz) {
      const updatedQuiz = { ...activeQuiz, isActive: false }
      localStorage.setItem(`quiz_${activeQuiz.id}`, JSON.stringify(updatedQuiz))
      localStorage.removeItem("activeQuiz")
      setActiveQuiz(null)
      onQuizCreated(updatedQuiz)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 Create New Quiz
            <Badge variant="secondary">Teacher Panel</Badge>
          </CardTitle>
          <CardDescription>Create a decentralized quiz for your students to vote on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="e.g., What is the capital of France?"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional context or instructions..."
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <Button variant="outline" size="sm" onClick={addOption} disabled={options.length >= 6}>
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button variant="outline" size="icon" onClick={() => removeOption(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              min="60"
              max="3600"
              value={duration}
              onChange={(e) => setDuration(Number.parseInt(e.target.value))}
            />
          </div>

          <Button
            onClick={createQuiz}
            disabled={isCreating || !quizTitle.trim() || options.some((opt) => !opt.trim())}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isCreating ? "Creating Quiz..." : "Deploy Quiz to Blockchain"}
          </Button>
        </CardContent>
      </Card>

      {activeQuiz && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                🟢 Active Quiz
                <Badge className="bg-green-600">Live</Badge>
              </span>
              <Button variant="destructive" size="sm" onClick={endQuiz}>
                <Clock className="w-4 h-4 mr-2" />
                End Quiz
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Quiz "{activeQuiz.title}" is now live! Students can connect their wallets and vote. Share this page with
                your students to participate.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
