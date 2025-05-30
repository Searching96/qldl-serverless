import React, { useState } from 'react';
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/FormComponent.css";
import { insertData, queryData } from '../services/api';

export const ThaoTacDb = () => {
  const navigate = useNavigate();
  const [sqlCommand, setSqlCommand] = useState('');
  const [operationType, setOperationType] = useState('query'); // 'query' or 'insert'
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecuteSQL = async () => {
    if (!sqlCommand.trim()) {
      setError('Vui lòng nhập lệnh SQL');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      let data;
      if (operationType === 'query') {
        data = await queryData(sqlCommand);
      } else {
        data = await insertData(sqlCommand);
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSqlCommand('');
    setResults(null);
    setError('');
  };

  const handleExitToHome = () => {
    navigate("/");
  };

  const renderResults = () => {
    if (!results) return null;

    if (operationType === 'query') {
      let displayContent;
      try {
        // First, try to parse the results as JSON if it's a string
        const parsedResults = typeof results === 'string' ? JSON.parse(results) : results;
        
        // Check if the result has a nested "result" field that contains the actual data
        if (parsedResults.result && typeof parsedResults.result === 'string') {
          // Parse the nested result string and format it
          const resultData = parsedResults.result;
          
          // Split by newlines and parse each row
          const rows = resultData.split('\n').filter(row => row.trim());
          const formattedData = rows.map(row => {
            const fields = {};
            const pairs = row.split(', ');
            pairs.forEach(pair => {
              const [key, value] = pair.split(': ');
              fields[key] = value === 'NULL' ? null : value;
            });
            return fields;
          });
          
          displayContent = JSON.stringify({
            message: parsedResults.message,
            data: formattedData,
            count: formattedData.length
          }, null, 4);
        } else {
          // Use 4 spaces for better readability
          displayContent = JSON.stringify(parsedResults, null, 4);
        }
      } catch (parseError) {
        // If parsing fails, display as is
        displayContent = typeof results === 'string' ? results : JSON.stringify(results, null, 4);
      }

      return (
        <div className="mt-3">
          <h5>Kết quả truy vấn:</h5>
          <Alert variant="info">
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              marginBottom: 0,
              fontSize: '13px',
              lineHeight: '1.5',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '12px',
              overflow: 'auto',
              maxHeight: '500px'
            }}>
              {displayContent}
            </pre>
          </Alert>
        </div>
      );
    } else {
      // For insert operations
      return (
        <Alert variant="success" className="mt-3">
          Thực thi thành công! {results.affectedRows ? `Số dòng bị ảnh hưởng: ${results.affectedRows}` : ''}
        </Alert>
      );
    }
  };

  return (
    <div className="container-fluid px-0 mt-4">
      <h1 className="ms-3">Thao tác Database</h1>
      
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mx-3" role="alert">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button
              className="btn btn-outline-primary btn-sm ms-2"
              onClick={() => setError('')}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}

      <div className="px-3">
        <div className="form-component">
          <Card>
            <Card.Header>
              <h4>🛠️ Thao Tác Database</h4>
              <small className="text-muted">Hỗ trợ lệnh SELECT (truy vấn) và INSERT (chèn dữ liệu)</small>
            </Card.Header>
            <Card.Body>
              <Form>
                <div className="form-layout">
                  <div className="form-section">
                    <h6>Cấu hình thao tác</h6>

                    {/* Operation Type Selection */}
                    <Form.Group className="mb-3">
                      <Form.Label>Loại thao tác:</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="radio"
                          id="query-radio"
                          name="operationType"
                          label="Query (Truy vấn)"
                          checked={operationType === 'query'}
                          onChange={() => setOperationType('query')}
                        />
                        <Form.Check
                          type="radio"
                          id="insert-radio"
                          name="operationType"
                          label="Insert (Chèn dữ liệu)"
                          checked={operationType === 'insert'}
                          onChange={() => setOperationType('insert')}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Lệnh SQL:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={sqlCommand}
                        onChange={(e) => setSqlCommand(e.target.value)}
                        placeholder={
                          operationType === 'query' 
                            ? "Nhập lệnh SELECT&#10;Ví dụ: SELECT * FROM daily;"
                            : "Nhập lệnh INSERT&#10;Ví dụ: INSERT INTO daily (tendaily, diachi) VALUES ('Đại lý A', '123 ABC');"
                        }
                      />
                    </Form.Group>
                  </div>

                  <div className="form-buttons">
                    <Button 
                      variant="primary" 
                      onClick={handleExecuteSQL}
                      disabled={loading}
                    >
                      {loading ? 'Đang thực thi...' : `🚀 Thực thi ${operationType === 'query' ? 'Query' : 'Insert'}`}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleClear}
                      disabled={loading}
                    >
                      🗑️ Xóa
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleExitToHome}
                    >
                      ❌ Thoát
                    </Button>
                  </div>
                </div>

                {renderResults()}
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};
