import React from 'react';

const Navbar = ({ currentPage, onPageChange }) => {
    const navItems = [
        {
            key: 'management',
            label: 'Quản lý đại lý',
            icon: 'bi-people-fill',
            description: 'Thêm, sửa, xóa đại lý'
        },
        {
            key: 'search',
            label: 'Tra cứu đại lý',
            icon: 'bi-search',
            description: 'Tìm kiếm và tra cứu thông tin đại lý'
        }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">
                    <i className="bi bi-building me-2"></i>
                    Hệ thống quản lý đại lý
                </span>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {navItems.map(item => (
                            <li key={item.key} className="nav-item">
                                <button
                                    className={`nav-link btn btn-link text-white border-0 ${
                                        currentPage === item.key ? 'active' : ''
                                    }`}
                                    onClick={() => onPageChange(item.key)}
                                    title={item.description}
                                >
                                    <i className={`bi ${item.icon} me-2`}></i>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
