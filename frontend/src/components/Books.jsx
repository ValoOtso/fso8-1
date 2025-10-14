import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const Books = ({ genres }) => {
  const [genre, setGenre] = useState("");
  const { data, loading, error } = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  const books = data?.allBooks || [];

  return (
    <div>
      <h2>Books</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <select
          name="genre"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </form>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
