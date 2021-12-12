import { Patient } from "../type/patientTypes";

export const parseList = (originalList: string) => {
  const patientList: string[] = originalList.split("\n");
  const patientArray = patientList
    .map((patient: string) => patient.split("\t"))
    .filter((patient) => patient.length > 1);
  const finalPatientArray = patientArray.map(([room, name]) => {
    const [nameString, additionalComment = false] = name.split(" ");
    const isRefused = additionalComment === "당분간x";
    return {
      room: +room,
      name: nameString,
      isRefused,
    } as Patient;
  });
  return finalPatientArray;
};

const checkIdentical = (patient: Patient, patienToCompare: Patient) => {
  return (
    patient.room === patienToCompare.room &&
    patient.name === patienToCompare.name
  );
}

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
  const checkAlreadyInList = (patientToCheck: Patient) =>
    previousPatientList.some((previousPatent: Patient) => {
      return checkIdentical(previousPatent, patientToCheck)
    });
  newPatientList.forEach((newPatient: Patient) => {
    const isAlreadyInList = checkAlreadyInList(newPatient);
    if (!isAlreadyInList) {
      finalPatientList.push(newPatient);
    }
  });
  dischargedPatientList.forEach((dischargedPatient: Patient) => {
    const index = finalPatientList.findIndex(
      (patient) =>
      checkIdentical(patient, dischargedPatient)
      );
    const isAlreadyInList = index > -1;
    if (isAlreadyInList) {
      finalPatientList.splice(index, 1);
    }
  });
  return sortPatientsByName(finalPatientList);
};

export const sortPatientsByName = (patientList: Patient[]) => {
  return patientList.sort((a: Patient, b: Patient) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}