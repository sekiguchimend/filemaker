// AttendanceTab の Props 型

import type { AttendingStaff, AttendingHostess } from './attendance';

export interface AttendingStaffItemProps {
  data: AttendingStaff;
}

export interface AttendingHostessItemProps {
  data: AttendingHostess;
}

export interface AttendanceTabProps {
  staffList: AttendingStaff[];
  hostessList: AttendingHostess[];
}


