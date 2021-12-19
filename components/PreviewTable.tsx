import React from 'react'
import styled from "@emotion/styled";
import { Patient } from '@type/patientTypes';

type PreviewTableProps = {
  patientList: Patient[] | string
};

const PreviewTable = ({ patientList }: PreviewTableProps) => {
  const isFluList = typeof patientList === 'string'
  return (
    <PreviewTableWrapper>
      <table>
        <thead>
          <tr>
            {!isFluList && <th>병실</th>}
            <th>이름</th>
          </tr>
        </thead>
        <tbody>
          {isFluList ? (
            <tr>
              <td>{patientList}</td>
            </tr>
          ) : (
            (patientList as Patient[])?.map(({ room, name }, index) => (
              <tr key={`${room}-${name}`}>
                <td>{index + 1}</td>
                <td>{room}</td>
                <td>{name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </PreviewTableWrapper>
  );
};

const PreviewTableWrapper = styled.div`
  height: 50.5rem;
  overflow: scroll;
  width: 12.5rem;
`;

export default PreviewTable
