import type { NextPage } from 'next'
import React, { useRef, useState } from 'react'
import styled from "@emotion/styled";
import {
  mergeOldAndNewList,
  parseList,
  createPatientsInFirst,
} from "@utils/patientHelpers";
import { Patient } from '@type/patientTypes';
import PreviewTable from '@components/PreviewTable'

const ROWS = 50

const Home: NextPage = () => {
  const previousPatientsInput = useRef<HTMLTextAreaElement>(null);
  const patientsFromLastWeekInput = useRef<HTMLTextAreaElement>(null);
  const dischargedPatientInput = useRef<HTMLTextAreaElement>(null);

  const sixthPatientsInput = useRef<HTMLTextAreaElement>(null);
  const osPatientsInput = useRef<HTMLTextAreaElement>(null);
  const patientsCameThistWeekInput = useRef<HTMLTextAreaElement>(null);
  const refusingPatientsInput = useRef<HTMLTextAreaElement>(null);
  const startingPatientInput = useRef<HTMLTextAreaElement>(null);
  
  const [mergedPatientList, setMergedPatientList] = useState<Patient[]>([])
  const [patientsInFirstList, setPatientsInFirstList] = useState<Patient[]>([]);

  // FIXME: remove it
  const handlePreviousPatientsInputChange = (target: HTMLTextAreaElement) => {
    console.dir(target);
    const { value } = target
    console.log(value);
    console.log(parseList(value));
  };

  const createPatientList = () => {
    const previousPatientList = parseList(previousPatientsInput?.current?.value || '');
    const newPatientList = parseList(patientsFromLastWeekInput?.current?.value || '');
    const dischargedPatientList = parseList(
      dischargedPatientInput?.current?.value || ""
    );
    const mergedList = mergeOldAndNewList({
      previousPatientList,
      newPatientList,
      dischargedPatientList,
    });
    setMergedPatientList(mergedList);
  }

  const createFirstList = () => {
    const parsedSixthPatients = parseList(
      sixthPatientsInput?.current?.value || ""
    );
    const parsedOsPatients = parseList(osPatientsInput?.current?.value || "");
    const parsedPatientsCameThistWeek = parseList(
      patientsCameThistWeekInput?.current?.value || ""
    );
    const parsedRefusingPatients = parseList(
      refusingPatientsInput?.current?.value || ""
    );
    const parsedStartingPatientInput = parseList(
      startingPatientInput?.current?.value || ""
    )[0];
    const patientsInFirst = createPatientsInFirst({
      allList: mergedPatientList,
      sixthPatients: parsedSixthPatients,
      osPatients: parsedOsPatients,
      patientsCameThistWeek: parsedPatientsCameThistWeek,
      refusingPatients: parsedRefusingPatients,
      startingPatient: parsedStartingPatientInput,
    });

    setPatientsInFirstList(patientsInFirst);
  }

  return (
    <InputsContainer>
      <section>
        <h2>리스트 생성</h2>
        <div>
          <div>
            <p>기존 환자 리스트</p>
            <textarea
              rows={ROWS}
              ref={previousPatientsInput}
              onInput={(e) =>
                handlePreviousPatientsInputChange(
                  e.target as HTMLTextAreaElement
                )
              }
            />
          </div>

          <div>
            <p>저번주 입원</p>
            <textarea rows={ROWS} ref={patientsFromLastWeekInput} />
          </div>

          <div>
            <p>퇴원</p>
            <textarea rows={ROWS} ref={dischargedPatientInput} />
          </div>

          <div>
            <PreviewTable patientList={mergedPatientList} />
          </div>
        </div>
        <button onClick={createPatientList}>생성하기</button>
      </section>

      {/* first */}
      <section>
        <h2>1번 스케줄</h2>
        <div>
          <div>
            <p>6병듕</p>
            <textarea rows={ROWS} ref={sixthPatientsInput} />
          </div>

          <div>
            <p>OS환자</p>
            <textarea rows={ROWS} ref={osPatientsInput} />
          </div>

          <div>
            <p>이번주입원</p>
            <textarea rows={ROWS} ref={patientsCameThistWeekInput} />
          </div>

          <div>
            <p>거절</p>
            <textarea rows={ROWS} ref={refusingPatientsInput} />
          </div>

          <div>
            <p>잔여 시작환자</p>
            {/* 505 한성진 */}
            <textarea rows={ROWS} ref={startingPatientInput} />
          </div>

          <div>
            <PreviewTable patientList={patientsInFirstList} />
          </div>
        </div>
        <button onClick={createFirstList}>생성하기</button>
      </section>
    </InputsContainer>
  );
}

const InputsContainer = styled.div`
  & > section > div {
    display: flex;
    & > div {
      &:nth-of-type(n+2) {
        margin-left: 1rem;
      }
      & > p {
        text-align: center;
      }
    }
  }
`

export default Home
