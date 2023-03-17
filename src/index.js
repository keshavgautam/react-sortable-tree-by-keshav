import React from "react";
import ReactDOM from "react-dom";
import SortableTree from "../main";

const App = () => {
  return (
    <div>
      <h1>Hello React! wer wer {SortableTree(1, 4)}</h1>
      <h1>Hello React! wer wer{SortableTree(5, 4)} </h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
