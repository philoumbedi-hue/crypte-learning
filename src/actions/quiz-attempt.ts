"use server"

import db from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function submitQuiz({
    userId,
    quizId,
    answers
}: {
    userId: string
    quizId: string
    answers: { questionId: string; selectedValue: string }[]
}) {
    const quiz = await db.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true }
    })

    if (!quiz) {
        throw new Error("Quiz introuvable")
    }

    let correctCount = 0

    const answerResults = answers.map((answer) => {
        const question = quiz.questions.find(
            (q) => q.id === answer.questionId
        )

        const isCorrect =
            question && question.correctAnswer === answer.selectedValue

        if (isCorrect) correctCount++

        return {
            questionId: answer.questionId,
            selectedValue: answer.selectedValue,
            isCorrect: !!isCorrect
        }
    })

    const score =
        quiz.questions.length > 0
            ? (correctCount / quiz.questions.length) * 100
            : 0

    await db.quizAttempt.create({
        data: {
            userId,
            quizId,
            score,
            answers: {
                create: answerResults
            }
        }
    })

    revalidatePath("/dashboard")

    return {
        score,
        passed: score >= 70
    }
}
