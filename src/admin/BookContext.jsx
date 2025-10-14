import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../admin/AuthContext.jsx";

const BookContext = createContext();

export function BookProvider({ children }) {
  const { accessToken } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ✅ Fetch all user books
  const fetchBooks = async () => {
    if (!accessToken) return;
    try {
      const res = await axios.get("https://cre8tlystudio.com/api/books", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Poll every 5 seconds (same pattern)
  useEffect(() => {
    if (!accessToken) return;

    fetchBooks(); // initial load

    const interval = setInterval(async () => {
      console.log("🔄 [BookContext] Polling for new book updates...");
      try {
        const res = await axios.get("https://cre8tlystudio.com/api/books", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setBooks((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(res.data)) return prev;
          return res.data;
        });
      } catch (err) {
        console.warn("Polling error:", err.message);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <BookContext.Provider value={{ books, setBooks, fetchBooks, loading, error }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}
