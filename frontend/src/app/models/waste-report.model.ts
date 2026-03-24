export interface WasteReport {
  id: string;
  title: string;
  description: string;
  category: WasteCategory;
  status: ReportStatus;
  location: Location;
  imageUrl?: string;
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  estimatedResolution?: Date;
  priority: Priority;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  barangay: string;
  city: string;
}

export enum WasteCategory {
  GARBAGE_UNCOLLECTED = 'GARBAGE_UNCOLLECTED',
  ILLEGAL_DUMPING = 'ILLEGAL_DUMPING',
  WASTE_PILE_UP = 'WASTE_PILE_UP',
  RECYCLABLE_WASTE = 'RECYCLABLE_WASTE',
  HAZARDOUS_WASTE = 'HAZARDOUS_WASTE',
  OTHER = 'OTHER'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  barangay: string;
}

export enum UserRole {
  RESIDENT = 'RESIDENT',
  BARANGAY_OFFICIAL = 'BARANGAY_OFFICIAL',
  WASTE_MANAGEMENT = 'WASTE_MANAGEMENT',
  ADMIN = 'ADMIN'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  reportId?: string;
}

export enum NotificationType {
  NEW_REPORT = 'NEW_REPORT',
  STATUS_UPDATE = 'STATUS_UPDATE',
  ASSIGNMENT = 'ASSIGNMENT',
  RESOLUTION = 'RESOLUTION',
  URGENT_ALERT = 'URGENT_ALERT'
}
