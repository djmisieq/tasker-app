import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { UpcomingMeetings } from "@/components/upcoming-meetings"
import { PriorityTasks } from "@/components/priority-tasks"
import { WelcomeBanner } from "@/components/welcome-banner"

export default function Home() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <WelcomeBanner />

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingMeetings />
        <PriorityTasks />
      </div>

      <RecentActivity />
    </div>
  )
}