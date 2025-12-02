"use client";
import React, { createContext, useState, useContext, ReactNode, FC, useEffect } from "react";

type FilterType = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FilterContext = createContext<FilterType>({
  selectedTags: [],
  setSelectedTags: () => {},
});

export const FilterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem("selected_tags");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as string[];
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("selected_tags", JSON.stringify(selectedTags));
    } catch (e) {
      // ignore
    }
  }, [selectedTags]);

  return (
    <FilterContext.Provider value={{ selectedTags, setSelectedTags }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
