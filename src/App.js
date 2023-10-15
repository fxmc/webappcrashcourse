import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./style.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [factList, setFactList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isLoadingFacts, setIsLoadingFacts] = useState(false);
  const [isLoadingCat, setIsLoadingCat] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  // Gets called upon the first rendering and only then
  useEffect(() => {
    async function getFacts() {
      setIsLoadingFacts(true);

      let query = supabase.from("facts").select("*");

      if (currentCategory !== "all") {
        query = query.eq("category", currentCategory);
      }

      let { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(100);

      if (!error) setFactList(facts);
      else alert("There was a problem getting data!");
      setIsLoadingFacts(false);
    }
    getFacts();
  }, [currentCategory]);

  useEffect(() => {
    async function getCategories() {
      setIsLoadingCat(true);
      let { data: categories, error } = await supabase
        .from("categories")
        .select("name, color");

      if (!error) setCategoryList(categories);
      else alert("There was a problem getting categories!");
      setIsLoadingCat(false);
    }
    getCategories();
  }, []);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? (
        <NewFactForm
          factList={factList}
          setFactList={setFactList}
          categoryList={categoryList}
          setShowForm={setShowForm}
        />
      ) : null}

      <main className="main">
        {isLoadingCat ? (
          <Loader />
        ) : (
          <CategoryFilter
            facts={factList}
            categoryList={categoryList}
            setCurrentCategory={setCurrentCategory}
          />
        )}
        {isLoadingFacts || isLoadingCat ? (
          <Loader />
        ) : (
          <FactList facts={factList} categoryList={categoryList} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
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

function NewFactForm({ factList, setFactList, categoryList, setShowForm }) {
  const category_list = categoryList;
  const initial_facts = factList;
  const max_text_length = 200;

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

function CategoryFilter({ facts, categoryList, setCurrentCategory }) {
  const category_list = categoryList;

  return (
    <aside>
      <ul>
        <AllCategory key="0" setCurrentCategory={setCurrentCategory} />

        {category_list
          // .filter((category) =>
          //   facts.find((fact) => {
          //     return fact.category === category.name;
          //   })
          // )
          .map((category) => (
            <Category
              key={category.name}
              category={category}
              setCurrentCategory={setCurrentCategory}
            />
          ))}
      </ul>
    </aside>
  );
}

function AllCategory({ setCurrentCategory }) {
  return (
    <li className="category">
      <button
        className="btn btn-all-categories"
        onClick={() => setCurrentCategory("all")}
      >
        All
      </button>
    </li>
  );
}

function Category({ category, setCurrentCategory }) {
  return (
    <li className="category">
      <button
        className="btn btn-category"
        style={{
          backgroundColor: category.color,
        }}
        onClick={() => setCurrentCategory(category.name)}
      >
        {category.name}
      </button>
    </li>
  );
}

function FactList({ facts, categoryList }) {
  const category_list = categoryList;

  if (facts.length === 0) {
    return (
      <p className="message">
        No facts for this category yet! Create the first one! ✌️
      </p>
    );
  }

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
