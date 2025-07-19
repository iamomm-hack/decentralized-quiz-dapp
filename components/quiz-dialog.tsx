"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function QuizDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Quiz</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Quiz</DialogTitle>
          <DialogDescription>
            Enter a title for the quiz and start adding questions.
          </DialogDescription>
        </DialogHeader>
        <Input placeholder="Quiz Title" />
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
