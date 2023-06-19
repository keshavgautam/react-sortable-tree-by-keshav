import React from "react";
import ReactDOM from "react-dom";
import SortableTree from "../main";
import "./style.css";

const App = () => {
  const Tree = [
    {
      id: 1,
      label: "1",
      children: [
        { id: 2, label: "2", children: [] },
        { id: 3, label: "3", children: [] },
      ],
    },
    {
      id: 4,
      label: "4",
      children: [
        { id: 5, label: "5", children: [] },
        { id: 6, label: "6", children: [] },
      ],
    },
    {
      id: 7,
      label: "7",
      children: [
        { id: 8, label: "8", children: [] },
        {
          id: 9,
          label: "9",
          children: [
            { id: 10, label: "10", children: [] },
            { id: 11, label: "11", children: [] },
          ],
        },
      ],
    },
    { id: 12, label: "12", children: [] },
    { id: 13, label: "13", children: [] },
    { id: 14, label: "14", children: [] },
    { id: 15, label: "15", children: [] },
    { id: 16, label: "16", children: [] },
    { id: 17, label: "17", children: [] },
    { id: 18, label: "18", children: [] },
    { id: 19, label: "19", children: [] },
    { id: 20, label: "20", children: [] },
    { id: 22, label: "22", children: [] },
  ];

  const [tree, setTree] = React.useState([]);

  const [id, setId] = React.useState("");
  const [title, setTitle] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the captured values (e.g., send them to an API)
    console.log("ID:", id);
    console.log("Title:", title);
    let a = tree;
    a.push({ id: id, label: title, children: [] });
    setTree(a);
    // Reset the input fields
    setId("");
    setTitle("");
  };

  React.useEffect(() => {
    setTree(Tree);
  }, []);
  React.useEffect(() => {
    console.log("tree in parent=>", tree);
  }, [tree]);
  console.log("tree in parent outside=>", tree);
  return (
    <div>
      <div className="wrap">
        <SortableTree
          tree={tree}
          setTree={(a) => {
            console.log("updated===>");
            setTree(a);
          }}
        />
      </div>

      <div className="form-wrap">
        <h1>Enter ID and Title</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <br />
          <br />
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
