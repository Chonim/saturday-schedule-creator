export type Patient = {
  room: number;
  name: string;
  isRefused?: boolean;
  isOs?: boolean;
  isSixth?: boolean;
  isFromLastweek?: boolean;
};

export type Patients = Patient[]