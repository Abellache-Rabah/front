import { PageHeader } from "@/components/page-header"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <main className="space-y-4 px-4 sm:px-6 lg:px-8 text-gray-100">
      <PageHeader title="Settings" />
      <SettingsForm />
    </main>
  )
}
