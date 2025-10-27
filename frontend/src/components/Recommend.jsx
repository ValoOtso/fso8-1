import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ALL_BOOKS, ME } from "../queries";
import { useEffect } from "react";

const Recommend = () => {
  const [genre, setGenre] = useState("");
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(ME);
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  });

  useEffect(() => {
    if (userData?.me?.favoriteGenre) {
      setGenre(userData.me.favoriteGenre);
    }
  }, [userData]);

  if (userLoading || booksLoading) return <p>Loading...</p>;
  if (userError || booksError) return <p>Error loading recommendations.</p>;
  const books = booksData?.allBooks || [];

  return (
    <div>
      <h2>Books</h2>

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

export default Recommend;
