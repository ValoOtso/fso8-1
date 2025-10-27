import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from "./queries";
import {
  useApolloClient,
  useQuery,
  useSubscription,
} from "@apollo/client/react";
import Recommend from "./components/Recommend";

const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const authorResult = useQuery(ALL_AUTHORS);
  const bookResult = useQuery(ALL_BOOKS);
  const genreResult = useQuery(ALL_GENRES);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const padding = {
    padding: 5,
  };

  const localToken = localStorage.getItem("book-user-token");

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      console.log(addedBook);
      console.log("moi valo");
      //window.alert(addedBook);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (authorResult.loading) {
    return <div>loading...</div>;
  }
  if (bookResult.loading) {
    return <div>loading...</div>;
  }
  if (genreResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <Router>
      <div>
        <div>
          <Link style={padding} to="/authors">
            Authors
          </Link>
          <Link style={padding} to="/books">
            Books
          </Link>
          {localToken && (
            <Link style={padding} to="/add">
              Add book
            </Link>
          )}
          {localToken && (
            <Link style={padding} to="/recommend">
              Recommend
            </Link>
          )}
          {localToken ? (
            <button onClick={logout}>logout</button>
          ) : (
            <Link to="/login">login</Link>
          )}
        </div>
      </div>
      <Routes>
        <Route
          path="/"
          element={<Authors authors={authorResult.data.allAuthors} />}
        />
        <Route
          path="/authors"
          element={<Authors authors={authorResult.data.allAuthors} />}
        />
        <Route
          path="/books"
          element={<Books genres={genreResult.data.allGenres} />}
        />
        <Route path="/add" element={<NewBook />} />
        <Route path="/login" element={<Login setToken={setToken} />}></Route>
        <Route path="/recommend" element={<Recommend />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
