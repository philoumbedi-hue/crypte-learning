import { requireRole } from "@/lib/rbac";
import { getDashboardStats } from "@/actions/analytics";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";

export default async function AdminPage() {
    const session = await requireRole("TEACHER").catch(() => null);

    if (!session) {
        return null; // Layout already handles redirect
    }

    const userRole = session.user.role;

    const stats = await getDashboardStats();

    return (
        <div className="p-8">
            <AnalyticsDashboard stats={stats} userRole={userRole} />
        </div>
    );
}

