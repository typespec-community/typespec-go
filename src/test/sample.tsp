/**
 * Sample TypeSpec file to test the Go emitter
 * Demonstrates models, enums, and unions
 */

namespace SampleAPI;

/** Status of a task */
enum TaskStatus {
  pending,
  inProgress: "in_progress",
  completed,
  cancelled,
}

/** Priority level */
enum Priority {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
}

/** A user in the system */
model User {
  id: string;
  email: string;
  name: string;
  createdAt: utcDateTime;
  updatedAt?: utcDateTime;
}

/** A task to be completed */
model Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: User;
  dueDate?: plainDate;
  createdAt: utcDateTime;
}

/** Union type for different notification types */
union NotificationType {
  email: string,
  sms: string,
  push: string,
}

/** A project containing tasks */
model Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  owner: User;
  members: User[];
}
