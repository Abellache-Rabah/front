import { CreatePost } from "@/components/create-post"
import { PageHeader } from "@/components/page-header"

export default function PublishPage() {
  return (
    <main className="space-y-4">
      <PageHeader title="New Post" />
      <CreatePost />
    </main>
  )
}
