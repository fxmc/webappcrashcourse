"use strict";

import { API_KEY, SUPA_URL } from "./env.js";
import { CATEGORIES } from "./const.js";

// ********************** Filling out the list of facts

// Selecting the fact list and blanking it out
const facts_list = document.querySelector(".facts-list");
facts_list.innerHTML = "";

async function loadFacts(api_key, supa_url) {
  //(facts_list, category_list) {
  const res = await fetch(supa_url, {
    headers: {
      apikey: api_key,
      authorization: "Bearer " + api_key,
    },
  });
  const data = await res.json(); // Note: the act of not including the await here, will print out a pending res!
  return data;
}

function createFactList(dataArray, fl, category_list) {
  const htmlArr = dataArray.map(
    (fact) => `<li class="fact">
        <p>
        ${fact.text}
        <a
          class="source"
          href="${fact.source}"
          target="_blank"
          >(Source)</a
        >
        </p>
        <span class="tag" style="background-color: ${
          category_list.find((value) => {
            // find returns the first, filter returns all and then have to index [0]
            return value.name == fact.category;
          }).color
        }"
        >${fact.category}</span
        >
        <div class="vote-buttons">
          <button>👍 ${fact.votesInteresting}</button>
          <button>🤯 ${fact.votesMindblowing}</button>
          <button>⛔️ ${fact.votesFalse}</button>
        </div>  
    </li>`
  );
  const html = htmlArr.join("");
  fl.insertAdjacentHTML("afterbegin", html);
}

const data = await loadFacts(API_KEY, SUPA_URL);

createFactList(data, facts_list, CATEGORIES);

// *************** Toggle form visibility

// Selecting DOM elements
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");

btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});
