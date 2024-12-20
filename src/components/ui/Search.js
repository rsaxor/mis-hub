
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/mis-customer-search/${searchKeyword}`);
        }
    };
    return (
        <div className="input-group mb-3">
            <form onSubmit={handleSearch} className="input-group mb-3">
                <input
                    type="text"
                    className="form-control mr-3 d-inline-block"
                    placeholder="Search keyword"
                    aria-label="Search keyword"
                    aria-describedby="basic-addon2"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <div className="input-group-append mx-3">
                    <button className="btn btn-primary" type="submit">
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Search;