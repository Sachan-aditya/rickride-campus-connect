
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  user: any;
  onSave: (data: any) => void;
}

export default function ProfileForm(props: ProfileFormProps) {
  const { user } = props;
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
    role: user.role || "student",
    enrollmentNo: user.enrollmentNo || "",
    profilePicture: user.profilePicture || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSave(form);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={form.email}
              disabled
              className="w-full bg-muted cursor-not-allowed"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => setForm({ ...form, gender: value })}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={form.role.charAt(0).toUpperCase() + form.role.slice(1)}
              disabled
              className="w-full bg-muted cursor-not-allowed"
              readOnly
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 space-y-4">
          {form.role === 'driver' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone || ""}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rickshawPhoto">Rickshaw Photo <span className="text-red-500">*</span></Label>
                <Input
                  id="rickshawPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full"
                />
                {form.profilePicture && (
                  <div className="mt-2 relative rounded-lg overflow-hidden">
                    <img 
                      src={form.profilePicture} 
                      alt="Rickshaw" 
                      className="w-full h-48 object-cover border rounded-lg"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {form.role === 'student' && (
            <div className="space-y-2">
              <Label htmlFor="enrollmentNo">Enrollment No.</Label>
              <Input
                id="enrollmentNo"
                value={form.enrollmentNo || ''}
                onChange={e => setForm({ ...form, enrollmentNo: e.target.value })}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full md:w-auto"
      >
        Save Profile
      </Button>
    </form>
  );
}
