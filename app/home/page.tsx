import { PostFeed } from "@/components/post-feed"
import { PageHeader } from "@/components/page-header"

export default function HomePage() {
  return (
    <main className="space-y-4">
      <PageHeader title="Home" />
      <PostFeed />
    </main>
  )
}
