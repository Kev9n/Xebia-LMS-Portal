import { createFileRoute } from "@tanstack/react-router";

// Feature profile components
import { ProfileHeader } from "@/features/student/components/profile/ProfileHeader";
import {
  ProfileDetails,
  EnrolledCoursesList,
} from "@/features/student/components/profile/ProfileDetails";

export const Route = createFileRoute("/student/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Profile</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            View and manage your personal information and security settings.
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <ProfileHeader />

      {/* Personal Information Grid */}
      <ProfileDetails />

      {/* Enrolled Courses Summary */}
      <EnrolledCoursesList />
    </div>
  );
}
