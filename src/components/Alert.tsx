import React, { FC } from 'react';
import styled from 'styled-components';

const alert: React.FC<{ msg: string }> = ({ msg }) => {
  const AlertContainer = styled.div`
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    width: max-content;
    padding: 10px 30px;
    text-align: center;
  `;
  const AlertHeader = styled.h1`
    text-shadow: 5px 5px 0px red !important;
    font-size: 4em;
  `;
  const AlertMessage = styled.h3`
    font-size: 1.5em;
    padding-top: 20px;
  `;
  return (
    <AlertContainer>
      <AlertHeader>Alert</AlertHeader>
      <AlertMessage>{msg}</AlertMessage>
    </AlertContainer>
  );
};

export default alert;
