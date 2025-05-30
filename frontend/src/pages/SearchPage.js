import React from 'react';
import { SearchComponent } from '../components/SearchComponent.js';

const SearchPage = ({ dsQuan, dsLoaiDaiLy }) => {
    return (
        <div className="container-fluid">
            <SearchComponent
                dsQuan={dsQuan}
                dsLoaiDaiLy={dsLoaiDaiLy}
            />
        </div>
    );
};

export default SearchPage;
