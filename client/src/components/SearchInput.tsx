import React from "react";

interface SearchInputProps {
    setSearchQuery: (arg0: string) => void;
}

const SearchInput = ({setSearchQuery} : SearchInputProps) => {


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSearchQuery(event.currentTarget[0].value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Search..." />
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchInput;
