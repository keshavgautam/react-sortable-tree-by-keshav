import React from "react";
import "./tree.css";
import { useDrag, useDrop } from "react-dnd";

// Recursive function to render the tree
const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};
function dropFn() {
  //console.log(this);
  const { treeData, node, moveCard } = this;

  return {
    accept: "treeNode",
    hover({ id: draggedId }, monitor) {
      if (draggedId !== node.id) {
        //console.log("draggedId=>", draggedId);
        //console.log("dropId=>", node.id);
        const didDrop = monitor.didDrop();
        //console.log(didDrop);
        moveCard(draggedId, node.id, "hover");
      }
    },
    drop: (item, monitor) => {
      //   const dragNode = getNodeById(treeData, item.id);
      //   const dropNode = getNodeById(treeData, node.id);
      //   if (dragNode && dropNode) {
      //     // Move node to new position in tree
      //     // const temp = nodes[dragIndex];
      //     // treeData.splice(dragIndex, 1);
      //     // treeData.splice(dropIndex, 0, temp);
      //     // setTree([...treeData]);
      //     // setTree([...treeData]);
      //     moveCard(item.id, node.id);
      //   }

      if (item.id !== node.id) {
        moveCard(item.id, node.id, "drop");
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  };
}
// Tree node component
const TreeNode = (props) => {
  const { node, children, treeData, setTree, moveCard } = props;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "treeNode",
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ canDrop, isOver }, drop] = useDrop(
    dropFn.bind({
      treeData: treeData,
      node: node,
      moveCard: moveCard,
    })
  );

  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={(node) => drag(drop(node))} className="node">
      <div style={{ ...style, opacity }}>{node.label}</div>

      {children}
    </div>
  );
};

export const NestedSortableTree = (props) => {
  const [tree, setTree] = React.useState([]);

  React.useEffect(() => {
    console.log("updated from props");
    setTree(props.tree);
  }, [props.tree]);
  React.useEffect(() => {
    if (tree.length > 0) {
      let check = JSON.stringify(tree) !== JSON.stringify(props.tree);
      if (check) {
        props.setTree(tree);
      }
    }
  }, [tree, props.tree]);
  console.log("tree in NestedSortableTree outside props=>", props.tree);
  console.log("tree in NestedSortableTree outside=>", tree);

  const moveCard = React.useCallback(
    (id, atId, source) => {
      const dragNode = getNodeById(tree, id);
      const dropNode = getNodeById(tree, atId);
      if (dragNode && dropNode) {
        console.log("         ----||||||-----       ");
        let a = [...tree];
        console.log("tree before =>", tree);
        a = removeNode(a, id);
        a = replaceNode(a, atId, dropNode.parent, dragNode.node);
        console.log("tree after =>", a);
        setTree(a);
      }
    },
    [tree]
  );
  // const moveCard = (id, atId, source) => {
  //   // const dragNode = getNodeById(tree, id);
  //   // const dropNode = getNodeById(tree, atId);
  //   // //console.log("dragNode=>", dragNode);
  //   // //console.log("dropNode=>", dropNode);
  //   // //console.log("source=>", source);
  //   // let a = [...tree];
  //   // a.splice(dragNode.index, 1);
  //   // a.splice(dropNode.index, 0, dragNode.node);
  //   // if (dragNode && dropNode) {
  //   //   a = updateNode(a, dragNode.node, dragNode.parent, "remove");
  //   //   a = updateNode(a, dropNode.node, dropNode.parent, "update");
  //   //     setTree(a);
  //   // }
  // };
  const [{ canDrop, isOver }, drop] = useDrop(
    dropFn.bind({
      treeData: tree,
      node: tree[0],
      moveCard: moveCard,
    })
  );
  // Recursive function to render the tree
  const renderTree = (nodes, setTree, moveCard) => {
    return nodes.map((node) => (
      <TreeNode
        key={node.id}
        node={node}
        treeData={nodes}
        setTree={setTree}
        moveCard={moveCard}
      >
        {node.children && renderTree(node.children, setTree, moveCard)}
      </TreeNode>
    ));
  };

  return <div>{renderTree(tree, setTree, moveCard)}</div>;
};

const removeNode = (nodes, id) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      nodes.splice(i, 1);
    } else if (node.children) {
      node.children = removeNode(node.children, id);
    }
  }
  return nodes;
};

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

const replaceNode = (tree, id, parent, card) => {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (parent === null) {
      if (node.id === id) {
        tree.splice(i, 0, card);
        break;
      } else if (node.children) {
        tree[i].children = replaceNode(node.children, id, parent, card);
      }
    } else {
      if (node.id === parent.id) {
        tree[i].children = replaceNode(node.children, id, null, card);
      } else if (node.children) {
        tree[i].children = replaceNode(node.children, id, parent, card);
      }
    }
  }
  return tree;
};
