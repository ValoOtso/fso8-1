import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES } from "./queries";
import { useApolloClient, useQuery } from "@apollo/client/react";

const App = () => {
  const authorResult = useQuery(ALL_AUTHORS);
  const bookResult = useQuery(ALL_BOOKS);
  const genreResult = useQuery(ALL_GENRES);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const padding = {
    padding: 5,
  };

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
          {token && (
            <Link style={padding} to="/add">
              Add book
            </Link>
          )}
          {token && (
            <Link style={padding} to="/recommend">
              Recommend
            </Link>
          )}
          {token ? (
            <button onClick={logout}>logout</button>
          ) : (
            <Link to="/login">login</Link>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Authors />} />
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
      </Routes>
    </Router>
  );
};

export default App;
