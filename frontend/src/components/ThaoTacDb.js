import React, { useState } from 'react';
import { Card, Form, Button, Alert } from "react-bootstrap";
import { insertData, queryData } from '../services/api';

export const ThaoTacDb = () => {
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

  const renderResults = () => {
    if (!results) return null;

    if (operationType === 'query') {
      // For query operations, display the string result
      return (
        <div className="mt-3">
          <h5>Kết quả truy vấn:</h5>
          <Alert variant="info">
            <pre style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
              {typeof results === 'string' ? results : JSON.stringify(results, null, 2)}
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
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h4>Thao Tác Database</h4>
          <small className="text-muted">Hỗ trợ lệnh SELECT (truy vấn) và INSERT (chèn dữ liệu)</small>
        </Card.Header>
        <Card.Body>
          <Form>
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

            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleExecuteSQL}
                disabled={loading}
              >
                {loading ? 'Đang thực thi...' : `Thực thi ${operationType === 'query' ? 'Query' : 'Insert'}`}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleClear}
                disabled={loading}
              >
                Xóa
              </Button>
            </div>

            {renderResults()}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
