import React from "react";
type Props = {
  items: { backgroundColor: string; width: number }[];
};
const List: React.FC<Props> = ({ items }) => {
  return (
    <ul>
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            background: item.backgroundColor,
            width: item.width,
          }}
        />
      ))}
    </ul>
  );
};
export default List;
