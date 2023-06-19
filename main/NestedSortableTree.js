import React from "react";
import "./tree.css";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
// Recursive function to render the tree
const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};
const removeTemp = (tree) => {
  let hoverId = "temp";
  for (
    let parentNodeIndex = 0;
    parentNodeIndex < tree.length;
    parentNodeIndex++
  ) {
    const node = tree[parentNodeIndex];
    if (node.id === hoverId) {
      tree.splice(parentNodeIndex, 1);
    } else if (node.children) {
      tree[parentNodeIndex].children = removeTemp(node.children);
    }
  }
  return tree;
};
const whereToput = (drag, hover, wrap, mouse, mouse1, mouse2) => {
  let result = "";
  let range = 10;
  let hoverXMax = hover.x + range;
  let hoverXMin = hover.x - range;
  let xIsInRange = hoverXMax > mouse2.x && hoverXMin < mouse2.x;
  let xIsInRangeasChild = mouse2.x > hover.x && mouse2.x - hover.x < 50;
  let up = hover.y > mouse2.y;
  let down = hover.y < mouse2.y;
  // if (dragX === hoverX) {
  //   if (hover.y >= mouse.y) {
  //     result = "upward";
  //   } else {
  //     result = "downward";
  //   }
  // } else if (dragX > hoverX) {
  //   result = "aschild";
  // } else {
  //   result = "aschild ---";
  // }
  // console.log("xIsInRange =>", xIsInRange);
  // console.log("xIsInRangeasChild =>", xIsInRangeasChild);
  // console.log("up =>", up);
  // console.log("down =>", down);
  if (xIsInRange) {
    if (up) {
      result = "upward";
    }
    if (down) {
      result = "downward";
    }
  }
  if (xIsInRangeasChild) {
    result = "aschild";
  }

  return result;
};
const addasChild = (tree, hoverId, targetNode) => {
  console.log("addasChild", tree, hoverId);

  for (
    let parentNodeIndex = 0;
    parentNodeIndex < tree.length;
    parentNodeIndex++
  ) {
    const node = tree[parentNodeIndex];
    if (node.id === hoverId) {
      tree = removeTemp(tree);
      if (tree[parentNodeIndex]) {
        tree[parentNodeIndex].children.unshift(targetNode);
      } else {
        console.log("-------");
      }
      break;
      console.log(tree);
    } else if (node.children) {
      tree[parentNodeIndex].children = addasChild(
        node.children,
        hoverId,
        targetNode
      );
    }
  }
  return tree;
};
const addDownward = (tree, hoverId, targetNode) => {
  for (
    let parentNodeIndex = 0;
    parentNodeIndex < tree.length;
    parentNodeIndex++
  ) {
    const node = tree[parentNodeIndex];
    if (node.id === hoverId) {
      tree = removeTemp(tree);
      tree.splice(parentNodeIndex + 1, 0, targetNode);

      console.log(tree);
    } else if (node.children) {
      tree[parentNodeIndex].children = addDownward(
        node.children,
        hoverId,
        targetNode
      );
    }
  }
  return tree;
};

const addUpward = (tree, hoverId, targetNode) => {
  for (
    let parentNodeIndex = 0;
    parentNodeIndex < tree.length;
    parentNodeIndex++
  ) {
    const node = tree[parentNodeIndex];
    if (node.id === hoverId) {
      tree = removeTemp(tree);
      tree.splice(parentNodeIndex, 0, targetNode);

      console.log(tree);
      break;
      console.log(tree);
    } else if (node.children) {
      tree[parentNodeIndex].children = addUpward(
        node.children,
        hoverId,
        targetNode
      );
    }
  }
  return tree;
};

const tempNode = { id: "temp", label: "temp", children: [] };
// Get the node with the given ID from the tree
const getNodeById = (nodes, id, parent = null) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      return { node, parent: parent, index: i };
    } else if (node.children) {
      const result = getNodeById(node.children, id, node);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
const TreeNode = (props) => {
  const { node, children, id, index, setTree, tree } = props;
  const ref = React.useRef(null);
  const [collectedProps, drop] = useDrop({
    accept: "treeNode",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        dropResult: monitor.getDropResult(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // console.log("dragIndex=>", dragIndex, "hoverIndex=>", hoverIndex);
      const dragId = item.id;
      const hoverId = id;

      // const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Don't replace items with themselves
      if (dragId === hoverId) {
        return;
      }
      const wrapNode = document.getElementById(`wrap`);
      const dragnode = document.getElementById(`node-${dragId}`);
      const hovernode = document.getElementById(`node-${hoverId}`);
      const dragBoundingRect = dragnode?.getBoundingClientRect();
      const hoverBoundingRect = hovernode?.getBoundingClientRect();
      const wrapBoundingRect = wrapNode?.getBoundingClientRect();
      const mouseOffset = monitor.getClientOffset();
      const mouseOffset1 = monitor.getDifferenceFromInitialOffset();
      const mouseOffset2 = monitor.getSourceClientOffset();
      // console.log("collectedProps", collectedProps);
      console.log("dragId=>", dragId, "hoverId=>", hoverId);
      // console.log("dragBoundingRect=>", dragBoundingRect);
      // console.log("hoverBoundingRect=>", hoverBoundingRect);
      // console.log("wrapBoundingRect=>", wrapBoundingRect);
      // console.log("mouseOffset=>", mouseOffset);
      // console.log("mouseOffset1=>", mouseOffset1);
      // console.log("mouseOffset2=>", mouseOffset2);
      // console.log("item=>", item);

      const whereToPutref = whereToput(
        dragBoundingRect,
        hoverBoundingRect,
        wrapBoundingRect,
        mouseOffset,
        mouseOffset1,
        mouseOffset2
      );
      console.log("whereToPutref=>", whereToPutref);

      //   moveCard("temp", hoverId, whereToPutref);
    },
    drop: (item, monitor) => {
      let isOver = monitor.isOver();
      const dragId = item.id;
      const hoverId = id;
      console.log("drop ===>", "dragId=>", dragId, "hoverId=>", hoverId);
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "treeNode",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const moveCard = React.useCallback((dragId, hoverId, command) => {
    const dragNode = dragId === "temp" ? tempNode : getNodeById(tree, dragId);
    let newtree;
    switch (command) {
      case "upward":
        newtree = addUpward(tree, hoverId, dragNode);
        setTree(newtree);
        break;
      case "downward":
        newtree = addDownward(tree, hoverId, dragNode);
        setTree(newtree);
        break;
      case "aschild":
        newtree = addasChild(tree, hoverId, dragNode);
        setTree(newtree);
        break;
    }
  }, []);

  return (
    <div ref={ref} id={`node-${node.id}`} className="node">
      <div style={{ ...style }}>{node.label}</div>

      {children}
    </div>
  );
};

export const NestedSortableTree = (props) => {
  const [tree, setTree] = React.useState([]);
  React.useEffect(() => {
    setTree(props.tree);
  }, [props.tree]);

  React.useEffect(() => {
    // props.setTree(tree);
  }, [tree]);

  // Recursive function to render the tree
  const renderTree = (nodes) => {
    return nodes.map((node, index) => (
      <TreeNode
        key={node.id}
        id={node.id}
        index={index}
        node={node}
        tree={nodes}
        setTree={setTree}
      >
        {node.children && renderTree(node.children)}
      </TreeNode>
    ));
  };

  return <div id="wrap">{renderTree(tree)}</div>;
};
