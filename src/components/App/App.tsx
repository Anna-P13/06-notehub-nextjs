import css from './App.module.css'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import NoteList from "../NoteList/NoteList";
import { fetchNotes } from "../../services/noteService";
import { useState } from "react";
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useDebounce } from "use-debounce";


export default function App() {

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [debouncedSearch] = useDebounce(search, 1000); 

  const { data, isError, isSuccess } = useQuery({ 
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: keepPreviousData 
  })

const handleSearchChange = (value: string) => {
  setSearch(value);
  setPage(1);
}
    const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
  <>
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {isSuccess && data?.totalPages > 1 && (
          <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={setPage} />
        )}

        <button className={css.button} onClick={openModal}>Create note +</button>
      </header>

      {isError && <ErrorMessage />}

      {data && data?.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  </>
)

}