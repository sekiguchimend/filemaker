// StaffList の Props 型

import type { Staff } from './staff';

export interface StaffListItemProps {
  data: Staff;
}

export interface StaffListProps {
  staffList: Staff[];
}


