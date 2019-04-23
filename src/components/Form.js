import React from "react";
import shortid from "shortid";

export default class Form extends React.Component {
  /**
   * Constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      height: '',
      weight: '',
      formErrors: {
        name: false,
        height: false,
        weight: false,
      },
      formEdit: false,
      formValid: false
    }
  }

  /**
   * Set change input
   *
   * @param event
   */
  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    const type = event.target.type;
    this.setState({[name]: value}, () => { this.validateField(name, value, type) });
  };

  /**
   * Validate form fields
   *
   * @param fieldName
   * @param value
   * @param type
   */
  validateField(fieldName, value, type) {
    let fieldValidationErrors = this.state.formErrors;
    let textValid = false;
    let numberValid = false;
    switch (type) {
      case 'text':
        textValid = value.length > 0;
        fieldValidationErrors[fieldName] = textValid ? true : false;
        break;
      case 'number':
        numberValid = value.length > 0 && !isNaN(parseFloat(value)) && isFinite(value);
        fieldValidationErrors[fieldName] = numberValid ? true : false;
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
    }, this.validateForm);
  }

  /**
   * Set form validate
   */
  validateForm() {
    let formValid = true;
    for (var i in this.state.formErrors) {
      if (this.state.formErrors.hasOwnProperty(i) && !this.state.formErrors[i]) {
        formValid = false;
      }
    }
    this.setState({formValid: formValid});
  }

  /**
   * Handle submit
   *
   * @param event
   */
  handleSubmit = event => {
    const { id, name, height, weight } = this.state;
    event.preventDefault();
    this.props.onSubmit({
      id: id ? id : shortid.generate(),
      name: name,
      height: height,
      weight: weight,
    });
    this.setState({
      id: "",
      name: "",
      height: "",
      weight: "",
      formValid: false
    });
  };

  /**
   * Set state when component did update
   *
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.update.hasOwnProperty('id') && !this.state.formEdit) {
      const { update } = this.props;
      this.setState({
        id: update.id,
        name: update.name,
        height: update.height,
        weight: update.weight,
        formErrors: {
          name: true,
          height: true,
          weight: true,
        },
        formEdit: true,
        formValid: true
      });
    } else if (!this.props.update.hasOwnProperty('id') && this.state.formEdit) {
      this.setState({
        formEdit: false,
      });
    }
  };

  /**
   * Render form
   *
   * @returns {*}
   */
  render() {
    const { name, height, weight, formValid } = this.state;
    const { update} = this.props;
    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              name='name'
              value={name}
              onChange={this.handleChange}
              type='text'
              id='name'
              className='form-control'
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Height</label>
            <input
              name='height'
              value={height}
              onChange={this.handleChange}
              type='number'
              id='height'
              className='form-control'
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Weight</label>
            <input
              name='weight'
              value={weight}
              onChange={this.handleChange}
              type='number'
              id='weight'
              className='form-control'
            />
          </div>
          {update.hasOwnProperty('id') ?
            <button className='btn btn-success' onClick={this.handleSubmit} disabled={!formValid}>Update patient</button> :
            <button className='btn btn-primary' onClick={this.handleSubmit} disabled={!formValid}>Add patient</button>
          }
        </form>
      </div>
    );
  }
}
