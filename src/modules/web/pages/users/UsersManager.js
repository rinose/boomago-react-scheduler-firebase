import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

function UsersManager( props) {
  const [users, setUsers] = useState([]);
  //const [selectedItem, setSelectedItem] = useState(false);
  //const [categories, setCategories] = useState([]);

  
  useEffect(() => {

    const getUsers = (fromCache) => {
      let newUsers = []
      GetUsers(props.sid, fromCache).then(querySnapshot => {
        var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Data came from " + source);
        //let newCategories = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          newUsers.push(data);
          //if(data.category && !(data.category in newCategories)) {
          //  newCategories.push({"title": data.category});
          //}
        });
        setUsers(newUsers);
        //setCategories(newCategories);
      })
    }

    getUsers();
  }, [props.sid]);



  //const handleAddUser = () => {
  //  setSelectedItem({});
  //}


  const saveUser = (user) => {
    user.id = user.id ? user.id : uuidv4();
    UpdateUsers(props.sid, user.id).set(user).then(
      //getUsers(false)
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }


  const deleteUser = (item) => {
    DeleteUser(item.id).then(
      //updateServices()
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }


    const { t } = props;
    return (
      <div>
        <div><strong>{t("Users")}</strong></div>
        <TableViewComponent
        onAdd={saveUser}
        onEdit={saveUser}
        onDelete={deleteUser}
        data={users} 
        columns={usersSchema}/>
      </div>
    )
}

export default withTranslation()(UsersManager);
