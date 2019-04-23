import React from "react";

export default props => (
  <tr>
    <td>{props.todo.name}</td>
    <td>{props.todo.height}</td>
    <td>{props.todo.weight}</td>
    <td>
      <button className='btn btn-primary btn-sm edit-btn' onClick={props.onUpdate}>Edit</button>
      <button className='btn btn-danger btn-sm delete-btn' onClick={props.onDelete}>Delete</button>
    </td>
  </tr>
);
