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
  const [factList, setFactList] = useState(INITIALFACTS);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? (
        <NewFactForm
          factList={factList}
          setFactList={setFactList}
          setShowForm={setShowForm}
        />
      ) : null}

      <main className="main">
        <CategoryFilter />
        <FactList facts={factList} />
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

function isValidHttpUrl(string) {
  // Solution from StackOverflow
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ factList, setFactList, setShowForm }) {
  const category_list = CATEGORIES;
  const initial_facts = factList;
  const max_text_length = 20;

  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  function handleSubmit(evtObj) {
    // 1. Prevent the browser to reload
    evtObj.preventDefault();
    console.log(text, source, category);

    // 2. Check if valid is valid.  If so, create a new fact
    if (
      text &&
      isValidHttpUrl(source) &&
      category &&
      textLength <= max_text_length
    ) {
      // 3. Create a new fact object
      const newFact = {
        id: initial_facts.length + 1,
        text,
        source,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };

      // 4. Add the new fact to the UI: add the fact o state
      //setFactList(initial_facts.concat([newFact]));
      // setFactList((facts) => [newFact].concat(facts));
      setFactList((facts) => [newFact, ...facts]);

      // 5. Reset input fields to be empty
      setText("");
      setSource("");
      setCategory("");

      // 6. Close the form
      setShowForm(false);
    }
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
      <span>{max_text_length - textLength}</span>
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

function FactList({ facts }) {
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
