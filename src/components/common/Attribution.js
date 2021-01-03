import React from 'react';
import styled from 'styled-components';

const AttributionFooter = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: 0;
`;

const Attribution = () => {
  return (
    <AttributionFooter>
      <span>
        Data provided by <a href="https://iexcloud.io/s/e70895ae">IEX Cloud</a>{' '}
        (Affiliate)
      </span>
    </AttributionFooter>
  );
};

export default Attribution;
