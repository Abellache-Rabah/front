import { PageHeader } from "@/components/page-header"
import { LiveFeed } from "@/components/live-feed"

export default function FeedPage() {
  return (
    <main className="space-y-4">
      <PageHeader title="Live Feed" />
      <LiveFeed />
    </main>
  )
}
