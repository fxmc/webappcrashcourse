import './style.css'

import { CATEGORIES, INITIALFACTS } from './const';

function App() {
  const appTitle = "Today I learned";

  return (
    <>   {/* This helps create a fragment, i.e. surrounding various Components */}
    {/* Note that we now have the same structure as in the original index.html file */}
    {/* HEADER */}
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I learned Logo" />
        <h1>{appTitle}</h1>
      </div>
      <button className="btn btn-large btn-open">Share a fact</button>
    </header>

    <NewFactForm />

    <main className="main">
      <CategoryFilter />
      <FactList />
    </main>
    </>
  );
}

function NewFactForm() {
  return (
    <form className="fact-form">Fact form</form>
  )
}

function CategoryFilter() {
  // TEMPORARY
  const facts = INITIALFACTS;
  const category_list = CATEGORIES;
  
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories">All</button>
        </li>
        {
          category_list
          .filter(
            (category) => facts.find( 
              (fact) => {
                console.log(fact.category, category.name);
                return fact.category === category.name;
              }
            )
          )
          .map(
            (category) => {
              return (
                <li className="category">
                  <button 
                    className="btn btn-category"
                    style={{
                      backgroundColor: category.color
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              )
            }
          )
        }
      </ul>
    </aside>
  )
}

function FactList() {
  // TEMPORARY
  const facts = INITIALFACTS;
  const category_list = CATEGORIES;

  return (
      <section>
        <ul className="facts-list">
          {
            facts.map(
              (fact) => (
                  <li className="fact">
                    <p>
                      {fact.text}
                      <a
                        className="source"
                        href={fact.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        >(Source)</a>
                    </p>
                    <span 
                      className="tag"
                      style={{
                        backgroundColor:
                        category_list.find((value) => {return value.name === fact.category}).color 
                      }}
                    >{fact.category}</span>
                    <div className="vote-buttons">
                      <button>👍 {fact.votesInteresting}</button>
                      <button>🤯 {fact.votesMindblowing}</button>
                      <button>⛔️ {fact.votesFalse}</button>
                    </div>                      
                  </li>
                )
            )
          }
        </ul>
      </section>
  );
}

export default App;
 