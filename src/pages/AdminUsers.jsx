import React, { useEffect, useState } from 'react';
import { users } from '../services/api';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const AdminUsers = () => {
  const [userList, setUserList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const res = await users.list();
      setUserList(res.data);
    } catch {
      setError('Error al cargar usuarios');
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openModal = (user) => {
    setSelected(user);
    setNewRole(user.role);
    setShow(true);
  };

  const handleSave = async () => {
    await users.update(selected._id, { role: newRole });
    setShow(false);
    loadUsers();
  };

  const handleDelete = async id => {
    if (window.confirm('¿Eliminar usuario?')) {
      await users.remove(id);
      loadUsers();
    }
  };

  return (
    <div>
      <h2>Administrar Usuarios</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped>
        <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr></thead>
        <tbody>
          {userList.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Button size="sm" onClick={() => openModal(u)}>Cambiar rol</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(u._id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Modificar Rol</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Select value={newRole} onChange={e => setNewRole(e.target.value)}>
            <option value="client">Cliente</option>
            <option value="vendor">Vendedor</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;
