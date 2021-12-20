import { Patient, Patients } from "../type/patientTypes";

export const parseList = (originalList: string) => {
  const patientList: string[] = originalList.split("\n");
  const patientArray = patientList
    .map((patient: string) => patient.split("\t"))
    .filter(([room, name]) => room && name);
  const finalPatientArray = patientArray.map(([room, name]) => {
    const [nameString, additionalComment = false] = name.split(" ");
    const isRefusing = additionalComment === "당분간x";
    return {
      room: +room,
      name: nameString,
      isRefusing,
    } as Patient;
  });
  return finalPatientArray;
};

const checkIdentical = (patient: Patient, patienToCompare: Patient) => {
  if (!patient || !patienToCompare) {
    return false;
  }
  return (
    patient.room === patienToCompare.room &&
    patient.name === patienToCompare.name
  );
};

export const mergeOldAndNewList = ({
  previousPatientList,
  newPatientList,
  dischargedPatientList,
}: {
  previousPatientList: Patient[];
  newPatientList: Patient[];
  dischargedPatientList: Patient[];
}) => {
  const finalPatientList = previousPatientList;
  newPatientList.forEach((newPatient: Patient) => {
    const isAlreadyInList = previousPatientList.some(
      (previousPatent: Patient) => {
        return checkIdentical(previousPatent, newPatient);
      }
    );
    if (!isAlreadyInList) {
      finalPatientList.push(newPatient);
    }
  });
  dischargedPatientList.forEach((dischargedPatient: Patient) => {
    const index = finalPatientList.findIndex((patient) =>
      checkIdentical(patient, dischargedPatient)
    );
    const isAlreadyInList = index > -1;
    if (isAlreadyInList) {
      finalPatientList.splice(index, 1);
    }
  });
  return sortPatientsByKey(finalPatientList, "name");
};

export const sortPatientsByKey = (
  patientList: Patient[],
  key: keyof Patient
) => {
  return patientList.sort((a: Patient, b: Patient) => {
    if ((a[key] || "") < (b[key] || "")) {
      return -1;
    }
    if ((a[key] || "") > (b[key] || "")) {
      return 1;
    }
    return 0;
  });
};

export const createPatientsInFirst = ({
  allList,
  sixthPatients,
  osPatients,
  patientsCameThistWeek,
  refusingPatients,
  startingPatient,
}: {
  allList: Patient[];
  sixthPatients: Patient[];
  osPatients: Patient[];
  patientsCameThistWeek: Patient[];
  refusingPatients: Patient[];
  startingPatient: Patient;
}) => {
  let patientsInFirst = [
    ...sixthPatients,
    ...osPatients,
    ...patientsCameThistWeek,
  ];
  const allListExceptRefusing = allList.filter(
    (patient) => !patient?.isRefusing
  );
  refusingPatients.forEach((refusingPatient) => {
    const index = allListExceptRefusing.findIndex((patient) =>
      checkIdentical(patient, refusingPatient)
    );
    if (index > -1) {
      allListExceptRefusing.splice(index, 1);
    }
  });
  const startingPatientIndex = allListExceptRefusing.findIndex((patient) =>
    checkIdentical(patient, startingPatient)
  );
  const restLength = 40 - patientsInFirst.length;
  const endIndex = startingPatientIndex + restLength;
  let indexEndFromStart = restLength - patientsInFirst.length;
  if (startingPatientIndex + restLength > allListExceptRefusing.length) {
    indexEndFromStart =
      startingPatientIndex + restLength - allListExceptRefusing.length;
  }
  let additionalPatients = allListExceptRefusing.slice(
    startingPatientIndex,
    endIndex
  );
  additionalPatients = [
    ...additionalPatients,
    ...allListExceptRefusing.slice(0, indexEndFromStart),
  ];
  patientsInFirst = [...patientsInFirst, ...additionalPatients];
  const sortedPatientsInFirst = sortPatientsByKey(patientsInFirst, "room");
  const lastPatient = additionalPatients[additionalPatients.length - 1];
  const lastPatientIndex = allListExceptRefusing.findIndex((patient: Patient) => {
    return checkIdentical(patient, lastPatient);
  })
  const startingPatientIndexInSecond = lastPatientIndex + 1;
  return {
    patientsInFirst: sortedPatientsInFirst,
    allListExceptRefusing,
    startingPatientIndexInSecond,
  };
};

export const getFluList = ({
  fluPatients,
  startName,
}: {
  fluPatients: string;
  startName: string;
}) => {
  const parsedFluList = fluPatients.split(" ");
  const startingPatientIndex = parsedFluList.indexOf(startName);
  const finalPatientIndex = startingPatientIndex + 7;
  let finalList = parsedFluList.slice(startingPatientIndex, finalPatientIndex);
  const fluFromStart =
    startingPatientIndex + 7 > parsedFluList.length
      ? parsedFluList.slice(0, 7 - finalList.length)
      : [];
  finalList = [...finalList, ...fluFromStart];
  return finalList.join(' ');
};
