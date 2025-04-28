import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useArticleSearch(initial = "") {
  const [search, setSearch] = useState(initial);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (search.trim()) {
      navigate(`/relevant-articles?query=${encodeURIComponent(search.trim())}`);
    }
  };

  return { search, setSearch, handleSearch };
}
