import { FC } from 'react';

import { IDndContainerElement } from "../dnd-container";

import { TrelloListItem } from './trello-list-item';

import './trello-list.css';

interface Props extends IDndContainerElement {
  list: {
    id: string;
    items: Array<{
      id: string;
      title: string;
    }>;
  }
}

export const TrelloList: FC<Props> = ({ onDragOver, onDrop, onDragStart, isValidDropTarget, list }) => {
  return (
    <div
      className={`trello-list ${isValidDropTarget ? 'valid-target' : ''}`}
      onDrop={onDrop} 
      onDragOver={onDragOver} 
      onDragStart={onDragStart}
    >
      Trello List

      <div className='trello-list__container'>
        {list.items.map(item => {
          return (
            <TrelloListItem key={item.id} item={item} />
          );
        })}
      </div>
    </div>
  );
}