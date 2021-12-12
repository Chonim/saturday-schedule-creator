export type Patient = {
  room: number;
  name: string;
  isRefusing?: boolean;
  isOs?: boolean;
  isSixth?: boolean;
  isFromLastweek?: boolean;
};

export type Patients = Patient[]