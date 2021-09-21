import React from "react";
import { useCollectionSize } from "../../hooks/useRouteParams";
type Props = {
  matrix?: { backgroundColor: string }[][];
};
const Matrix: React.FC<Props> = ({ matrix, children }) => {
  const size = useCollectionSize();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1px)`,
      }}
    >
      {children ||
        matrix?.map((row, rowIdx) =>
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
