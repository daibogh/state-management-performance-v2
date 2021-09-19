import React from "react";
type Props = {
  matrix: { backgroundColor: string }[][];
};
const Matrix: React.FC<Props> = ({ matrix }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${matrix.length}, 1px)`,
      }}
    >
      {matrix.map((row, rowIdx) =>
        row.map((elem, columnIdx) => (
          <div
            key={`row=${rowIdx}-column=${columnIdx}`}
            style={{
              width: 1,
              height: 1,
              backgroundColor: elem.backgroundColor,
            }}
          />
        ))
      )}
    </div>
  );
};
export default Matrix;
