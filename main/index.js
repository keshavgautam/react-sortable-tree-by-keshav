import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NestedSortableTree } from "./NestedSortableTree";

const SortableTree = (props) => (
  <DndProvider backend={HTML5Backend}>
    <NestedSortableTree {...props} />
  </DndProvider>
);

export default SortableTree;
