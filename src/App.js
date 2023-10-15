import { useState } from "react";
import "./style.css";

import { CATEGORIES, INITIALFACTS } from "./const";

// function Counter() {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <span style={{ fontSize: "40px" }}>{count}</span>
//       <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
//         +1
//       </button>
//     </div>
//   );
// }

function App() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? <NewFactForm /> : null}

      <main className="main">
        <CategoryFilter />
        <FactList />
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Today I learned";

  let button_text = showForm ? "Close" : "Share a fact";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I learned Logo" />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        // 3. Update State Variable
        onClick={() => setShowForm((s) => !s)}
      >
        {button_text}
      </button>
    </header>
  );
}

function NewFactForm() {
  const category_list = CATEGORIES;
  const max_text_length = 200;

  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  function handleSubmit(evtObj) {
    evtObj.preventDefault();
    console.log(text, source, category);
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        name="fact_text_field"
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(evtObj) => {
          setText(evtObj.target.value);
        }}
      />
      <span>{200 - textLength}</span>
      <input
        name="fact_source_field"
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(evtObj) => {
          setSource(evtObj.target.value);
        }}
      />
      <select
        name="category_selector"
        value={category}
        onChange={(evtObj) => {
          setCategory(evtObj.target.value);
        }}
      >
        <option value="">Choose Category:</option>
        {category_list.map((cat) => (
          <Option key={cat.name} category={cat} />
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function Option({ category }) {
  return <option value={category.name}>{category.name.toUpperCase()}</option>;
}

function CategoryFilter() {
  const facts = INITIALFACTS;
  const category_list = CATEGORIES;

  return (
    <aside>
      <ul>
        <AllCategory key="0" />

        {category_list
          .filter((category) =>
            facts.find((fact) => {
              return fact.category === category.name;
            })
          )
          .map((category) => (
            <Category key={category.name} category={category} />
          ))}
      </ul>
    </aside>
  );
}

function AllCategory() {
  return (
    <li className="category">
      <button className="btn btn-all-categories">All</button>
    </li>
  );
}

function Category({ category }) {
  return (
    <li className="category">
      <button
        className="btn btn-category"
        style={{
          backgroundColor: category.color,
        }}
      >
        {category.name}
      </button>
    </li>
  );
}

function FactList() {
  const facts = INITIALFACTS;
  const category_list = CATEGORIES;

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} category_list={category_list} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact, category_list }) {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: category_list.find((value) => {
            return value.name === fact.category;
          }).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
