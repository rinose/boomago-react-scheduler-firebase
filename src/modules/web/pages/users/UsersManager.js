import React, { Component } from 'react';
import uuidV4 from 'uuid/v4'
import { withTranslation } from 'react-i18next';
import TableViewComponent from '../../../../components/TableViewComponent'
//Actions
import {
  GetUsers,
  UpdateUsers,
  DeleteUser
} from "../../../../helpers/db";

const usersSchema = [
  { title: 'Nome', field: 'name' },
  { title: 'Cognome', field: 'lastname'},
  { title: 'Telefono', field: 'phone'},
  { title: 'Indirizzo', field: 'address'},
  { title: 'Città', field: 'city'},
  { title: 'Pr', field: 'province'},
  { title: 'Note', field: 'notes'},
  { title: 'Data Nascita', field: 'birthday', type: 'date'},
  { title: 'Data inserimento', field: 'timestamp', type: 'datetime', editable: 'never'}
]

class UsersManager extends Component {

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      selectedItem: false
    }

    this.categories = [];
  }

  componentDidMount() {
    console.log("UsersManager componentDidMount")
    this.updateUsers(true);
  }

  handleAddUser() {
    this.setState({
      selectedItem: {}
    });
  }
  onSaveUser = (user) => {
    user.id = user.id ? user.id : uuidV4();
    UpdateUsers(user.id).set(user).then(
      this.updateUsers(false)
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }
  onDeleteUser = (item) => {
    DeleteUser(item.id).then(
      //this.updateServices()
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }

  updateUsers(fromCache) {
    this.getUsers(fromCache);
  }
  getUsers(fromCache) {
    let newUsers = []
    GetUsers(fromCache).then(querySnapshot => {
      var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
      console.log("Data came from " + source);
      this.categories = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        newUsers.push(data);
        if(data.category && !(data.category in this.categories))
        this.categories.push({"title": data.category});
      });
      this.setState({
        users: newUsers,
      })
    })
  }

  render() {

    const { t } = this.props;
    const { users } = this.state;
    return (
      <div>
        <div><strong>{t("Users")}</strong></div>
        { (users.length > 0) &&
        <TableViewComponent
        onAdd={this.onSaveUser}
        onEdit={this.onSaveUser}
        onDelete={this.onDeleteUser}
        data={users} 
        columns={usersSchema}/>
        }
      </div>
    )
  }

}

export default withTranslation()(UsersManager);
