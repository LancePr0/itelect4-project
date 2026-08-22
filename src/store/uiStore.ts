// src/store/uiStore.ts
// Dark mode lived in Layout; the search term lived in ComplaintsPage.
// Neither belonged there -- both are settings ABOUT the whole app.
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isDarkMode: boolean;
  searchTerm: string;
  toggleDarkMode: () => void;
  setSearchTerm: (term: string) => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      searchTerm: "",
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    {
      name: "itelect4-ui",
      // Only the theme is worth remembering -- a search box still full of
      // old text after a reload would only confuse people.
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

export default useUiStore;
