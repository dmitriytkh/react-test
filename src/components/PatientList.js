import React from "react";
import Form from "./Form";
import Todo from "./Todo";
import Pagination from "./Pagination";

export default class PatientList extends React.Component {
  static defaultStorageName = 'patient-items';

  /**
   * Constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      patients: this.load(),
      update: [],
      pageOfItems: [],
      pager: [],
      sortField: '',
      sort: 'asc'
    };
  }

  /**
   * Update items list
   *
   * @param item
   */
  onChangeItem = item => {
    const index = this.state.patients.findIndex((e) => e.id === item.id);
    let patients = this.state.patients;
    if (index === -1) {
      patients.push(item);
    } else {
      patients[index] = item;
    }
    this.setState(state => ({
      patients: patients,
      pageOfItems: patients.slice(state.pager.startIndex, state.pager.endIndex + 1),
      update: []
    }));
  };

  /**
   * Delete item
   *
   * @param id
   */
  handleDeleteTodo = id => {
    this.setState(state => ({
      patients: state.patients.filter(todo => todo.id !== id),
      update: []
    }));
  };

  /**
   * Handle update item
   *
   * @param todo
   */
  handleUpdateTodo = todo => {
    this.setState({
      update: todo
    });
  };

  /**
   * Save items to local storage
   */
  save = () => {
    const plainItems = this.state.patients;
    global.localStorage.setItem(PatientList.defaultStorageName, JSON.stringify(plainItems));
  };

  /**
   * Get items from local storage
   *
   * @returns {any | Array}
   */
  load = () => {
    let loadedItems;
    try {
      loadedItems = JSON.parse(global.localStorage.getItem(PatientList.defaultStorageName)) || [];
    } catch (ex) {
      loadedItems = [];
    }
    return loadedItems;
  };

  /**
   * Sort items by asc
   *
   * @param key
   * @returns {function(*, *): number}
   */
  sortAsc(key) {
    return function (a, b) {
      return a[key].localeCompare(b[key]);
    };
  }

  /**
   * Sort items by desc
   *
   * @param key
   * @returns {function(*, *): number}
   */
  sortDesc(key) {
    return function (a, b) {
      return -a[key].localeCompare(b[key]);
    };
  }

  /**
   * Sorting items
   *
   * @param key
   */
  sortBy(key) {
    let arrayCopy = [...this.state.patients];
    let sort = this.state.sort;
    if(this.state.sort === 'asc') {
      arrayCopy.sort(this.sortAsc(key));
      sort = 'desc';
    } else {
      arrayCopy.sort(this.sortDesc(key));
      sort = 'asc';
    }

    this.setState({
      patients: arrayCopy,
      sort: sort
    });
  }

  /**
   * Handle change page
   *
   * @param pageOfItems
   * @param pager
   */
  onChangePage = (pageOfItems, pager) => {
    this.setState({
      pageOfItems: pageOfItems,
      pager: pager
    });
  };

  /**
   * Render items list
   *
   * @returns {*}
   */
  render() {
    const { update, pageOfItems, patients } = this.state;
    this.save();
    return (
      <React.Fragment>
        <Form
          onSubmit={this.onChangeItem}
          update={update}
        />
        <div className='container'>
          <div className="table-responsive">
            <table className="table">
              <thead>
              <tr>
                <th className='sorting' scope="col" onClick={() => this.sortBy('name')}>Name</th>
                <th className='sorting' scope="col" onClick={() => this.sortBy('height')}>Height</th>
                <th className='sorting' scope="col" onClick={() => this.sortBy('weight')}>Weight</th>
                <th scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
                {pageOfItems.map(patient => (
                  <Todo
                    key={patient.id}
                    onDelete={() => this.handleDeleteTodo(patient.id)}
                    onUpdate={() => this.handleUpdateTodo(patient)}
                    todo={patient}
                  />
                ))}
              </tbody>
            </table>
            <nav aria-label="pagination">
              <Pagination items={patients} onChangePage={this.onChangePage} />
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
