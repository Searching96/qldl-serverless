import React, { useState } from 'react';
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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

  const formatCurrency = (value) => {
    if (!value || value === '0') return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatResultData = (data) => {
    // Try to identify and format monetary fields
    const monetaryFields = ['congno', 'notoida', 'tonggiatri', 'dongiaxuat', 'thanhtien', 'sotienthu', 'tongdoanhso'];
    
    if (Array.isArray(data)) {
      return data.map(item => {
        const formattedItem = { ...item };
        monetaryFields.forEach(field => {
          if (formattedItem[field] !== undefined && formattedItem[field] !== null) {
            formattedItem[`${field}_formatted`] = formatCurrency(formattedItem[field]);
          }
        });
        return formattedItem;
      });
    }
    return data;
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
          
          // Format monetary values if present
          const finalData = formatResultData(formattedData);
          
          displayContent = JSON.stringify({
            message: parsedResults.message,
            data: finalData,
            count: finalData.length
          }, null, 4);
        } else {
          // Format monetary values and use 4 spaces for better readability
          const finalData = formatResultData(parsedResults);
          displayContent = JSON.stringify(finalData, null, 4);
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
      
      {/* Alert messages */}
      {results && (
        <Alert variant="success" className="mx-3" dismissible onClose={() => setResults(null)}>
          <strong>Thực thi thành công!</strong> Kết quả hiển thị bên dưới.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mx-3" dismissible onClose={() => setError('')}>
          <strong>Lỗi:</strong> 
          <div style={{ whiteSpace: 'pre-line' }}>
            {error}
          </div>
        </Alert>
      )}

      {loading && (
        <Alert variant="info" className="mx-3">
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Đang thực thi...</span>
            </div>
            Đang thực thi lệnh SQL...
          </div>
        </Alert>
      )}

      <div className="px-3">
        <div className="container-fluid">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center py-3">
              <h4 className="mb-0">🛠️ Thao Tác Database</h4>
              <small className="d-block mt-1 opacity-75">Hỗ trợ lệnh SELECT (truy vấn) và INSERT (chèn dữ liệu)</small>
            </Card.Header>
            <Card.Body className="p-4">
              <Form>
                <div className="bg-light rounded p-4 mb-4">
                  <h6 className="text-primary fw-semibold mb-3 border-bottom border-primary pb-2">Cấu hình thao tác</h6>

                  {/* Operation Type Selection */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium mb-2">Loại thao tác:</Form.Label>
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
                    <Form.Label className="fw-medium mb-2">Lệnh SQL:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={sqlCommand}
                      onChange={(e) => setSqlCommand(e.target.value)}
                      placeholder={
                        operationType === 'query' 
                          ? "Nhập lệnh SELECT\nVí dụ: SELECT * FROM daily;"
                          : "Nhập lệnh INSERT\nVí dụ: INSERT INTO daily (tendaily, diachi) VALUES ('Đại lý A', '123 ABC');"
                      }
                    />
                  </Form.Group>
                </div>

                <div className="d-flex flex-wrap gap-2 justify-content-center pt-3 border-top">
                  <Button 
                    variant="primary" 
                    onClick={handleExecuteSQL}
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? 'Đang thực thi...' : `🚀 Thực thi ${operationType === 'query' ? 'Query' : 'Insert'}`}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleClear}
                    disabled={loading}
                    className="px-4"
                  >
                    🗑️ Xóa
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleExitToHome}
                    className="px-4"
                  >
                    ❌ Thoát
                  </Button>
                </div>
              </Form>

              {renderResults()}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};
