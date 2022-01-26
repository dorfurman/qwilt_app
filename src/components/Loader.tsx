import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  const Loading = styled.h1`
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    font-size: 3em;
    text-shadow: 5px 5px 0px rgb(79, 164, 243);
  `;
  return (
    <div>
      <Loading>Loading...</Loading>
    </div>
  );
};

export default Loader;
