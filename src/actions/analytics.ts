"use server";

import db from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export async function getDashboardStats() {
    // Only accessible to SUPER_ADMIN or ADMIN (or users with specific analytics roles)
    await requireRole("TEACHER");

    const [
        totalStudents,
        totalCourses,
        certificatesIssued,
        recentEnrollments,
        totalRevenue,
        pendingApplications,
        liveNow,
        totalTeachers
    ] = await Promise.all([
        db.user.count({ where: { role: "STUDENT" } }),
        db.course.count(),
        db.certificate.count(),
        db.enrollment.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { student: { select: { name: true, email: true } }, course: { select: { title: true } } }
        }),
        db.transaction.aggregate({
            where: { status: "SUCCESS" },
            _sum: { amount: true }
        }),
        db.application.count({ where: { status: "PENDING" } }),
        db.liveSession.count({ where: { status: "LIVE" } }),
        db.user.count({ where: { role: "TEACHER" } })
    ]);

    // Generate chart data for the last 6 months
    const chartData = [];
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();

        const startDate = new Date(year, d.getMonth(), 1);
        const endDate = new Date(year, d.getMonth() + 1, 0, 23, 59, 59, 999);

        const enrollmentsThisMonth = await db.enrollment.count({
            where: { createdAt: { gte: startDate, lte: endDate } }
        });

        const completionsThisMonth = await db.videoProgress.count({
            where: {
                completed: true,
                updatedAt: { gte: startDate, lte: endDate }
            }
        });

        chartData.push({
            name: `${monthName}`,
            completions: completionsThisMonth,
            inscriptions: enrollmentsThisMonth
        });
    }

    return {
        totalStudents,
        totalCourses,
        certificatesIssued,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingApplications,
        liveNow,
        totalTeachers,
        recentEnrollments,
        chartData
    };
}
