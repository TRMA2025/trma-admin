import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function Sekeleton({ totalTask }) {
  const getSekelton = () => {
    const newArr = [];

    for (let i = 0; i <= Number(totalTask); i += 1) {
      newArr.push(i);
    }
    return newArr;
  };
  return (
    <Box sx={{ width: '100%', marginTop: 2 }}>
      {getSekelton().map((x, i) => (
        <>
          <Skeleton animation="wave" style={{ height: 35, padding: 10 }} />
        </>
      ))}
    </Box>
  );
}
