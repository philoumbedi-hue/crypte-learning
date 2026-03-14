const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const admins = ['philoumbedi@gmail.com', 'admin@crypte.com'];

    console.log('--- PURGE DE LA BASE DE DONNÉES (Fix) ---');

    try {
        const students = await prisma.user.findMany({
            where: {
                email: { notIn: admins }
            }
        });

        if (students.length === 0) {
            console.log('Aucun utilisateur à supprimer.');
            return;
        }

        console.log(`${students.length} utilisateurs identifiés pour suppression.`);

        for (const student of students) {
            console.log(`Purger : ${student.email}`);
            const userId = student.id;

            // 1. Delete AnswerAttempts via QuizAttempt link
            const attempts = await prisma.quizAttempt.findMany({ where: { userId }, select: { id: true } });
            const attemptIds = attempts.map(a => a.id);
            if (attemptIds.length > 0) {
                await prisma.answerAttempt.deleteMany({ where: { attemptId: { in: attemptIds } } }).catch(e => { });
            }

            // 2. Delete other direct relations
            await prisma.quizAttempt.deleteMany({ where: { userId } }).catch(e => { });
            await prisma.notification.deleteMany({ where: { userId } }).catch(e => { });
            await prisma.forumAnswer.deleteMany({ where: { userId } }).catch(e => { });
            await prisma.forumQuestion.deleteMany({ where: { userId } }).catch(e => { });
            await prisma.certificate.deleteMany({ where: { studentId: userId } }).catch(e => { });
            await prisma.transaction.deleteMany({ where: { userId } }).catch(e => { });
            await prisma.videoProgress.deleteMany({ where: { studentId: userId } }).catch(e => { });
            await prisma.enrollment.deleteMany({ where: { studentId: userId } }).catch(e => { });
            await prisma.progress.deleteMany({ where: { studentId: userId } }).catch(e => { });
            await prisma.activityLog.deleteMany({ where: { userId } }).catch(e => { });
            await prisma.application.deleteMany({ where: { userId } }).catch(e => { });
            await prisma.result.deleteMany({ where: { studentId: userId } }).catch(e => { });

            // 3. Finally delete the user
            await prisma.user.delete({ where: { id: userId } }).catch(err => {
                console.error(`❌ Erreur sur ${student.email} :`, err.message);
            });
        }

        console.log('✅ Purge terminée.');
    } catch (error) {
        console.error('Erreur globale:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
