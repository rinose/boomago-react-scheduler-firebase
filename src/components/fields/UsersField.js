import React from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withTranslation } from 'react-i18next';
import {
  GetUsers
} from "../../helpers/db";
import { LocalStorage } from '../../helpers/utils';

export class UsersField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    this.updateItems();
  }

  updateItems() {
    this.getUsers();
  }

  getUsers() {
    let newItems = []
    GetUsers( LocalStorage.getCurrentStructureId() , true).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = doc.data();
        newItems.push(data);
      });
      this.setState({
        items: newItems,
      })
    })
  }

  render() {
    const { t } = this.props;
    const { items } = this.state;
    if (items.length === 0) return(<div></div>);
    var defaultValue = items.find( (item) => { return String(item.id) === String(this.props.defaultValue) && this.props.defaultValue} );
    defaultValue = defaultValue ? defaultValue : {name:"", lastname:"", address:"", city:"", id:0};
    const optionLabel = (option) => `${option.lastname} ${option.name} ${option.address ? option.address : ""} ${option.city ? option.city : ""}`
    return(
      <Autocomplete
          options={items.sort((a, b) => -b.lastname.localeCompare(a.lastname))}
          getOptionLabel={option => optionLabel(option)}
          defaultValue={defaultValue}
          onChange={(e, obj) => {
            this.props.onChange(obj)
          }}
          renderInput={params => (
            <TextField {...params}
            label={t("Customer")}
            margin="normal" 
            variant="outlined" 
            fullWidth />
          )}
        />
    );
  }
}

export default withTranslation()(UsersField);
