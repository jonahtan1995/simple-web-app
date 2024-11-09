import React from "react";
import './SearchInput.css';

interface SearchInputProps {
    setSearchQuery: (arg0: string) => void;
}

const SearchInput = ({ setSearchQuery }: SearchInputProps) => {

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSearchQuery(event.currentTarget[0].value);
    }

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input 
                type="text" 
                placeholder="Search GitHub users..." 
                className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
}

export default SearchInput;
