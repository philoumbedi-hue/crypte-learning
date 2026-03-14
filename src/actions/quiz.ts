"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireRole, logActivity, Actions } from "@/lib/rbac";


export async function createQuiz(data: {
    title: string;
    moduleId: string;
    description?: string;
    timeLimit?: number;
    maxAttempts?: number;
    passingScore?: number;
    weight?: number;
    order?: number;
}) {
    const session = await requireRole("TEACHER");

    // Vérifier ownership via module -> cours
    const mod = await db.module.findUnique({
        where: { id: data.moduleId },
        include: { course: { select: { authorId: true, id: true } } }
    });

    if (!mod) throw new Error("Module non trouvé");

    if (session.user.role === "TEACHER" && mod.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'avez pas le droit d'ajouter des quiz à ce cours.");
    }

    const quiz = await db.quiz.create({
        data: {
            title: data.title,
            moduleId: data.moduleId,
            description: data.description,
            timeLimit: data.timeLimit,
            maxAttempts: data.maxAttempts ?? 3,
            passingScore: data.passingScore ?? 70,
            weight: data.weight ?? 1,
            order: data.order ?? 0,
        },
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.CREATE_QUIZ,
        entity: "Quiz",
        entityId: quiz.id,
    });

    revalidatePath(`/admin/courses/${mod.course.id}`);

    return quiz;
}

export async function deleteQuiz(id: string) {
    const session = await requireRole("TEACHER");

    const quizToDelete = await db.quiz.findUnique({
        where: { id },
        include: {
            module: {
                include: { course: { select: { authorId: true, id: true } } }
            }
        }
    });

    if (!quizToDelete) throw new Error("Quiz non trouvé");

    if (session.user.role === "TEACHER" && quizToDelete.module.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'avez pas le droit de supprimer ce quiz.");
    }

    await db.quiz.delete({
        where: { id }
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.DELETE_QUIZ,
        entity: "Quiz",
        entityId: id,
        metadata: { title: quizToDelete.title }
    });


    revalidatePath(`/admin/courses/${quizToDelete.module.course.id}`);

    return quizToDelete;
}

export async function createQuestion(data: {
    text: string;
    options: string[];
    correctAnswer: string;
    quizId: string
}) {
    const session = await requireRole("TEACHER");

    // Vérifier ownership via quiz -> module -> cours
    const quiz = await db.quiz.findUnique({
        where: { id: data.quizId },
        include: { module: { include: { course: { select: { authorId: true, id: true } } } } }
    });

    if (!quiz) throw new Error("Quiz non trouvé");

    if (session.user.role === "TEACHER" && quiz.module.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'avez pas le droit d'ajouter des questions à ce quiz.");
    }

    const question = await db.question.create({
        data: {
            text: data.text,
            options: data.options,
            correctAnswer: data.correctAnswer,
            quizId: data.quizId,
        }
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.EDIT_QUESTION,
        entity: "Question",
        entityId: question.id,
        metadata: { quizId: data.quizId }
    });

    revalidatePath(`/admin/courses/${quiz.module.course.id}`);

    return question;
}

export async function deleteQuestion(id: string) {
    const session = await requireRole("TEACHER");

    const questionToDelete = await db.question.findUnique({
        where: { id },
        include: {
            quiz: {
                include: {
                    module: {
                        include: { course: { select: { authorId: true, id: true } } }
                    }
                }
            }
        }
    });

    if (!questionToDelete) throw new Error("Question non trouvée");

    if (session.user.role === "TEACHER" && questionToDelete.quiz.module.course.authorId !== session.user.id) {
        throw new Error("FORBIDDEN: Vous n'avez pas le droit de supprimer cette question.");
    }

    await db.question.delete({
        where: { id }
    });

    await logActivity({
        userId: session.user.id,
        action: Actions.EDIT_QUESTION,
        entity: "Question",
        entityId: id,
        metadata: { status: "DELETED" }
    });


    revalidatePath(`/admin/courses/${questionToDelete.quiz.module.course.id}`);

    return questionToDelete;
}

