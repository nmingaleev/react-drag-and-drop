import { useState } from 'react';
import './App.css';

import { DndContainer, TrelloList, IMoveEvent } from './components';

import { list1, list2, list3, list4 } from './constants';

function App() {
  const [lists, setLists] = useState([list1, list2, list3, list4]);

  const handleMove = ({ from, to, elementId }: IMoveEvent) => {
    if (!from || !to) return;

    setLists(oldLists => {
      const fromList = oldLists.find(list => list.id === from);
      if (!fromList) return oldLists;

      const toList = oldLists.find(list => list.id === to);
      if (!toList) return oldLists;

      const elementToMove = fromList?.items.find(item => item.id === elementId);
      if (!elementToMove) return oldLists;

      fromList.items = fromList?.items.filter(item => item.id !== elementToMove.id);
      toList.items = [...toList.items, elementToMove];

      return [...oldLists];
    });
  }

  return (
    <div className="App">
      {lists.map(list => {
        return (
          <DndContainer
            key={list.id}
            id={list.id}
            groupId={list.groupId}
            allowedGroups={list.allowedGroups}
            onMove={handleMove}
          >
            <TrelloList list={list} />
          </DndContainer>
        )
      })}
    </div>
  );
}

export default App;
