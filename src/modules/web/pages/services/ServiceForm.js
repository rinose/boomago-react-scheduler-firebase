import React from 'react';
import TextField from '@material-ui/core/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { withTranslation } from 'react-i18next';
import 'date-fns';

import Autocomplete from '@material-ui/lab/Autocomplete';

export class ServiceForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.state.onRequestClose()
    this.props.service.id ? this.state.onEdit(this.state.service) :
      this.state.onCreate(this.state.service)
  }

  handleDelete = e => {
    e.preventDefault();
    this.state.onRequestClose()
    this.state.onDelete(this.state.service)
  }
  handleCancel = e => {
    e.preventDefault();
    this.state.onRequestClose()
  }


  render() {
    const { t, categories } = this.props;
    return (
      <form
        onSubmit={e => this.handleSubmit(e)}
      >
        <RaisedButton
          className={this.props.service.title ? '' : 'd-none'}
          label="Delete"
          type="button"
          secondary={true}
          onClick={this.handleDelete}
        />
        <div>
          <TextField
            id="name"
            defaultValue={this.state.service.name}
            label={t("ServiceName")}
            onChange={(e) => this.setState({service: {...this.state.service, name: e.target.value}})}
          />
          <TextField
            id="description"
            defaultValue={this.state.service.description}
            label={t("Description")}
            onChange={(e) => this.setState({service: {...this.state.service, description: e.target.value}})}
          />
        <Autocomplete
          id="category"
          options={categories.sort((a, b) => -b.title.localeCompare(a.title))}
          getOptionLabel={option => option.title}
          freeSolo
          renderInput={params => (
            <TextField {...params} 
            defaultValue={this.state.service.category}
            onChange={(e) => this.setState({service: {...this.state.service, category: e.target.value}})}
            label={t("Category")}
            margin="normal" 
            variant="outlined" 
            fullWidth />
          )}
        />
        </div>
        <div>
          <RaisedButton
            className={this.props.service.title ? ' mr-3 my-3' : 'd-none mr-3 my-3'}
            label="Update"
            primary={true}
            type="submit"
          />
          <RaisedButton
            className={this.props.service.title ? 'd-none mr-3 my-3' : 'mr-3 my-3'}
            label="Create"
            primary={true}
            type="submit"
          />
          <RaisedButton
            className={'mr-3 my-3'}
            label="Cancel"
            type="Cancel"
            onClick={this.handleCancel}
          />

        </div>

      </form>
    );
  }
}

export default withTranslation()(ServiceForm);