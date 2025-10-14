'use client';

import { redirect } from 'next/navigation';

// This component now simply redirects to the default general settings page.
export default function SettingsPage() {
  redirect('/dashboard/settings/general');
}
