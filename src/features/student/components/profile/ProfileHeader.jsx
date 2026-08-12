import { Pencil, Lock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { studentProfile } from "@/features/student/mocks/dummy-data";
import { toast } from "sonner";

/**
 * Profile hero card with avatar, name, role badges, and action buttons.
 */
export function ProfileHeader() {
  const initials = studentProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleEditProfile = () => {
    toast.info("Edit Profile", {
      description: "Profile editing will be available after backend integration.",
    });
  };

  const handleChangePassword = () => {
    toast.info("Change Password", {
      description: "Password change will be available after backend integration.",
    });
  };

  return (
    <Card className="glass relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
      <CardContent className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 h-24 w-24 rounded-full bg-primary/10 border-4 border-background shadow-lg flex items-center justify-center text-3xl font-bold text-primary">
            {initials || <User className="h-10 w-10" />}
          </div>

          {/* Name & Role */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight">{studentProfile.name}</h2>
            <p className="text-muted-foreground mt-1">{studentProfile.role}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {studentProfile.batch}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {studentProfile.university}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Button
              onClick={handleEditProfile}
              className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={handleChangePassword}
              className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
