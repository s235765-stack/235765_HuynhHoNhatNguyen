import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({ name: '', type: '', status: 'Active' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const API_URL = 'https://petrifying-phantasm-gxpqjgxpgg7xhp75g-5000.app.github.dev/api/devices';

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(API_URL);
      setDevices(res.data);
    } catch (err) {
      console.error('Lỗi tải danh sách thiết bị:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', type: '', status: 'Active' });
      fetchDevices();
    } catch (err) {
      console.error('Lỗi lưu dữ liệu:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thiết bị này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDevices();
      } catch (err) {
        console.error('Lỗi xóa thiết bị:', err);
      }
    }
  };

  const handleEdit = (device) => {
    setEditingId(device._id);
    setFormData({ name: device.name, type: device.type, status: device.status });
  };

  // Lọc danh sách theo tên và trạng thái
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || device.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold">HỆ THỐNG QUẢN LÝ THIẾT BỊ</h2>

      {/* Form Thêm / Sửa */}
      <div className="card mb-4 p-3 shadow-sm border-0 bg-light">
        <h5 className="card-title text-secondary">{editingId ? 'Cập Nhật Thiết Bị' : 'Thêm Thiết Bị Mới'}</h5>
        <form onSubmit={handleSubmit} className="row g-3 mt-1">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Tên thiết bị"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Loại thiết bị"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Hoạt động (Active)</option>
              <option value="Inactive">Ngừng hoạt động (Inactive)</option>
              <option value="Maintenance">Bảo trì (Maintenance)</option>
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className={`btn w-100 ${editingId ? 'btn-warning' : 'btn-success'}`}>
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>

      {/* Thanh Tìm Kiếm & Bộ Lọc */}
      <div className="row mb-3 g-2">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm kiếm theo tên hoặc loại thiết bị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Active">Hoạt động (Active)</option>
            <option value="Inactive">Ngừng hoạt động (Inactive)</option>
            <option value="Maintenance">Bảo trì (Maintenance)</option>
          </select>
        </div>
      </div>

      {/* Bảng Danh Sách */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Tên thiết bị</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3 text-muted">Không tìm thấy thiết bị nào</td>
              </tr>
            ) : (
              filteredDevices.map((device, index) => (
                <tr key={device._id}>
                  <td>{index + 1}</td>
                  <td className="fw-bold">{device.name}</td>
                  <td>{device.type}</td>
                  <td>
                    <span className={`badge ${device.status === 'Active' ? 'bg-success' : device.status === 'Maintenance' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(device)}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(device._id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;