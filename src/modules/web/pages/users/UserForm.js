import React from 'react';
import TextField from '@material-ui/core/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { withTranslation } from 'react-i18next';
import 'date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';

export class UserForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.state.onSave(this.state.user);
  }

  handleDelete = e => {
    e.preventDefault();
    this.state.onRequestClose()
    this.state.onDelete(this.state.user)
  }
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel()
  }


  render() {
    const { t, categories } = this.props;
    return (
      <form
        onSubmit={e => this.handleSubmit(e)}
      >
        <RaisedButton
          className={!this.props.user ? '' : 'd-none'}
          label="Delete"
          type="button"
          secondary={true}
          onClick={this.handleDelete}
        />
        <div>
          <TextField
            id="name"
            defaultValue={this.state.user.name}
            label={t("UserName")}
            onChange={(e) => this.setState({user: {...this.state.user, name: e.target.value}})}
          />
          <TextField
            id="surname"
            defaultValue={this.state.user.lastname}
            label={t("LastName")}
            onChange={(e) => this.setState({user: {...this.state.user, lastname: e.target.value}})}
          />
          <TextField
            id="phone"
            defaultValue={this.state.user.phone}
            label={t("Phone")}
            onChange={(e) => this.setState({user: {...this.state.user, phone: e.target.value}})}
          />
          {
            (!this.props.quick) &&
            <div>
              <TextField
                id="description"
                defaultValue={this.state.user.description}
                label={t("Description")}
                onChange={(e) => this.setState({user: {...this.state.user, description: e.target.value}})}
              />
              <Autocomplete
                id="category"
                options={categories ? categories.sort((a, b) => -b.title.localeCompare(a.title)) : []}
                getOptionLabel={option => option.title}
                freeSolo
                renderInput={params => (
                  <TextField {...params} 
                  defaultValue={this.state.user.category}
                  onChange={(e) => this.setState({user: {...this.state.user, category: e.target.value}})}
                  label={t("Category")}
                  margin="normal" 
                  variant="outlined" 
                  fullWidth />
                )}
              />
            </div>
          }
        </div>
        <div>
          <RaisedButton
            className={this.props.user.title ? ' mr-3 my-3' : 'd-none mr-3 my-3'}
            label="Update"
            primary={true}
            type="submit"
          />
          <RaisedButton
            className={this.props.user.title ? 'd-none mr-3 my-3' : 'mr-3 my-3'}
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

export default withTranslation()(UserForm);