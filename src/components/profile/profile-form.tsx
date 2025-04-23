import { useState } from "react";

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.onSave(form);
  };

  const handlePhotoUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={form.email}
          disabled
          className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 text-gray-600"
          readOnly
        />
      </div>

      {user.role === 'driver' && (
        <div className="mb-4">
          <label className="block text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={form.phone || ""}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700">Gender</label>
        <select
          value={form.gender}
          onChange={e => setForm({ ...form, gender: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Role</label>
        <input
          value={form.role}
          disabled
          className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 text-gray-600"
          readOnly
        />
      </div>

      {form.role === 'driver' ? (
        <div className="mb-4">
          <label className="block text-gray-700">Rickshaw Photo <span className="text-red-500">*</span></label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="mt-1 block w-full"
          />
          {form.profilePicture && (
            <img src={form.profilePicture} alt="Rickshaw" className="mt-2 h-24 rounded shadow border" />
          )}
        </div>
      ) : (
        <>
          {form.role === 'student' && (
            <div className="mb-4">
              <label className="block text-gray-700">Enrollment No.</label>
              <input
                type="text"
                value={form.enrollmentNo || ''}
                onChange={e => setForm({ ...form, enrollmentNo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          )}
        </>
      )}

      <button
        type="submit"
        className="bg-[#4F8EF7] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
      >
        Save
      </button>
    </form>
  );
}
