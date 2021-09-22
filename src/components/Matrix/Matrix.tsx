import React, { useContext } from "react";
import { useCollectionSize } from "../../hooks/useRouteParams";
import { SocketConnectionContext } from "../../hooks/useSocketConnection";
type Props = {
  matrix?: { backgroundColor: string }[][];
};
const Matrix: React.FC<Props> = ({ matrix, children }) => {
  const size = useCollectionSize();
  const { isActive } = useContext(SocketConnectionContext);
  if (!((children || matrix) as unknown[])?.length) return null;
  if (!isActive) return null;
  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        gridTemplateColumns: `repeat(${size}, 1px)`,
        backgroundColor: "#f7f8fa",
        border: "1px solid #d4d6da",
        width: "auto",
        padding: size * 0.3,
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
