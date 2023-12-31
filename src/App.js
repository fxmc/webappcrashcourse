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
            categoryList={categoryList}
            setCurrentCategory={setCurrentCategory}
          />
        )}
        {isLoadingFacts || isLoadingCat ? (
          <Loader />
        ) : (
          <FactList
            facts={factList}
            categoryList={categoryList}
            setFacts={setFactList}
          />
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

function NewFactForm({ setFactList, categoryList, setShowForm }) {
  const category_list = categoryList;
  const max_text_length = 200;

  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const textLength = text.length;

  async function handleSubmit(evtObj) {
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
      // 3. Upload fact to Supabase and receive the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      // 4. Add the new fact to the UI: add the fact o state
      //setFactList(initial_facts.concat([newFact]));
      // setFactList((facts) => [newFact].concat(facts));
      if (!error) setFactList((facts) => [newFact[0], ...facts]);

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
        disabled={isUploading}
      />
      <span>Characters remaining: {max_text_length - textLength}</span>
      <input
        name="fact_source_field"
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(evtObj) => {
          setSource(evtObj.target.value);
        }}
        disabled={isUploading}
      />
      <select
        name="category_selector"
        value={category}
        onChange={(evtObj) => {
          setCategory(evtObj.target.value);
        }}
        disabled={isUploading}
      >
        <option value="">Choose Category:</option>
        {category_list.map((cat) => (
          <Option key={cat.name} category={cat} />
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function Option({ category }) {
  return <option value={category.name}>{category.name.toUpperCase()}</option>;
}

function CategoryFilter({ categoryList, setCurrentCategory }) {
  const category_list = categoryList;

  return (
    <aside>
      <ul>
        <AllCategory key="0" setCurrentCategory={setCurrentCategory} />

        {category_list.map((category) => (
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

function FactList({ facts, categoryList, setFacts }) {
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
          <Fact
            key={fact.id}
            fact={fact}
            category_list={category_list}
            setFacts={setFacts}
          />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact, category_list, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(buttonType) {
    setIsUpdating(true);

    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [buttonType]: fact[buttonType] + 1 })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    console.log(updatedFact);
    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔️ DISPUTED]</span> : null}
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
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
