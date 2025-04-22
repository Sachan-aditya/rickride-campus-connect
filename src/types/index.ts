
export interface User {
  id: string;
  name: string;
  email: string;
  enrollmentNo?: string;
  role: 'student' | 'driver' | 'admin';
  profilePicture?: string;
  phone?: string;
  gender?: string;
}

export interface Ride {
  id: string;
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  riders: string[];
  maxCapacity: number;
  created: Date;
  startTime?: Date;
  endTime?: Date;
  location?: {
    lat: number;
    lng: number;
  };
  eta?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  poster: string;
  date: Date;
  createdBy: string;
  visibility: 'public' | 'private';
  location?: string;
  attendees?: number;
  registrationLink?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ride' | 'event';
  message: string;
  read: boolean;
  created: Date;
  relatedId?: string;
}

export interface Location {
  id: string;
  name: string;
  isPopular: boolean;
}
