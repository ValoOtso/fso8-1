import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";

const Authors = ({ authors }) => {
  const [authorName, setAuthorname] = useState("");
  const [birthyear, setBirthyear] = useState("");

  const [EditAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();
    console.log(authorName, birthyear);

    EditAuthor({
      variables: { name: authorName, setBornTo: Number(birthyear) },
    });

    setAuthorname("");
    setBirthyear("");
  };

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          Name
          <select
            value={authorName}
            onChange={(e) => setAuthorname(e.target.value)}
          >
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          Birthyear
          <input
            type="number"
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default Authors;
