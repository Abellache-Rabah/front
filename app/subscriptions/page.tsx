import { PageHeader } from "@/components/page-header"
import { SubscriptionManager } from "@/components/subscription-manager"

export default function SubscriptionsPage() {
  return (
    <main className="space-y-4">
      <PageHeader title="Subscriptions" />
      <SubscriptionManager />
    </main>
  )
}
