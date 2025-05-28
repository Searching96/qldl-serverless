import React from 'react';
import { SearchComponent } from '../components/SearchComponent.js';

const SearchPage = ({ dsQuan, dsLoaiDaiLy }) => {
    return (
        <div className="container-fluid">
            <div className="page-header">
                <div className="container">
                    <h2 className="mb-0">
                        <i className="bi bi-search me-2"></i>
                        Tra cứu đại lý
                    </h2>
                    <small className="text-white-50">Tìm kiếm và tra cứu thông tin đại lý</small>
                </div>
            </div>
            
            <div className="container">
                <SearchComponent 
                    dsQuan={dsQuan}
                    dsLoaiDaiLy={dsLoaiDaiLy}
                />
            </div>
        </div>
    );
};

export default SearchPage;
