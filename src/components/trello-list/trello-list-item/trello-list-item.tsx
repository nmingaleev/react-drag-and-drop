import { FC } from 'react';

interface Props {
  item: {
    id: string;
    title: string;
  },
}

export const TrelloListItem: FC<Props> = ({ item }) => {
  return (
    <div draggable={true} id={item.id}>
      {item.title}
    </div>
  );
};
